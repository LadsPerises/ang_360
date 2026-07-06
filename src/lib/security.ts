/**
 * Security Utilities for Angola360 Admin
 * Centralizes sanitization, hashing, and audit logging.
 */

// ─── 1. Input Sanitization (XSS Prevention) ─────────────────────────────────
/**
 * Strips dangerous HTML tags and attributes from a string.
 * Use this before storing or rendering any user-provided input.
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

/**
 * Strips all HTML tags from a string (for plain text fields).
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

// ─── 2. Password Hashing (Web Crypto API) ────────────────────────────────────
/**
 * Hashes a password using SHA-256 via the native Web Crypto API.
 * This avoids storing or comparing plain-text passwords in the code.
 * In production, hashing MUST happen on the server (e.g., bcrypt).
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─── 3. Audit Log ─────────────────────────────────────────────────────────────
const AUDIT_LOG_KEY = 'angola360_audit_log';
const MAX_LOG_ENTRIES = 200;

export type AuditEntry = {
  timestamp: string;
  adminEmail: string;
  action: string;
  resource: string;
  details?: string;
};

export function writeAuditLog(entry: Omit<AuditEntry, 'timestamp'>) {
  try {
    const existing: AuditEntry[] = JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]');
    const newEntry: AuditEntry = { ...entry, timestamp: new Date().toISOString() };
    const updated = [newEntry, ...existing].slice(0, MAX_LOG_ENTRIES);
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(updated));
  } catch {
    // Storage quota — fail silently
  }
}

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
