const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'assets', 'images', 'provinces');
if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }

const provinces = [
  'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango',
  'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla',
  'Icolo e Bengo', 'Luanda', 'Lunda Norte', 'Lunda Sul',
  'Malanje', 'Moxico', 'Moxico Leste', 'Namibe', 'Uíge', 'Zaire'
];

const colors = [
  ['#ff9a9e', '#fecfef'], ['#a18cd1', '#fbc2eb'], ['#84fab0', '#8fd3f4'],
  ['#fccb90', '#d57eeb'], ['#e0c3fc', '#8ec5fc'], ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'], ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'],
  ['#30cfd0', '#330867'], ['#a1c4fd', '#c2e9fb'], ['#fdcbf1', '#e6dee9'],
  ['#cfd9df', '#e2ebf0'], ['#a8edea', '#fed6e3'], ['#89f7fe', '#66a6ff'],
  ['#fdfbfb', '#ebedee'], ['#ffecd2', '#fcb69f'], ['#ff9a9e', '#fecfef'],
  ['#f6d365', '#fda085'], ['#84fab0', '#8fd3f4']
];

provinces.forEach((prov, i) => {
  const [c1, c2] = colors[i % colors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="grad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="100%" stop-color="${c2}" />
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#grad${i})" />
    <circle cx="400" cy="300" r="200" fill="white" opacity="0.15" />
    <path d="M0,600 L800,600 L800,450 Q600,400 400,500 T0,450 Z" fill="white" opacity="0.25" />
    <text x="400" y="320" font-family="sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle" opacity="0.9">${prov}</text>
  </svg>`;
  
  const safeName = prov.replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  fs.writeFileSync(path.join(dir, safeName + '.svg'), svg);
});

console.log("SVGs gerados com sucesso!");
