<?php
/**
 * Envio do formulário de contato da Polisopor.
 *
 * Fica em public_html/enviar-contato.php, ao lado dos arquivos estáticos, e é a
 * única peça de PHP do site.
 *
 * Por que PHP e não um serviço de formulário: o site é estático, então precisa de
 * alguém para despachar o e-mail. A hospedagem já é cPanel com PHP, e o destino
 * (vendas@polisopor.com.br) é uma caixa do mesmo domínio no mesmo servidor — ou
 * seja, entrega local, sem depender de terceiro, sem cadastro, sem limite mensal
 * e sem o e-mail sair de um remetente estranho ao domínio.
 *
 * Responde JSON para o formulário mostrar o resultado sem recarregar a página.
 */

declare(strict_types=1);

const DESTINO = 'vendas@polisopor.com.br';
const ASSUNTO_PREFIXO = 'Site Polisopor';

/** Limites generosos, mas que impedem corpo de mensagem absurdo. */
const LIMITES = [
    'nome' => 120,
    'empresa' => 120,
    'telefone' => 40,
    'email' => 190,
    'produto' => 120,
    'mensagem' => 5000,
    'origem' => 160,
];

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

/**
 * mbstring não é garantida em hospedagem compartilhada.
 *
 * Sem o guard, a ausência da extensão derruba o script com erro fatal e o
 * visitante recebe uma página branca em vez da mensagem de erro. As duas funções
 * usadas ganham equivalente suficiente: `substr` corta em bytes (aceitável num
 * limite de segurança) e o assunto vai sem codificação MIME, o que só afeta
 * acento no título do e-mail.
 */
if (!function_exists('mb_substr')) {
    function mb_substr(string $s, int $inicio, ?int $tamanho = null): string
    {
        return $tamanho === null ? substr($s, $inicio) : substr($s, $inicio, $tamanho);
    }
}
if (!function_exists('mb_encode_mimeheader')) {
    // A assinatura aceita o charset para casar com as chamadas do script, mesmo
    // que o fallback sempre codifique em UTF-8.
    function mb_encode_mimeheader(string $s, ?string $charset = null): string
    {
        return '=?UTF-8?B?' . base64_encode($s) . '?=';
    }
}

function responder(int $codigo, array $dados): never
{
    http_response_code($codigo);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    responder(405, ['ok' => false, 'erro' => 'Método não permitido.']);
}

/**
 * Remove quebra de linha e caracteres de controle.
 *
 * Este é o ponto crítico de segurança de qualquer formulário em PHP: um \r\n num
 * campo que vá para o cabeçalho do e-mail permite injetar cabeçalhos próprios e
 * transformar o formulário num relay de spam. A limpeza é aplicada em tudo, e não
 * só nos campos que vão para cabeçalho, porque é barato e evita esquecimento
 * numa alteração futura.
 */
function limpar(string $valor, int $limite): string
{
    $valor = str_replace(["\r", "\n", "\0"], ' ', $valor);
    $valor = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $valor) ?? '';
    return mb_substr(trim($valor), 0, $limite);
}

/** A mensagem é a única que preserva parágrafos — ela vai no corpo, não no cabeçalho. */
function limparCorpo(string $valor, int $limite): string
{
    $valor = str_replace(["\r\n", "\r"], "\n", $valor);
    $valor = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $valor) ?? '';
    return mb_substr(trim($valor), 0, $limite);
}

$campos = [];
foreach (LIMITES as $nome => $limite) {
    $bruto = (string) ($_POST[$nome] ?? '');
    $campos[$nome] = $nome === 'mensagem'
        ? limparCorpo($bruto, $limite)
        : limpar($bruto, $limite);
}

// Armadilha para robô: o campo fica escondido no formulário, então visitante
// nenhum o preenche. Respondemos sucesso de propósito — dizer "bloqueado" só
// ensina o robô a tentar de outro jeito.
if (trim((string) ($_POST['site'] ?? '')) !== '') {
    responder(200, ['ok' => true]);
}

$faltando = [];
foreach (['nome', 'telefone', 'email', 'mensagem'] as $obrigatorio) {
    if ($campos[$obrigatorio] === '') {
        $faltando[] = $obrigatorio;
    }
}
if ($faltando !== []) {
    responder(422, [
        'ok' => false,
        'erro' => 'Preencha os campos obrigatórios.',
        'campos' => $faltando,
    ]);
}

if (!filter_var($campos['email'], FILTER_VALIDATE_EMAIL)) {
    responder(422, ['ok' => false, 'erro' => 'E-mail inválido.', 'campos' => ['email']]);
}

$produto = $campos['produto'] !== '' ? $campos['produto'] : 'Não informado';
$assunto = sprintf('%s: %s', ASSUNTO_PREFIXO, $produto);

$corpo = implode("\n", [
    'Novo contato pelo site polisopor.com.br',
    '',
    'Nome......: ' . $campos['nome'],
    'Empresa...: ' . ($campos['empresa'] !== '' ? $campos['empresa'] : '—'),
    'Telefone..: ' . $campos['telefone'],
    'E-mail....: ' . $campos['email'],
    'Produto...: ' . $produto,
    'Origem....: ' . ($campos['origem'] !== '' ? $campos['origem'] : '—'),
    '',
    'Mensagem:',
    $campos['mensagem'],
    '',
    str_repeat('-', 52),
    'Enviado em ' . date('d/m/Y \à\s H:i') . ' (horário do servidor)',
    'IP de origem: ' . ($_SERVER['REMOTE_ADDR'] ?? 'desconhecido'),
]);

/**
 * O remetente é uma caixa do próprio domínio, não o e-mail do visitante.
 *
 * Usar o endereço do visitante no From faz o servidor enviar em nome de um
 * domínio que ele não pode autenticar, e a mensagem cai em spam por falha de
 * SPF. O e-mail do visitante vai no Reply-To, então responder no cliente de
 * e-mail continua indo para a pessoa certa.
 */
$remetente = 'nao-responda@polisopor.com.br';
$nomeRemetente = mb_encode_mimeheader('Site Polisopor', 'UTF-8');

$cabecalhos = implode("\r\n", [
    'From: ' . $nomeRemetente . ' <' . $remetente . '>',
    'Reply-To: ' . $campos['email'],
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . phpversion(),
]);

$enviado = mail(
    DESTINO,
    mb_encode_mimeheader($assunto, 'UTF-8'),
    $corpo,
    $cabecalhos,
    '-f' . $remetente
);

if (!$enviado) {
    error_log('[contato] mail() falhou para ' . $campos['email']);
    responder(500, [
        'ok' => false,
        'erro' => 'Não foi possível enviar agora. Chame no WhatsApp (11) 99403-2826.',
    ]);
}

responder(200, ['ok' => true]);
