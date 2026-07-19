/**
 * Security Utilities for Angola360
 *
 * NOTA: A validação real de senhas, sessões e rate limiting acontece no
 * backend PHP (public/api/security.php). Este ficheiro contém apenas
 * utilitários client-side (sanitização para display + audit log local).
 *
 * Em produção, o audit log deve também ser registado no servidor.
 */

// ─── 1. Input Sanitization (XSS Prevention para display) ───────────────────
/**
 * Escapa caracteres HTML perigosos. Usar ANTES de inserir input de utilizador
 * em qualquer sítio que possa ser interpretado como HTML.
 * (React já escapa por defeito em {expressões} — isto é para edge cases.)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/** Remove todas as tags HTML. */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

// ─── 2. Audit Log (local — complementar ao do servidor) ────────────────────
// Em MVP, mantém um espelho client-side para visualização rápida no painel.
// A fonte de verdade deve ser o log do servidor (error_log + tabela própria).
const AUDIT_LOG_KEY = 'angola360_audit_log';

export type AuditEntry = {
  timestamp: string;
  adminEmail: string;
  action: string;
  resource: string;
  details?: string;
};

export function readAuditLog(): AuditEntry[] {
  try {
    return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearAuditLog() {
  localStorage.removeItem(AUDIT_LOG_KEY);
}
