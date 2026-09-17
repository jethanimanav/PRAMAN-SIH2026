import React from "react";

/* ═══════════════════════════════════════════════════════════════
   LION CAPITAL OF ASHOKA EMBLEM (Clean Government Vector)
   ═══════════════════════════════════════════════════════════════ */
export function AshokaEmblem({ className = "w-10 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Three Lions Representation */}
      <g fill="#0B2A5B">
        {/* Center Lion */}
        <circle cx="50" cy="22" r="14" />
        <path d="M43 14h14v16H43z" />
        <path d="M46 36h8v18h-8z" />
        {/* Left Lion */}
        <circle cx="28" cy="28" r="11" />
        <path d="M22 22h12v14H22z" />
        <path d="M25 40h6v14h-6z" />
        {/* Right Lion */}
        <circle cx="72" cy="28" r="11" />
        <path d="M66 22h12v14H66z" />
        <path d="M69 40h6v14h-6z" />
        {/* Manes & details */}
        <path d="M34 32c0 8 7 14 16 14s16-6 16-14c-4-3-8-4-16-4s-12 1-16 4z" />
        <path d="M32 46h36v12H32z" />
        {/* Abacus platform */}
        <rect x="15" y="60" width="70" height="12" rx="2" fill="#0B2A5B" />
        {/* Ashoka Chakra in Center of Abacus */}
        <circle cx="50" cy="66" r="4.5" fill="none" stroke="#FFFFFF" strokeWidth="1" />
        <circle cx="50" cy="66" r="1" fill="#FFFFFF" />
        {/* Galloping Horse & Bull representations */}
        <circle cx="30" cy="66" r="2.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="70" cy="66" r="2.5" fill="#FFFFFF" opacity="0.9" />
        {/* Bell-shaped Lotus Base */}
        <path d="M22 74c0 10 12 16 28 16s28-6 28-16H22z" fill="#0B2A5B" />
        <rect x="18" y="92" width="64" height="4" rx="1" fill="#0B2A5B" />
        {/* Base Pedestal */}
        <rect x="12" y="98" width="76" height="5" rx="1.5" fill="#0B2A5B" />
      </g>
      {/* Satyameva Jayate text representation in Devanagari */}
      <text
        x="50"
        y="114"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="800"
        fill="#0B2A5B"
        letterSpacing="0.05em"
        fontFamily="serif"
      >
        सत्यमेव जयते
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAHARASHTRA GOVERNMENT SEAL (Golden Circular Seal)
   ═══════════════════════════════════════════════════════════════ */
export function MaharashtraSeal({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer Golden Glow & Rings */}
      <circle cx="80" cy="80" r="76" fill="#FFFDF5" stroke="#D99A00" strokeWidth="2.5" />
      <circle cx="80" cy="80" r="70" fill="none" stroke="#D99A00" strokeWidth="1" strokeDasharray="3 2" />
      <circle cx="80" cy="80" r="65" fill="#FEF9E7" stroke="#D99A00" strokeWidth="1.5" />

      {/* Decorative Border Dots */}
      {[...Array(24)].map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        const cx = 80 + 72.5 * Math.cos(rad);
        const cy = 80 + 72.5 * Math.sin(rad);
        return <circle key={i} cx={cx} cy={cy} r="1.2" fill="#D99A00" />;
      })}

      {/* Center Lamp (Diya / Samai) of Knowledge */}
      <g fill="#D99A00">
        {/* Flame */}
        <path d="M80 34c3 6 7 10 7 14 0 4-3 7-7 7s-7-3-7-7c0-4 4-8 7-14z" fill="#E65100" />
        <path d="M80 38c1.8 3.5 4 6 4 8.5 0 2.5-1.8 4.5-4 4.5s-4-2-4-4.5c0-2.5 2.2-5 4-8.5z" fill="#FFB300" />
        {/* Lamp bowl */}
        <path d="M64 58h32c0 8-7 14-16 14s-16-6-16-14z" />
        {/* Stem */}
        <rect x="77" y="72" width="6" height="24" rx="1" />
        <circle cx="80" cy="82" r="6" />
        {/* Base of Lamp */}
        <path d="M60 102c0-5 9-6 20-6s20 1 20 6H60z" />
        <rect x="56" y="102" width="48" height="4" rx="1" />
      </g>

      {/* Sanskrit Motto Ring text: प्रतिपच्चंद्रलेखेव वर्धिष्णुर्विश्ववंदिता शाहसूनोः शिवस्यैषा मुद्रा भद्राय राजते */}
      <path
        id="sealTextPath"
        d="M 28 80 A 52 52 0 1 1 132 80"
        fill="none"
      />
      <text fontSize="7.5" fontWeight="700" fill="#B45309" letterSpacing="0.06em">
        <textPath href="#sealTextPath" startOffset="50%" textAnchor="middle">
          प्रतिपच्चंद्रलेखेव वर्धिष्णुर्विश्ववंदिता
        </textPath>
      </text>

      {/* Lower Banner: महाराष्ट्र शासन */}
      <path
        id="sealLowerTextPath"
        d="M 32 85 A 50 50 0 0 0 128 85"
        fill="none"
      />
      <text fontSize="9.5" fontWeight="900" fill="#0B2A5B" letterSpacing="0.1em">
        <textPath href="#sealLowerTextPath" startOffset="50%" textAnchor="middle">
          महाराष्ट्र शासन
        </textPath>
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAHARASHTRA HERO MAP & LANDMARKS COMPOSITION
   (Gateway of India + Bandra-Worli Sea Link + Skyline Silhouette)
   ═══════════════════════════════════════════════════════════════ */
export function MaharashtraHeroMap({ className = "w-full max-w-[540px] h-auto" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 560 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-sm">
        <defs>
          {/* Map Silhouette Gradient */}
          <linearGradient id="mhMapGrad" x1="60" y1="20" x2="480" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#CDE4FA" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#E2F0FD" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#C6DFF6" stopOpacity="0.8" />
          </linearGradient>

          {/* Sea Link Water Gradient */}
          <linearGradient id="waterGrad" x1="120" y1="300" x2="440" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1455B8" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#1455B8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1455B8" stopOpacity="0.1" />
          </linearGradient>

          {/* Landmark Stone Color */}
          <linearGradient id="stoneGrad" x1="80" y1="120" x2="260" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5B6B82" />
            <stop offset="100%" stopColor="#313E50" />
          </linearGradient>
        </defs>

        {/* ── 1. Maharashtra Geographic Map Silhouette ── */}
        <path
          d="M 90 120 
             C 120 90, 160 70, 220 50 
             C 270 35, 330 30, 390 40 
             C 430 45, 470 70, 480 110 
             C 490 140, 480 180, 460 210 
             C 440 240, 450 270, 430 300 
             C 410 330, 360 360, 310 370 
             C 260 380, 200 350, 170 340 
             C 140 330, 120 300, 100 270 
             C 70 230, 60 170, 90 120 Z"
          fill="url(#mhMapGrad)"
          stroke="#93C5FD"
          strokeWidth="2"
        />

        {/* Contour lines inside map */}
        <path
          d="M 140 90 Q 280 100 420 80"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeOpacity="0.6"
          fill="none"
        />
        <path
          d="M 110 180 Q 270 190 440 160"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          fill="none"
        />
        <path
          d="M 130 270 Q 260 280 390 250"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          fill="none"
        />

        {/* ── 2. Mumbai Skyline in Map Background ── */}
        <g fill="#93C5FD" opacity="0.35">
          <rect x="250" y="100" width="12" height="70" rx="1" />
          <rect x="265" y="85" width="15" height="85" rx="1" />
          <rect x="284" y="110" width="10" height="60" rx="1" />
          <rect x="298" y="70" width="18" height="100" rx="1" />
          <rect x="320" y="95" width="14" height="75" rx="1" />
          <rect x="338" y="120" width="12" height="50" rx="1" />
          <rect x="354" y="105" width="16" height="65" rx="1" />
        </g>

        {/* ── 3. Bandra-Worli Sea Link (Cable-Stayed Bridge) ── */}
        <g id="seaLink">
          {/* Sea Water Surface */}
          <ellipse cx="360" cy="270" rx="130" ry="24" fill="url(#waterGrad)" />

          {/* Bridge Roadway Deck */}
          <path
            d="M 230 255 C 290 250, 370 240, 480 230"
            stroke="#1455B8"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M 230 255 C 290 250, 370 240, 480 230"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeDasharray="4 3"
          />

          {/* Main Tower 1 (Pylon) */}
          <path
            d="M 375 140 L 368 250 L 382 250 Z"
            fill="#3B82F6"
          />
          <circle cx="375" cy="140" r="3" fill="#1455B8" />

          {/* Main Tower 2 (Pylon) */}
          <path
            d="M 430 135 L 424 240 L 436 240 Z"
            fill="#3B82F6"
          />
          <circle cx="430" cy="135" r="3" fill="#1455B8" />

          {/* Cable Stays for Tower 1 */}
          <g stroke="#2563EB" strokeWidth="1" opacity="0.75">
            <line x1="375" y1="145" x2="310" y2="252" />
            <line x1="375" y1="155" x2="330" y2="251" />
            <line x1="375" y1="165" x2="350" y2="249" />
            <line x1="375" y1="145" x2="410" y2="245" />
            <line x1="375" y1="155" x2="395" y2="247" />
          </g>

          {/* Cable Stays for Tower 2 */}
          <g stroke="#2563EB" strokeWidth="1" opacity="0.75">
            <line x1="430" y1="140" x2="385" y2="247" />
            <line x1="430" y1="150" x2="405" y2="244" />
            <line x1="430" y1="140" x2="475" y2="232" />
            <line x1="430" y1="150" x2="455" y2="236" />
          </g>
        </g>

        {/* ── 4. Gateway of India (Iconic Mumbai Monument) ── */}
        <g id="gatewayOfIndia" transform="translate(100, 160)">
          {/* Monument Base Plinth */}
          <rect x="0" y="100" width="130" height="10" rx="1" fill="#1E293B" />
          <rect x="5" y="95" width="120" height="5" rx="1" fill="#334155" />

          {/* Left Wing & Turret */}
          <rect x="10" y="40" width="26" height="55" fill="#475569" />
          <path d="M 8 40 L 38 40 L 34 25 L 12 25 Z" fill="#334155" />
          {/* Left Turret Dome */}
          <path d="M 16 25 C 16 15, 30 15, 30 25 Z" fill="#D99A00" />
          <rect x="22" y="10" width="2" height="6" fill="#D99A00" />

          {/* Right Wing & Turret */}
          <rect x="94" y="40" width="26" height="55" fill="#475569" />
          <path d="M 92 40 L 122 40 L 118 25 L 96 25 Z" fill="#334155" />
          {/* Right Turret Dome */}
          <path d="M 100 25 C 100 15, 114 15, 114 25 Z" fill="#D99A00" />
          <rect x="106" y="10" width="2" height="6" fill="#D99A00" />

          {/* Center Grand Arch Structure */}
          <rect x="36" y="20" width="58" height="75" fill="#334155" />
          {/* Center Dome Roof */}
          <path d="M 34 20 L 96 20 L 92 8 L 38 8 Z" fill="#1E293B" />
          <path d="M 50 8 C 50 -6, 80 -6, 80 8 Z" fill="#D99A00" />
          <rect x="64" y="-12" width="2" height="7" fill="#D99A00" />

          {/* Grand Gateway Central Archway Cutout */}
          <path
            d="M 47 95 L 47 54 C 47 38, 83 38, 83 54 L 83 95 Z"
            fill="#EEF5FC"
          />
          {/* Inner shadow/depth */}
          <path
            d="M 52 95 L 52 56 C 52 44, 78 44, 78 56 L 78 95 Z"
            fill="#061B3A"
          />

          {/* Small Decorative Arch Windows */}
          <path d="M 18 65 C 18 58, 28 58, 28 65 L 28 78 L 18 78 Z" fill="#0B2A5B" opacity="0.6" />
          <path d="M 102 65 C 102 58, 112 58, 112 65 L 112 78 L 102 78 Z" fill="#0B2A5B" opacity="0.6" />
        </g>

        {/* ── 5. Geometric Tech / Connectivity Nodes ── */}
        <g stroke="#1455B8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6">
          <line x1="165" y1="210" x2="280" y2="150" />
          <line x1="280" y1="150" x2="375" y2="140" />
          <line x1="375" y1="140" x2="430" y2="135" />
          <line x1="280" y1="150" x2="330" y2="280" />
        </g>
        <circle cx="165" cy="210" r="3.5" fill="#1455B8" />
        <circle cx="280" cy="150" r="3" fill="#D99A00" />
        <circle cx="330" cy="280" r="3.5" fill="#16834B" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SKYLINE BACKDROP (Subtle Architectural Outline)
   ═══════════════════════════════════════════════════════════════ */
export function SkylineBackdrop({ className = "w-full h-16 opacity-15" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0 80 
           L0 60 L30 60 L30 45 L45 45 L45 30 L55 30 L55 45 L70 45 L70 60 L110 60 
           L110 50 L125 50 L125 25 L135 20 L145 25 L145 50 L160 50 L160 60 L210 60 
           L210 40 L230 40 L230 20 L240 15 L250 20 L250 40 L270 40 L270 60 L340 60
           L340 50 L355 50 L355 35 L370 35 L370 50 L410 50 L410 60 L480 60
           L480 45 L500 45 L500 15 L515 8 L530 15 L530 45 L560 45 L560 60 L620 60
           L620 52 L640 52 L640 38 L655 38 L655 52 L700 52 L700 60 L780 60
           L780 40 L800 40 L800 20 L810 12 L820 20 L820 40 L840 40 L840 60 L920 60
           L920 48 L940 48 L940 30 L955 30 L955 48 L1000 48 L1000 60 L1080 60
           L1080 35 L1100 35 L1100 20 L1110 15 L1120 20 L1120 35 L1140 35 L1140 60 L1200 60 L1200 80 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MANTRALAYA MUMBAI MAP CARD (Footer Graphic)
   ═══════════════════════════════════════════════════════════════ */
export function MantralayaMapCard() {
  return (
    <div className="relative rounded-lg overflow-hidden border border-[#DCE3EC] bg-[#F1F5F9] shadow-sm group">
      {/* Stylized Street Grid */}
      <svg viewBox="0 0 300 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        {/* Background Land */}
        <rect width="300" height="130" fill="#E8EEF5" />
        {/* Arabian Sea / Coastal Bay */}
        <path d="M 0 0 L 70 0 C 60 40, 50 80, 0 130 Z" fill="#D0E2F7" />
        {/* Urban Park */}
        <rect x="180" y="20" width="80" height="35" rx="3" fill="#D4EDDA" opacity="0.8" />
        {/* Major Roads / Boulevards */}
        <path d="M 70 0 C 60 40, 50 80, 0 130" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M 70 0 C 60 40, 50 80, 0 130" stroke="#FDE68A" strokeWidth="3" />
        <line x1="55" y1="40" x2="300" y2="40" stroke="#FFFFFF" strokeWidth="6" />
        <line x1="45" y1="85" x2="300" y2="85" stroke="#FFFFFF" strokeWidth="7" />
        <line x1="120" y1="0" x2="120" y2="130" stroke="#FFFFFF" strokeWidth="5" />
        <line x1="200" y1="0" x2="200" y2="130" stroke="#FFFFFF" strokeWidth="5" />
        <line x1="260" y1="0" x2="260" y2="130" stroke="#FFFFFF" strokeWidth="4" />
        {/* Marine Drive Coastal Road Label */}
        <text x="35" y="70" transform="rotate(65 35 70)" fontSize="6" fontWeight="bold" fill="#64748B" letterSpacing="0.05em">
          MADAME CAMA ROAD
        </text>
      </svg>

      {/* Floating Location Badge with Red Pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded shadow-md border border-[#DCE3EC] flex items-center gap-2">
        <div className="w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center text-white ring-2 ring-red-200">
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
        <div className="leading-tight text-left">
          <p className="text-[11px] font-bold text-[#172033]">Mantralaya</p>
          <p className="text-[9px] text-[#5D6878]">Mumbai</p>
        </div>
      </div>

      {/* Expand Icon */}
      <div className="absolute top-2 right-2 p-1 rounded bg-white/90 text-[#5D6878] border border-[#DCE3EC] shadow-sm group-hover:text-[#0B2A5B] transition-colors">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </div>
    </div>
  );
}
