/**
 * Generates an illustrated SVG data URI fallback so every photo looks like a custom
 * enchanted memory Polaroid before you plug in your real Cloudinary credentials.
 */
export function createIllustratedMemorySvg({ title, subtitle, bgStart, bgEnd, accent, iconType }) {
  const iconSvg =
    iconType === 'chai'
      ? `<path d="M85 110 H195 V175 C195 200 175 215 140 215 C105 215 85 200 85 175 Z" fill="${accent}" opacity="0.9"/><path d="M195 125 H218 C228 125 235 133 235 145 C235 157 228 165 218 165 H195" fill="none" stroke="${accent}" stroke-width="10"/><path d="M115 92 Q125 70 115 55 M145 92 Q155 70 145 55 M170 92 Q180 70 170 55" stroke="#fff3cd" stroke-width="5" fill="none" stroke-linecap="round"/>`
      : iconType === 'scooty'
      ? `<circle cx="105" cy="185" r="24" fill="#1f242d" stroke="${accent}" stroke-width="7"/><circle cx="205" cy="185" r="24" fill="#1f242d" stroke="${accent}" stroke-width="7"/><path d="M105 185 L135 130 H185 L205 185 M120 150 H190 M175 130 L195 95 H215" stroke="${accent}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
      : iconType === 'train'
      ? `<rect x="75" y="90" width="160" height="105" rx="18" fill="${accent}"/><rect x="95" y="108" width="52" height="38" rx="6" fill="#1a1228"/><rect x="163" y="108" width="52" height="38" rx="6" fill="#1a1228"/><circle cx="110" cy="175" r="10" fill="#1a1228"/><circle cx="200" cy="175" r="10" fill="#1a1228"/><path d="M65 212 H245" stroke="#f5d77f" stroke-width="6"/>`
      : iconType === 'rain'
      ? `<path d="M95 145 C80 145 70 132 75 116 C80 96 105 92 115 102 C128 82 162 82 175 102 C192 96 215 108 215 128 C215 142 200 145 188 145 Z" fill="${accent}"/><path d="M105 162 L92 195 M135 162 L122 195 M165 162 L152 195 M192 162 L179 195" stroke="#9ec5fe" stroke-width="6" stroke-linecap="round"/>`
      : iconType === 'karaoke'
      ? `<rect x="132" y="75" width="46" height="72" rx="23" fill="${accent}"/><path d="M112 115 C112 145 198 145 198 115" fill="none" stroke="#fff3cd" stroke-width="7"/><path d="M155 148 V200 M125 200 H185" stroke="#fff3cd" stroke-width="8" stroke-linecap="round"/>`
      : iconType === 'dog'
      ? `<circle cx="155" cy="145" r="46" fill="${accent}"/><ellipse cx="112" cy="125" rx="16" ry="30" transform="rotate(-20 112 125)" fill="#8d5524"/><ellipse cx="198" cy="125" rx="16" ry="30" transform="rotate(20 198 125)" fill="#8d5524"/><circle cx="138" cy="136" r="6" fill="#1a1228"/><circle cx="172" cy="136" r="6" fill="#1a1228"/><ellipse cx="155" cy="154" rx="12" ry="9" fill="#1a1228"/>`
      : iconType === 'pizza'
      ? `<polygon points="155,70 90,200 220,200" fill="${accent}" stroke="#f59f00" stroke-width="8"/><circle cx="145" cy="140" r="10" fill="#c92a2a"/><circle cx="170" cy="168" r="10" fill="#c92a2a"/><circle cx="130" cy="175" r="9" fill="#c92a2a"/>`
      : `<polygon points="155,72 175,122 228,126 186,160 199,212 155,182 111,212 124,160 82,126 135,122" fill="${accent}"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 260" width="310" height="260">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgStart}"/>
        <stop offset="100%" stop-color="${bgEnd}"/>
      </linearGradient>
    </defs>
    <rect width="310" height="260" rx="16" fill="url(#bg)" stroke="#d4af37" stroke-width="4"/>
    <rect x="14" y="14" width="282" height="186" rx="10" fill="rgba(12, 9, 20, 0.45)" stroke="rgba(212, 175, 55, 0.35)" stroke-width="1.5"/>
    <circle cx="44" cy="42" r="3" fill="#fff3cd" opacity="0.8"/>
    <circle cx="268" cy="54" r="4" fill="#ffd43b" opacity="0.7"/>
    <circle cx="62" cy="170" r="2.5" fill="#fff3cd" opacity="0.6"/>
    ${iconSvg}
    <text x="155" y="224" text-anchor="middle" fill="#f8f0d8" font-family="Georgia, serif" font-size="15" font-weight="bold">${title}</text>
    <text x="155" y="244" text-anchor="middle" fill="#d4af37" font-family="Georgia, serif" font-size="11.5">${subtitle}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}