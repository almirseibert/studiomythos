// ============================================================================
// CONTATO — Studio Mythos
// ----------------------------------------------------------------------------
// Dados de contato usados em todo o site público (landing, páginas de serviço,
// rodapé). Centralizado aqui para alterar o número/e-mail em um único lugar.
// ============================================================================

export const CONTATO = {
  // Número no formato internacional, só dígitos (para o link wa.me)
  whatsapp: '5551983108144',
  // Como o número aparece na tela
  whatsappDisplay: '(51) 98310-8144',
  email: 'contato@studiomythos.com.br',
};

// Monta um link de WhatsApp com mensagem pré-preenchida.
export function whatsappLink(mensagem = 'Olá! Gostaria de solicitar um orçamento.') {
  return `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
