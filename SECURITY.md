# Segurança — Angola360

Este documento descreve as medidas de segurança implementadas e o checklist
obrigatório antes de cada deploy em produção.

---

## 🚨 Ação obrigatória ANTES do próximo deploy

### 1. Trocar a password MySQL na Hostinger

A password `Naruto_u144936411_WQh3j` foi commitada no git (commit `b64563d`).
**Mesmo após ter sido removida do código atual, ela permanece no histórico.**
Tem que ser considerada comprometida PARA SEMPRE.

1. Entra no painel da Hostinger → **Bases de Dados → MySQL**
2. Abre `u144936411_angola360_` → **Gestão de utilizadores**
3. Troca a password do utilizador `u144936411_lauzen_360`
4. Atualiza o ficheiro `.env` no servidor (fora de `public_html/`) com a nova password

### 2. Limpar credenciais do histórico do git (recomendado)

Se o repositório ainda não foi pushed para GitHub/GitLab público, limpa o histórico:

```bash
# Opção A — filtrar o histórico (mantém commits, reescreve conteúdo)
git filter-repo --replace-text <(echo 'Naruto_u144936411_WQh3j==>***REMOVED***')

# Opção B (mais simples) — squash histórico numa só commit limpa
git checkout --orphan clean-main
git add -A
git commit -m "feat: initial commit (history cleaned for security)"
git branch -D main
git branch -m main
git push -f origin main   # ⚠️ forçar push reescreve o remoto
```

> ⚠️ **Se o repo já foi pushed para partilha pública**: assume que a password foi
> recolhida. **Troca a password IMEDIATAMENTE** (passo 1) — limpar o histórico
> depois de vazado não adianta.

---

## ✅ Medidas implementadas nesta auditoria

### Backend PHP (`public/api/`)

| # | Medida | Ficheiro(s) |
|---|--------|-------------|
| V1 | Credenciais BD em `.env` (fora de `public/`, fora do git) | `db.php`, `.env.example` |
| V2 | CORS whitelist (lê `ALLOWED_ORIGINS` do `.env`) | `db.php` |
| V3 | `requireAdmin()` em todos os endpoints `/api/admin/*` | `security.php`, `admin/*.php` |
| V4 | Mensagens de erro genéricas em produção (`safeException`) | `security.php` |
| V5 | Hardening de upload (MIME + `getimagesize` + extensão do MIME) | `security.php::sanitizeAndSaveAvatar` |
| V6 | Sessão PHP httpOnly + SameSite=Strict (cookie não acessível por JS) | `security.php::startUserSession` |
| V7 | `user_id` SEMPRE da sessão, nunca do payload (anti-IDOR) | `sync_passport.php`, `upload_avatar.php` |
| V8 | CSP reforçada no servidor + SPA | `index.html`, `.htaccess` |
| V9 | Rate limiting por IP (login 5/15min, register 5/1h, upload 10/1h) | `security.php::checkRateLimit` |
| V10 | Política de senha forte (8+ chars, letras + números) | `security.php::validatePassword` |
| V11 | `.htaccess` bloqueia `.env`, `*.sql`, `*.log`, ficheiros ponto | `.htaccess` |
| V12 | PHP desativado em `/uploads/` (anti-webshell) | `.htaccess` |
| V13 | Forçar HTTPS + HSTS preload | `.htaccess` |
| V14 | Prepared statements em todos os queries | todos |
| V15 | `password_hash` bcrypt + `password_verify` | `register.php`, `login.php` |

### Frontend (`src/`)

| # | Medida | Ficheiro |
|---|--------|----------|
| F1 | `AuthContext` sem hash hardcoded (chama `/api/admin/login.php`) | `contexts/AuthContext.tsx` |
| F2 | `credentials: 'include'` em todos os `fetch` (envia cookie de sessão) | todas as stores |
| F3 | `useUserAuthStore` com `credentials: 'include'` + anti-IDOR | `store/useUserAuthStore.ts` |
| F4 | `usePassportStore.loadFromServer()` sem `userId` (anti-IDOR) | `store/usePassportStore.ts` |
| F5 | Comentário com a senha `Angola360@2026` removido | `contexts/AuthContext.tsx` |
| F6 | Removido `hashPassword` client-side (sem efeito, bcrypt no servidor) | `lib/security.ts` |

### Headers / Transporte

- `Content-Security-Policy` (no HTML + reforçada no `.htaccess`)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- HTTPS forçado via `.htaccess`

---

## 📋 Checklist pré-deploy

Antes de enviar para produção, confirmar **todos** os itens:

### Credenciais
- [ ] Password MySQL da Hostinger **trocada** (a antiga está comprometida)
- [ ] Ficheiro `.env` criado no servidor (fora de `public_html/`)
- [ ] `.env` contém `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`, `ALLOWED_ORIGINS`
- [ ] `ALLOWED_ORIGINS` aponta para `https://angola360.ao` (NÃO `*`)
- [ ] `.env` NÃO está no git (`git ls-files | grep .env` deve devolver vazio)

### Servidor
- [ ] HTTPS ativo (Let's Encrypt via Hostinger)
- [ ] `.htaccess` deployed para `public_html/`
- [ ] Pasta `/uploads/` existe e tem permissões `0755`
- [ ] Ficheiros PHP em `public_html/api/` (com subpasta `admin/`)

### Aplicação
- [ ] Build de produção gerado (`npm run build`)
- [ ] Conteúdo de `dist/` copiado para `public_html/`
- [ ] Teste de login admin: deve falhar após 5 tentativas erradas
- [ ] Teste de IDOR: `curl /api/sync_passport.php` sem cookie → deve dar 401
- [ ] Teste de CORS: request de domínio não permitido → deve ser rejeitado

### Git
- [ ] Histórico não contém a string da password antiga
- [ ] Repo NUNCA pushed para público sem limpar histórico

---

## 🧪 Como testar as proteções

```bash
# 1. IDOR — tentar aceder a sync_passport sem login
curl -i https://angola360.ao/api/sync_passport.php -X POST \
  -H "Content-Type: application/json" -d '{}'
# Esperado: 401 "Não autenticado."

# 2. Broken Access Control — tentar listar utilizadores sem sessão admin
curl -i https://angola360.ao/api/admin/users.php
# Esperado: 401 "Não autenticado."

# 3. Rate limiting — 6 logins errados seguidos
for i in 1 2 3 4 5 6; do
  curl -s -X POST https://angola360.ao/api/admin/login.php \
    -H "Content-Type: application/json" \
    -d '{"email":"x@x.com","password":"errada"}' | head -c 80; echo
done
# Esperado: 6ª resposta = "Demasiadas tentativas. Conta bloqueada por 15 minutos."

# 4. CORS — request de origem não autorizada
curl -i https://angola360.ao/api/me.php \
  -H "Origin: https://site-malicioso.com"
# Esperado: resposta SEM header Access-Control-Allow-Origin
```

---

## 🔮 Próximos passos recomendados (não bloqueantes para MVP)

- Migrar rate limiting de ficheiro temporário para Redis/Memcached (escala)
- Adicionar Turnstile/reCAPTCHA no login (camada extra anti-bot)
- Implementar audit log no servidor (tabela `audit_log` em MySQL)
- Adicionar renovação de sessão com refresh token (sliding session)
- Configurar backups automáticos da BD na Hostinger
- Monitorização de erros (Sentry ou equivalente)
