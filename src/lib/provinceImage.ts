// ═══════════════════════════════════════════════════════════════════════════
// GERADOR DE IMAGENS DE PROVÍNCIAS — Angola360
// ═══════════════════════════════════════════════════════════════════════════
// Gera placeholders SVG temáticos (cores de Angola + nome da província) como
// data URLs. Garante que SEMPRE há uma imagem visível, sem dependência de rede.
//
// Quando tiveres fotos reais, coloca-as em:
//   public/assets/images/provinces/{slug}.jpg
// e troca o `getProvinceImage` para devolver o caminho local.
// ═══════════════════════════════════════════════════════════════════════════

// Paleta de gradientes inspirada nas cores de Angola (variação por província)
const GRADIENTS: Array<[string, string]> = [
  ['#D62626', '#7a1414'], // vermelho Angola
  ['#F7D00F', '#D62626'], // amarelo → vermelho
  ['#1a4d2e', '#0f2a1a'], // verde floresta (Maiombe)
  ['#0a4d68', '#03293d'], // azul oceano (costa)
  ['#8B4513', '#3d1f08'], // castanho terra (deserto/savana)
  ['#F7D00F', '#8B6914'], // dourado savana
  ['#4a0e2e', '#1a0510'], // vinho (planalto)
  ['#1a3a5c', '#0a1a2e'], // azul-noite capital
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Gera um data URL SVG com um gradiente temático + nome da província + padrão.
 * Dimensões padrão 800x600 (4:3) — adjustável.
 */
export function generateProvincePlaceholder(
  name: string,
  width = 800,
  height = 600,
): string {
  const gradientIdx = hashString(name) % GRADIENTS.length;
  const [color1, color2] = GRADIENTS[gradientIdx];

  // Padrão de pontos decorativo (simula um "mapa" estilizado)
  const dots = Array.from({ length: 24 }, (_, i) => {
    const x = (i % 6) * (width / 6) + (width / 12);
    const y = Math.floor(i / 6) * (height / 4) + (height / 8);
    const r = 2 + (hashString(name + i) % 4);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="${0.05 + (i % 3) * 0.05}"/>`;
  }).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color1}"/>
      <stop offset="100%" stop-color="${color2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="white" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>
  ${dots}
  <text x="50%" y="48%" text-anchor="middle" dominant-baseline="middle"
        font-family="'Outfit', 'Inter', sans-serif" font-size="${Math.floor(width / 14)}"
        font-weight="900" fill="white" opacity="0.95">${name}</text>
  <text x="50%" y="60%" text-anchor="middle" dominant-baseline="middle"
        font-family="'Inter', sans-serif" font-size="${Math.floor(width / 32)}"
        font-weight="500" fill="white" opacity="0.7" letter-spacing="6">ANGOLA</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Devolve a imagem de uma província.
 * Por agora: placeholder SVG gerado.
 * TODO: quando houver foto real em public/assets/images/provinces/{slug}.jpg,
 * devolver `/assets/images/provinces/${slug}.jpg` em vez do placeholder.
 */
export function getProvinceImage(name: string): string {
  const slug = slugify(name);
  // Verificação futura: se o ficheiro real existir, usá-lo.
  // Por agora, retorna sempre o placeholder.
  void slug;
  return generateProvincePlaceholder(name);
}

/** Atalho para gerar imagem genérica de "tour" (hero/destaque) */
export function generateTourPlaceholder(title: string, province: string): string {
  return generateProvincePlaceholder(`${title} • ${province}`.slice(0, 28));
}
