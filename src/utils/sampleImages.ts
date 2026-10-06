/**
 * Generates realistic SVG sample mock screenshots for Image 1 (Profile) and Image 2 (Block confirmation).
 * These match the reference photo so the app loads with an authentic state out-of-the-box.
 */

export function generateSampleLeftProfileSvg(profileName: string = 'Piklu Das Pajush'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 1000" width="600" height="1000">
  <defs>
    <linearGradient id="cover-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3d2b27" />
      <stop offset="40%" stop-color="#b45309" />
      <stop offset="100%" stop-color="#78350f" />
    </linearGradient>
    <clipPath id="avatar-clip">
      <circle cx="200" cy="310" r="85" />
    </clipPath>
  </defs>

  <!-- Background White Mobile App Canvas -->
  <rect width="600" height="1000" fill="#ffffff" />

  <!-- Cover Photo -->
  <rect x="0" y="0" width="600" height="320" fill="url(#cover-grad)" />
  <!-- Abstract Cover photo graphic (couple photo silhouette) -->
  <circle cx="280" cy="110" r="55" fill="#fbcfe8" opacity="0.9" />
  <circle cx="360" cy="115" r="50" fill="#fde68a" opacity="0.9" />
  <path d="M 210 240 C 240 170 320 160 350 240 Z" fill="#1e293b" />
  <path d="M 310 240 C 330 175 400 170 430 240 Z" fill="#334155" />
  <rect x="0" y="240" width="600" height="80" fill="#f8fafc" opacity="0.6" />

  <!-- Profile Avatar -->
  <circle cx="200" cy="310" r="90" fill="#ffffff" stroke="#e2e8f0" stroke-width="6" />
  <circle cx="200" cy="310" r="84" fill="#3b82f6" />
  <!-- Avatar illustration (girl profile) -->
  <g clip-path="url(#avatar-clip)">
    <rect x="110" y="220" width="180" height="180" fill="#fed7aa" />
    <path d="M 120 330 C 130 250 270 250 280 330 L 290 400 L 110 400 Z" fill="#18181b" />
    <circle cx="200" cy="300" r="45" fill="#ffedd5" />
    <!-- Hair -->
    <path d="M 150 300 C 145 220 255 220 250 300 C 235 240 165 240 150 300 Z" fill="#09090b" />
  </g>

  <!-- Profile Name & Stats -->
  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
    <text x="35" y="445" font-size="34" font-weight="bold" fill="#0f172a">${profileName}</text>
    <text x="35" y="482" font-size="20" fill="#475569" font-weight="500">2.3K friends  •  1 mutual  •  18 posts</text>

    <!-- Details -->
    <g fill="#334155" font-size="19" font-weight="500">
      <circle cx="48" cy="528" r="7" fill="#64748b" />
      <text x="70" y="534">Dhaka</text>
      
      <circle cx="160" cy="528" r="7" fill="#64748b" />
      <text x="180" y="534">Barisal Govt. Girls High School</text>
    </g>

    <!-- Mutual Friends Thumbnails -->
    <circle cx="50" cy="580" r="16" fill="#38bdf8" stroke="#fff" stroke-width="2" />
    <circle cx="70" cy="580" r="16" fill="#ec4899" stroke="#fff" stroke-width="2" />
    <text x="100" y="586" font-size="18" fill="#475569">Friends with Sadiya Jabin</text>

    <!-- Action Buttons -->
    <!-- Confirm Request (Blue) -->
    <rect x="35" y="625" width="230" height="52" rx="10" fill="#1877f2" />
    <text x="80" y="658" font-size="20" font-weight="bold" fill="#ffffff">Confirm request</text>

    <!-- Delete Request (Gray) -->
    <rect x="280" y="625" width="160" height="52" rx="10" fill="#e4e6eb" />
    <text x="330" y="658" font-size="20" font-weight="bold" fill="#050505">Delete</text>

    <!-- Message Icon Button -->
    <rect x="455" y="625" width="60" height="52" rx="10" fill="#e4e6eb" />
    <circle cx="485" cy="651" r="12" fill="#050505" opacity="0.6" />

    <!-- Tabs: All, Photos, Reels -->
    <line x1="0" y1="710" x2="600" y2="710" stroke="#e2e8f0" stroke-width="2" />
    <text x="80" y="745" font-size="22" font-weight="bold" fill="#1877f2">All</text>
    <line x1="50" y1="765" x2="130" y2="765" stroke="#1877f2" stroke-width="4" />
    
    <text x="240" y="745" font-size="22" font-weight="600" fill="#64748b">Photos</text>
    <text x="440" y="745" font-size="22" font-weight="600" fill="#64748b">Reels</text>

    <!-- Personal Details Section -->
    <text x="35" y="820" font-size="24" font-weight="bold" fill="#0f172a">Personal details</text>
    <circle cx="50" cy="875" r="12" fill="none" stroke="#64748b" stroke-width="3" />
    <text x="80" y="882" font-size="21" font-weight="600" fill="#0f172a">Dhaka, Bangladesh</text>
  </g>
</svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

export function generateSampleRightTakedownSvg(profileName: string = 'Piklu Das Pajush'): string {
  const baseProfileSvg = generateSampleLeftProfileSvg(profileName);
  // Decode the base svg and overlay the Facebook "This content isn't available right now" modal
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 1000" width="600" height="1000">
  <defs>
    <linearGradient id="cover-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3d2b27" />
      <stop offset="40%" stop-color="#b45309" />
      <stop offset="100%" stop-color="#78350f" />
    </linearGradient>
    <filter id="modal-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Base Profile -->
  <rect width="600" height="1000" fill="#ffffff" />
  <rect x="0" y="0" width="600" height="320" fill="url(#cover-grad-2)" />
  <circle cx="280" cy="110" r="55" fill="#fbcfe8" opacity="0.9" />
  <circle cx="360" cy="115" r="50" fill="#fde68a" opacity="0.9" />
  <path d="M 210 240 C 240 170 320 160 350 240 Z" fill="#1e293b" />
  <path d="M 310 240 C 330 175 400 170 430 240 Z" fill="#334155" />
  <circle cx="200" cy="310" r="90" fill="#ffffff" stroke="#e2e8f0" stroke-width="6" />

  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" opacity="0.6">
    <text x="35" y="445" font-size="34" font-weight="bold" fill="#0f172a">${profileName}</text>
    <text x="35" y="482" font-size="20" fill="#475569" font-weight="500">2.3K friends  •  1 mutual  •  18 posts</text>
    <text x="70" y="534" font-size="19" fill="#334155">Dhaka  •  Barisal Govt. Girls High School</text>
    <rect x="35" y="625" width="230" height="52" rx="10" fill="#1877f2" />
    <text x="80" y="658" font-size="20" font-weight="bold" fill="#ffffff">Confirm request</text>
    <rect x="280" y="625" width="160" height="52" rx="10" fill="#e4e6eb" />
    <text x="330" y="658" font-size="20" font-weight="bold" fill="#050505">Delete</text>
    <text x="35" y="820" font-size="24" font-weight="bold" fill="#0f172a">Personal details</text>
    <text x="80" y="882" font-size="21" font-weight="600" fill="#0f172a">Dhaka, Bangladesh</text>
  </g>

  <!-- Dark translucent overlay to simulate blocked screen / modal focus -->
  <rect width="600" height="1000" fill="#0f172a" opacity="0.32" />

  <!-- Facebook "This content isn't available right now" Pop-up Modal -->
  <g filter="url(#modal-shadow)">
    <!-- Modal Card Shell -->
    <rect x="70" y="360" width="460" height="175" rx="18" fill="#ffffff" />
    
    <!-- Modal Message -->
    <text x="300" y="415" 
          font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="22" 
          font-weight="bold" 
          text-anchor="middle" 
          fill="#1c1e21">
      This content isn't available right
    </text>
    <text x="300" y="445" 
          font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="22" 
          font-weight="bold" 
          text-anchor="middle" 
          fill="#1c1e21">
      now
    </text>

    <!-- OK Blue Action Button -->
    <rect x="110" y="470" width="380" height="46" rx="23" fill="#1877f2" />
    <text x="300" y="500" 
          font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="19" 
          font-weight="bold" 
          text-anchor="middle" 
          fill="#ffffff">
      OK
    </text>
  </g>
</svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
