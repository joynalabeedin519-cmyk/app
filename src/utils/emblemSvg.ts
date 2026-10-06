/**
 * Generates an SVG data URL for the exact Cyber Sentinel Bangladesh emblem
 * with transparent background, matching the user's uploaded logo design:
 * - Red circular aura behind the hooded hacker
 * - Cyan futuristic horizontal circuit traces left and right
 * - Hooded hacker with glowing red visor eyes & tactical vertical-slat respirator
 * - Tactical gloved hands holding the sides of the amber biohazard shield
 * - Bold 'CYBER SENTINEL BANGLADESH' typography
 * - Completely transparent background outside and behind the characters
 */
export function generateEmblemSvg(
  title: string = 'CYBER SENTINEL',
  subtitle: string = 'BANGLADESH',
  titleColor: string = '#7dd3fc',
  subtitleColor: string = '#f87171'
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <!-- Glowing neon filters -->
    <filter id="neon-glow-cyan" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="6" result="blur1" />
      <feMerge>
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="red-aura-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="14" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="red-eye-flare" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="drop-shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.9"/>
    </filter>

    <!-- Gradients -->
    <linearGradient id="shield-amber" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="40%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>

    <linearGradient id="shield-rim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#b45309" />
      <stop offset="100%" stop-color="#78350f" />
    </linearGradient>

    <radialGradient id="red-bg-aura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#dc2626" stop-opacity="0.9" />
      <stop offset="65%" stop-color="#991b1b" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#7f1d1d" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="hood-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="35%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>
  </defs>

  <!-- 1. Center Red Aura Circle behind head (Semi-transparent) -->
  <circle cx="400" cy="360" r="230" fill="url(#red-bg-aura)" filter="url(#red-aura-glow)" />

  <!-- 2. Cyan Tech Rings & Outer Blue Ring -->
  <circle cx="400" cy="400" r="388" fill="none" stroke="#2563eb" stroke-width="6" opacity="0.95" />
  <circle cx="400" cy="370" r="280" fill="none" stroke="#38bdf8" stroke-width="4.5" opacity="0.85" filter="url(#neon-glow-cyan)" />
  <circle cx="400" cy="370" r="264" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="16 12 32 12" opacity="0.75" />

  <!-- 3. Horizontal Cyber Circuit Traces (Left & Right) -->
  <!-- Left Circuit Traces -->
  <g stroke="#38bdf8" stroke-width="3" fill="none" opacity="0.9" filter="url(#neon-glow-cyan)">
    <!-- Circuit Line 1 -->
    <path d="M 12 320 L 120 320 L 160 350 L 220 350" />
    <circle cx="220" cy="350" r="4.5" fill="#38bdf8" />
    <!-- Circuit Line 2 -->
    <path d="M 24 370 L 140 370 L 180 395" />
    <circle cx="180" cy="395" r="4" fill="#38bdf8" />
    <!-- Circuit Line 3 -->
    <path d="M 40 420 L 110 420 L 150 445 L 210 445" />
    <circle cx="210" cy="445" r="4.5" fill="#38bdf8" />
    <!-- Additional Left Ticks -->
    <circle cx="90" cy="320" r="3.5" fill="#38bdf8" />
    <circle cx="70" cy="420" r="3.5" fill="#38bdf8" />
    <path d="M 80 280 L 145 280 L 185 315" />
    <circle cx="185" cy="315" r="4" fill="#38bdf8" />
  </g>

  <!-- Right Circuit Traces -->
  <g stroke="#38bdf8" stroke-width="3" fill="none" opacity="0.9" filter="url(#neon-glow-cyan)">
    <!-- Circuit Line 1 -->
    <path d="M 788 320 L 680 320 L 640 350 L 580 350" />
    <circle cx="580" cy="350" r="4.5" fill="#38bdf8" />
    <!-- Circuit Line 2 -->
    <path d="M 776 370 L 660 370 L 620 395" />
    <circle cx="620" cy="395" r="4" fill="#38bdf8" />
    <!-- Circuit Line 3 -->
    <path d="M 760 420 L 690 420 L 650 445 L 590 445" />
    <circle cx="590" cy="445" r="4.5" fill="#38bdf8" />
    <!-- Additional Right Ticks -->
    <circle cx="710" cy="320" r="3.5" fill="#38bdf8" />
    <circle cx="730" cy="420" r="3.5" fill="#38bdf8" />
    <path d="M 720 280 L 655 280 L 615 315" />
    <circle cx="615" cy="315" r="4" fill="#38bdf8" />
  </g>

  <!-- Red Nodes in background circuits -->
  <g fill="#ef4444" opacity="0.8">
    <circle cx="260" cy="280" r="4" />
    <circle cx="295" cy="330" r="4" />
    <circle cx="540" cy="280" r="4" />
    <circle cx="505" cy="330" r="4" />
    <circle cx="250" cy="430" r="3.5" />
    <circle cx="550" cy="430" r="3.5" />
  </g>

  <!-- 4. Hooded Hacker Figure -->
  <g id="hacker-body" filter="url(#drop-shadow)">
    <!-- Shoulders & Cloak Silhouette -->
    <path d="M 185 640 
             C 215 540 270 450 330 420 
             L 360 440 
             C 310 470 260 550 230 645 
             Z" 
          fill="#1e293b" stroke="#334155" stroke-width="2" />
    <path d="M 615 640 
             C 585 540 530 450 470 420 
             L 440 440 
             C 490 470 540 550 570 645 
             Z" 
          fill="#1e293b" stroke="#334155" stroke-width="2" />

    <!-- Upper Body Base -->
    <path d="M 190 640 Q 280 470 365 440 L 435 440 Q 520 470 610 640 C 530 670 270 670 190 640 Z" 
          fill="#0c1322" stroke="#1e293b" stroke-width="4" />

    <!-- Hood Outline -->
    <path d="M 400 120 
             C 480 120 560 210 575 340
             C 585 430 550 480 520 535
             C 480 520 450 510 400 510
             C 350 510 320 520 280 535
             C 250 480 215 430 225 340
             C 240 210 320 120 400 120 Z"
          fill="url(#hood-gradient)"
          stroke="#475569"
          stroke-width="4" />

    <!-- Hood Cyan Rim Light Highlights -->
    <path d="M 400 120 C 480 120 560 210 575 340 C 585 430 550 480 520 535"
          fill="none" stroke="#38bdf8" stroke-width="4" opacity="0.85" />
    <path d="M 400 120 C 320 120 240 210 225 340 C 215 430 250 480 280 535"
          fill="none" stroke="#38bdf8" stroke-width="4" opacity="0.85" />

    <!-- Inner Hood Void -->
    <path d="M 400 160 
             C 460 160 520 230 530 340
             C 535 410 500 460 480 485
             C 440 470 360 470 320 485
             C 300 460 265 410 270 340
             C 280 230 340 160 400 160 Z"
          fill="#020617" />

    <!-- Glowing Red Slit Eyes -->
    <g filter="url(#red-eye-flare)">
      <!-- Left Eye -->
      <polygon points="335,285 385,302 380,314 325,296" fill="#ef4444" />
      <polygon points="340,288 380,302 376,310 332,297" fill="#fee2e2" />
      <!-- Right Eye -->
      <polygon points="465,285 415,302 420,314 475,296" fill="#ef4444" />
      <polygon points="460,288 420,302 424,310 468,297" fill="#fee2e2" />
    </g>

    <!-- Tactical Respirator Mask with Vertical Slats -->
    <g id="tactical-mask">
      <!-- Mask Shield Shell -->
      <path d="M 335 345 L 400 375 L 465 345 L 452 445 L 400 470 L 348 445 Z" 
            fill="#1e293b" stroke="#64748b" stroke-width="3" />
      
      <!-- Center Vertical Slats (matching exact logo) -->
      <g stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round">
        <line x1="375" y1="380" x2="375" y2="445" />
        <line x1="387" y1="375" x2="387" y2="455" />
        <line x1="400" y1="372" x2="400" y2="462" />
        <line x1="413" y1="375" x2="413" y2="455" />
        <line x1="425" y1="380" x2="425" y2="445" />
        <line x1="362" y1="390" x2="362" y2="435" />
        <line x1="438" y1="390" x2="438" y2="435" />
      </g>
    </g>

    <!-- 5. Golden Biohazard Shield -->
    <g id="biohazard-shield" filter="url(#drop-shadow)">
      <!-- Outer Shield Rim -->
      <path d="M 400 375 
               L 490 395 
               C 490 480 465 545 400 585 
               C 335 545 310 480 310 395 
               Z" 
            fill="#090d16" stroke="url(#shield-rim)" stroke-width="6" />

      <!-- Inner Amber Shield Face -->
      <path d="M 400 388 
               L 480 405 
               C 480 475 455 535 400 572 
               C 345 535 320 475 320 405 
               Z" 
            fill="url(#shield-amber)" stroke="#78350f" stroke-width="2" />

      <!-- Highlight Sheen -->
      <path d="M 400 392 L 472 408 C 472 450 458 500 400 535 Z" 
            fill="#ffffff" opacity="0.28" />

      <!-- Biohazard Symbol -->
      <g transform="translate(400, 480) scale(0.7)" id="biohazard-symbol">
        <circle cx="0" cy="0" r="19" fill="none" stroke="#000000" stroke-width="10" />
        <circle cx="0" cy="0" r="11" fill="#000000" />

        <!-- Node 1 (Top) -->
        <g>
          <path d="M -32 -36 A 50 50 0 0 1 32 -36 A 38 38 0 0 0 0 -90 A 38 38 0 0 0 -32 -36 Z" fill="#000000" />
          <circle cx="0" cy="-48" r="30" fill="none" stroke="#000000" stroke-width="13" />
        </g>
        <!-- Node 2 (Bottom Left) -->
        <g transform="rotate(120)">
          <path d="M -32 -36 A 50 50 0 0 1 32 -36 A 38 38 0 0 0 0 -90 A 38 38 0 0 0 -32 -36 Z" fill="#000000" />
          <circle cx="0" cy="-48" r="30" fill="none" stroke="#000000" stroke-width="13" />
        </g>
        <!-- Node 3 (Bottom Right) -->
        <g transform="rotate(240)">
          <path d="M -32 -36 A 50 50 0 0 1 32 -36 A 38 38 0 0 0 0 -90 A 38 38 0 0 0 -32 -36 Z" fill="#000000" />
          <circle cx="0" cy="-48" r="30" fill="none" stroke="#000000" stroke-width="13" />
        </g>
      </g>
    </g>

    <!-- 6. Tactical Gloved Hands Holding the Shield (Exact match with user image) -->
    <!-- Left Hand -->
    <g id="left-glove" stroke="#475569" stroke-width="2">
      <!-- Palm / Wrist Base -->
      <path d="M 285 450 C 265 470 260 520 280 560 L 315 540 C 300 500 300 470 315 450 Z" fill="#1e293b" />
      <!-- Fingers Gripping Shield Rim -->
      <rect x="295" y="465" width="28" height="15" rx="7" fill="#334155" stroke="#64748b" />
      <rect x="290" y="488" width="30" height="15" rx="7" fill="#334155" stroke="#64748b" />
      <rect x="292" y="510" width="28" height="15" rx="7" fill="#334155" stroke="#64748b" />
      <rect x="300" y="530" width="24" height="14" rx="7" fill="#334155" stroke="#64748b" />
    </g>

    <!-- Right Hand -->
    <g id="right-glove" stroke="#475569" stroke-width="2">
      <!-- Palm / Wrist Base -->
      <path d="M 515 450 C 535 470 540 520 520 560 L 485 540 C 500 500 500 470 485 450 Z" fill="#1e293b" />
      <!-- Fingers Gripping Shield Rim -->
      <rect x="477" y="465" width="28" height="15" rx="7" fill="#334155" stroke="#64748b" />
      <rect x="480" y="488" width="30" height="15" rx="7" fill="#334155" stroke="#64748b" />
      <rect x="480" y="510" width="28" height="15" rx="7" fill="#334155" stroke="#64748b" />
      <rect x="476" y="530" width="24" height="14" rx="7" fill="#334155" stroke="#64748b" />
    </g>
  </g>

  <!-- 7. Typography Across Center Bottom -->
  <g id="watermark-text" text-anchor="middle" filter="url(#drop-shadow)">
    <!-- Line 1: CYBER SENTINEL -->
    <text x="400" y="626" 
          font-family="'Orbitron', 'Rajdhani', -apple-system, sans-serif" 
          font-weight="900" 
          font-size="44" 
          letter-spacing="5"
          fill="${titleColor}"
          stroke="#050811"
          stroke-width="4"
          paint-order="stroke fill">
      ${title}
    </text>

    <!-- Line 2: BANGLADESH -->
    <text x="400" y="664" 
          font-family="'Orbitron', 'Rajdhani', -apple-system, sans-serif" 
          font-weight="800" 
          font-size="28" 
          letter-spacing="14"
          fill="${subtitleColor}"
          stroke="#050811"
          stroke-width="3"
          paint-order="stroke fill">
      ${subtitle}
    </text>
  </g>
</svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
