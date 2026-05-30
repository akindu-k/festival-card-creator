import type { CardData } from '../types'

interface TemplateProps {
  data: CardData
  isPreview?: boolean
}

/* ─────────────────────────────────────────────────────────── helpers ── */

const CardText = ({
  data,
  style,
}: {
  data: CardData
  style?: React.CSSProperties
}) => {
  const base: React.CSSProperties = {
    fontFamily: `'${data.fontFamily}', serif`,
    fontSize:   data.fontSize,
    color:      data.fontColor,
    textAlign:  data.textAlign,
    lineHeight: 1.7,
    ...style,
  }
  const greeting = data.customGreeting || (data.receiverName ? `Dear ${data.receiverName},` : '')

  return (
    <div style={base}>
      {greeting && (
        <p style={{ fontSize: data.fontSize * 0.9, marginBottom: 10, opacity: 0.9 }}>
          {greeting}
        </p>
      )}
      <p style={{ whiteSpace: 'pre-wrap', marginBottom: 16 }}>{data.message}</p>
      {data.senderName && (
        <div style={{ fontSize: data.fontSize * 0.85, opacity: 0.85, marginTop: 8 }}>
          <p>~ {data.senderName}</p>
          {data.senderOrg && <p style={{ opacity: 0.7, fontSize: data.fontSize * 0.75 }}>{data.senderOrg}</p>}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   1.  LANTERN TEMPLATE  — deep night sky with glowing Vesak lanterns
   ══════════════════════════════════════════════════════════════════════ */
const LanternCard = ({ data }: TemplateProps) => (
  <div
    style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse at top, #1a0a4e 0%, #0d0a2e 60%, #050215 100%)',
      display: 'flex', flexDirection: 'column',
    }}
  >
    {/* Stars */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice">
      {[...Array(60)].map((_, i) => {
        const x = (i * 97 + 13) % 600
        const y = (i * 137 + 41) % 500
        const r = i % 4 === 0 ? 1.8 : i % 3 === 0 ? 1.2 : 0.7
        return <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={0.3 + (i % 7) * 0.1} />
      })}
    </svg>

    {/* Glow halos */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="lg1" cx="50%" cy="50%"><stop offset="0%" stopColor="#FF9933" stopOpacity="0.4"/><stop offset="100%" stopColor="#FF9933" stopOpacity="0"/></radialGradient>
        <radialGradient id="lg2" cx="50%" cy="50%"><stop offset="0%" stopColor="#FFD700" stopOpacity="0.3"/><stop offset="100%" stopColor="#FFD700" stopOpacity="0"/></radialGradient>
        <radialGradient id="lg3" cx="50%" cy="50%"><stop offset="0%" stopColor="#FF6B00" stopOpacity="0.4"/><stop offset="100%" stopColor="#FF6B00" stopOpacity="0"/></radialGradient>
      </defs>
      <ellipse cx="150" cy="120" rx="70" ry="70" fill="url(#lg1)" />
      <ellipse cx="300" cy="80"  rx="70" ry="70" fill="url(#lg2)" />
      <ellipse cx="450" cy="140" rx="70" ry="70" fill="url(#lg3)" />
    </svg>

    {/* Lantern strings */}
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '40%' }} viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
      <path d="M20 30 Q150 60 150 110" stroke="#D4AF37" strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M580 20 Q450 50 450 130" stroke="#D4AF37" strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M0 50 Q300 10 600 50" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.4" />

      {/* Left Lantern */}
      <g transform="translate(120,70)">
        <polygon points="0,-30 20,-25 25,0 20,25 0,30 -20,25 -25,0 -20,-25" fill="#D4AF37" opacity="0.9"/>
        <polygon points="0,-22 14,-18 18,0 14,18 0,22 -14,18 -18,0 -14,-18" fill="#FF9933" opacity="0.8"/>
        <line x1="0" y1="-30" x2="0" y2="-40" stroke="#D4AF37" strokeWidth="2"/>
        <ellipse cx="0" cy="0" rx="10" ry="10" fill="#FFD700" opacity="0.6"/>
        <line x1="0" y1="30" x2="-8" y2="50" stroke="#D4AF37" strokeWidth="1.5"/>
        <line x1="0" y1="30" x2="8"  y2="50" stroke="#D4AF37" strokeWidth="1.5"/>
      </g>

      {/* Center Lantern */}
      <g transform="translate(300,45)">
        <polygon points="0,-35 24,-28 30,0 24,28 0,35 -24,28 -30,0 -24,-28" fill="#D4AF37" opacity="0.95"/>
        <polygon points="0,-26 17,-21 22,0 17,21 0,26 -17,21 -22,0 -17,-21" fill="#FF6B00" opacity="0.85"/>
        <line x1="0" y1="-35" x2="0" y2="-50" stroke="#D4AF37" strokeWidth="2.5"/>
        <ellipse cx="0" cy="0" rx="13" ry="13" fill="#FFD700" opacity="0.7"/>
        <line x1="0" y1="35" x2="-10" y2="60" stroke="#D4AF37" strokeWidth="2"/>
        <line x1="0" y1="35" x2="10"  y2="60" stroke="#D4AF37" strokeWidth="2"/>
        <text x="0" y="6" textAnchor="middle" fontSize="14" fill="#8B3A00" opacity="0.9">卍</text>
      </g>

      {/* Right Lantern */}
      <g transform="translate(480,100)">
        <polygon points="0,-28 18,-23 23,0 18,23 0,28 -18,23 -23,0 -18,-23" fill="#D4AF37" opacity="0.9"/>
        <polygon points="0,-20 13,-16 16,0 13,16 0,20 -13,16 -16,0 -13,-16" fill="#FFD700" opacity="0.8"/>
        <line x1="0" y1="-28" x2="0" y2="-42" stroke="#D4AF37" strokeWidth="2"/>
        <ellipse cx="0" cy="0" rx="9" ry="9" fill="#FF9933" opacity="0.6"/>
        <line x1="0" y1="28" x2="-7" y2="45" stroke="#D4AF37" strokeWidth="1.5"/>
        <line x1="0" y1="28" x2="7"  y2="45" stroke="#D4AF37" strokeWidth="1.5"/>
      </g>
    </svg>

    {/* Lotus bottom */}
    <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '25%' }} viewBox="0 0 600 200" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1b5e" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#050215" stopOpacity="1"/>
        </linearGradient>
        <radialGradient id="lotusGlow"><stop offset="0%" stopColor="#E8A0BF" stopOpacity="0.6"/><stop offset="100%" stopColor="#E8A0BF" stopOpacity="0"/></radialGradient>
      </defs>
      <rect x="0" y="60" width="600" height="140" fill="url(#waterGrad)"/>
      {/* Water ripples */}
      <ellipse cx="300" cy="120" rx="180" ry="20" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.2"/>
      <ellipse cx="300" cy="120" rx="240" ry="28" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.15"/>
      {/* Lotus petals */}
      {[0,45,90,135,180,225,270,315].map((angle, i) => (
        <ellipse
          key={i}
          cx={300 + Math.cos((angle * Math.PI) / 180) * 30}
          cy={75 + Math.sin((angle * Math.PI) / 180) * 30}
          rx="18" ry="9"
          transform={`rotate(${angle},${300 + Math.cos((angle * Math.PI) / 180) * 30},${75 + Math.sin((angle * Math.PI) / 180) * 30})`}
          fill="#E8A0BF" opacity="0.7"
        />
      ))}
      <ellipse cx="300" cy="75" rx="35" ry="35" fill="url(#lotusGlow)" />
      <circle cx="300" cy="75" r="10" fill="#FFD700" opacity="0.8"/>
      {/* Side lotus buds */}
      <circle cx="100" cy="90" r="18" fill="#C9A0DC" opacity="0.4"/>
      <circle cx="500" cy="85" r="15" fill="#E8A0BF" opacity="0.35"/>
    </svg>

    {/* Gold border frame */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 600 800" preserveAspectRatio="xMidYMid meet" overflow="visible">
      <rect x="12" y="12" width="576" height="776" rx="6" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.8"/>
      <rect x="20" y="20" width="560" height="760" rx="4" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4"/>
      {/* Corner ornaments */}
      {[[22,22],[578,22],[22,778],[578,778]].map(([cx,cy],i) => (
        <g key={i} transform={`translate(${cx},${cy}) rotate(${i*90})`}>
          <path d="M0,0 L20,0 M0,0 L0,20" stroke="#D4AF37" strokeWidth="2" opacity="0.9"/>
          <circle cx="0" cy="0" r="3" fill="#D4AF37" opacity="0.9"/>
        </g>
      ))}
    </svg>

    {/* Title */}
    <div style={{ position: 'absolute', top: 32, left: 0, right: 0, textAlign: 'center', zIndex: 10 }}>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: 5, color: '#D4AF37', opacity: 0.9, textTransform: 'uppercase', marginBottom: 2 }}>✦ Wishing You A ✦</p>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#D4AF37', textShadow: '0 0 20px rgba(212,175,55,0.6)', margin: 0 }}>Happy Vesak</h1>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: 4, color: '#FF9933', opacity: 0.8, textTransform: 'uppercase', marginTop: 2 }}>Poya Day</p>
    </div>

    {/* Text content */}
    <div style={{
      position: 'absolute', left: 50, right: 50, top: '38%', bottom: '28%',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
    }}>
      <CardText data={data} style={{ padding: '20px 10px' }} />
    </div>
  </div>
)

/* ══════════════════════════════════════════════════════════════════════
   2.  LOTUS TEMPLATE  — serene lotus garden with soft pastels
   ══════════════════════════════════════════════════════════════════════ */
const LotusCard = ({ data }: TemplateProps) => (
  <div style={{
    width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(160deg, #FFF0F7 0%, #F9F0FF 45%, #EEF4FF 100%)',
    display: 'flex', flexDirection: 'column',
  }}>
    {/* Large background lotus watermark */}
    <svg style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: '90%', opacity: 0.12 }} viewBox="0 0 200 200">
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => (
        <ellipse key={i}
          cx={100 + Math.cos((angle * Math.PI) / 180) * 55}
          cy={100 + Math.sin((angle * Math.PI) / 180) * 55}
          rx="35" ry="18"
          transform={`rotate(${angle},${100 + Math.cos((angle * Math.PI) / 180) * 55},${100 + Math.sin((angle * Math.PI) / 180) * 55})`}
          fill="#C9A0DC"
        />
      ))}
      <circle cx="100" cy="100" r="22" fill="#E8A0BF"/>
    </svg>

    {/* Top decorative arch */}
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%' }} viewBox="0 0 600 160" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="archGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A0DC" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#C9A0DC" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d="M0,0 Q300,160 600,0" fill="url(#archGrad)"/>
      {/* Tiny lotus buds along arch */}
      {[0.1,0.25,0.5,0.75,0.9].map((t,i) => {
        const x = 600*t, y = 160*4*t*(1-t) // parabola approx
        return <ellipse key={i} cx={x} cy={y} rx="8" ry="5" fill="#E8A0BF" opacity="0.6" transform={`rotate(${-30+i*15},${x},${y})`}/>
      })}
    </svg>

    {/* Decorative lotus cluster top */}
    <svg style={{ position: 'absolute', top: 20, left: 0, right: 0, width: '100%', height: '30%' }} viewBox="0 0 600 240" preserveAspectRatio="xMidYMin meet">
      {/* Main lotus */}
      {[0,40,80,120,160,200,240,280,320].map((angle, i) => (
        <ellipse key={i}
          cx={300 + Math.cos((angle * Math.PI) / 180) * 45}
          cy={100 + Math.sin((angle * Math.PI) / 180) * 45}
          rx="30" ry="14"
          transform={`rotate(${angle},${300 + Math.cos((angle * Math.PI) / 180) * 45},${100 + Math.sin((angle * Math.PI) / 180) * 45})`}
          fill="#E8A0BF" opacity="0.7"
        />
      ))}
      <circle cx="300" cy="100" r="16" fill="#C9A0DC" opacity="0.8"/>
      <circle cx="300" cy="100" r="9"  fill="#FFD700" opacity="0.7"/>
      {/* Side buds */}
      {[100,500].map((x,i) => (
        <g key={i} transform={`translate(${x},80)`}>
          {[0,60,120,180,240,300].map((a,j) => (
            <ellipse key={j} cx={Math.cos((a*Math.PI)/180)*22} cy={Math.sin((a*Math.PI)/180)*22}
              rx="14" ry="7" transform={`rotate(${a},${Math.cos((a*Math.PI)/180)*22},${Math.sin((a*Math.PI)/180)*22})`}
              fill="#C9A0DC" opacity="0.6"/>
          ))}
          <circle cx="0" cy="0" r="8" fill="#E8A0BF" opacity="0.7"/>
        </g>
      ))}
    </svg>

    {/* Water at bottom */}
    <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '22%' }} viewBox="0 0 600 180" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="waterLotus" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8D4F0" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#A0C4E8" stopOpacity="0.8"/>
        </linearGradient>
      </defs>
      <path d="M0,40 Q150,20 300,40 Q450,60 600,40 L600,180 L0,180 Z" fill="url(#waterLotus)" opacity="0.5"/>
      <path d="M0,70 Q150,50 300,70 Q450,90 600,70 L600,180 L0,180 Z" fill="url(#waterLotus)" opacity="0.4"/>
      {/* Reflection ripples */}
      {[80,200,360,480].map((x,i) => (
        <ellipse key={i} cx={x} cy={90+i*5} rx={40+i*10} ry={6} fill="none" stroke="#C9A0DC" strokeWidth="1" opacity="0.3"/>
      ))}
      {/* Bottom lotus */}
      {[0,60,120,180,240,300].map((a,i) => (
        <ellipse key={i}
          cx={300 + Math.cos((a*Math.PI)/180)*28}
          cy={60 + Math.sin((a*Math.PI)/180)*28}
          rx="18" ry="9"
          transform={`rotate(${a},${300+Math.cos((a*Math.PI)/180)*28},${60+Math.sin((a*Math.PI)/180)*28})`}
          fill="#E8A0BF" opacity="0.6"
        />
      ))}
      <circle cx="300" cy="60" r="10" fill="#FFD700" opacity="0.6"/>
    </svg>

    {/* Pink floral border */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 600 800">
      <rect x="14" y="14" width="572" height="772" rx="8" fill="none" stroke="#C9A0DC" strokeWidth="2" opacity="0.6"/>
      <rect x="22" y="22" width="556" height="756" rx="5" fill="none" stroke="#E8A0BF" strokeWidth="1" opacity="0.4" strokeDasharray="6,4"/>
    </svg>

    {/* Title */}
    <div style={{ position: 'absolute', top: 24, left: 0, right: 0, textAlign: 'center', zIndex: 10 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 700, color: '#7B3F8C', margin: 0, textShadow: '0 2px 8px rgba(201,160,220,0.4)' }}>Happy Vesak</h1>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: 5, color: '#C9A0DC', textTransform: 'uppercase', marginTop: 4 }}>🪷 Poya Day 🪷</p>
    </div>

    {/* Text */}
    <div style={{
      position: 'absolute', left: 48, right: 48, top: '37%', bottom: '24%',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
    }}>
      <CardText data={data} />
    </div>
  </div>
)

/* ══════════════════════════════════════════════════════════════════════
   3.  TEMPLE TEMPLATE  — saffron sunrise with temple silhouette
   ══════════════════════════════════════════════════════════════════════ */
const TempleCard = ({ data }: TemplateProps) => (
  <div style={{
    width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(180deg, #CC4400 0%, #FF6B00 20%, #FF9933 45%, #FFD700 70%, #FFF8E7 100%)',
  }}>
    {/* Sun radial rays */}
    <svg style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '80%' }} viewBox="0 0 300 300">
      {[...Array(18)].map((_, i) => {
        const angle = (i * 20 * Math.PI) / 180
        return (
          <line key={i}
            x1="150" y1="150"
            x2={150 + Math.cos(angle) * 150}
            y2={150 + Math.sin(angle) * 150}
            stroke="#FFD700" strokeWidth="1.5" opacity="0.25"
          />
        )
      })}
      <circle cx="150" cy="150" r="40" fill="#FFD700" opacity="0.9"/>
      <circle cx="150" cy="150" r="28" fill="white" opacity="0.7"/>
    </svg>

    {/* Dharmachakra (8-spoked wheel) */}
    <svg style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)', width: '22%' }} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="none" stroke="#8B3A00" strokeWidth="3" opacity="0.8"/>
      <circle cx="50" cy="50" r="10" fill="#8B3A00" opacity="0.8"/>
      {[0,45,90,135,180,225,270,315].map((a,i) => (
        <line key={i} x1="50" y1="50"
          x2={50+Math.cos((a*Math.PI)/180)*46}
          y2={50+Math.sin((a*Math.PI)/180)*46}
          stroke="#8B3A00" strokeWidth="2.5" opacity="0.8"/>
      ))}
      <circle cx="50" cy="50" r="46" fill="none" stroke="#CC5500" strokeWidth="1.5" opacity="0.5" strokeDasharray="3,5"/>
    </svg>

    {/* Cloud shapes */}
    <svg style={{ position: 'absolute', top: '18%', left: 0, width: '100%' }} viewBox="0 0 600 80">
      <ellipse cx="80" cy="40" rx="60" ry="25" fill="white" opacity="0.2"/>
      <ellipse cx="520" cy="30" rx="70" ry="22" fill="white" opacity="0.15"/>
      <ellipse cx="200" cy="55" rx="45" ry="18" fill="white" opacity="0.12"/>
    </svg>

    {/* Temple silhouette */}
    <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '35%' }} viewBox="0 0 600 280" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="templeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5C2D00"/>
          <stop offset="100%" stopColor="#2A1200"/>
        </linearGradient>
      </defs>
      {/* Main temple body */}
      <polygon points="300,20 340,60 340,220 260,220 260,60" fill="url(#templeGrad)"/>
      {/* Tiered roofs */}
      <polygon points="300,0 360,40 240,40" fill="#8B3A00"/>
      <polygon points="300,25 370,65 230,65" fill="#5C2D00"/>
      <polygon points="300,50 390,95 210,95" fill="#8B3A00"/>
      {/* Windows */}
      <rect x="280" y="120" width="40" height="55" rx="4" fill="#FFD700" opacity="0.5"/>
      <rect x="280" y="120" width="40" height="55" rx="4" fill="none" stroke="#CC5500" strokeWidth="1.5"/>
      {/* Steps */}
      <rect x="240" y="220" width="120" height="10" fill="#8B3A00"/>
      <rect x="220" y="230" width="160" height="10" fill="#5C2D00"/>
      <rect x="200" y="240" width="200" height="10" fill="#3A1A00"/>
      {/* Ground */}
      <rect x="0" y="250" width="600" height="30" fill="#2A1200"/>
      {/* Side pillars */}
      <rect x="180" y="150" width="20" height="100" fill="#5C2D00"/>
      <rect x="400" y="150" width="20" height="100" fill="#5C2D00"/>
      {/* Flags */}
      <line x1="300" y1="0" x2="300" y2="-20" stroke="#8B3A00" strokeWidth="2"/>
      <polygon points="300,-20 320,-10 300,-2" fill="#FF9933"/>
      {/* Torch lights */}
      <ellipse cx="195" cy="145" rx="12" ry="12" fill="#FFD700" opacity="0.7"/>
      <ellipse cx="415" cy="145" rx="12" ry="12" fill="#FFD700" opacity="0.7"/>
    </svg>

    {/* Ornate border */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 600 800">
      <rect x="10" y="10" width="580" height="780" rx="6" fill="none" stroke="#8B3A00" strokeWidth="3" opacity="0.7"/>
      <rect x="16" y="16" width="568" height="768" rx="4" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.5"/>
    </svg>

    {/* Title */}
    <div style={{ position: 'absolute', top: 28, left: 0, right: 0, textAlign: 'center', zIndex: 10 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#FFFFFF', margin: 0, textShadow: '0 2px 12px rgba(139,58,0,0.6)' }}>Happy Vesak</h1>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: 5, color: '#FFF8E7', textTransform: 'uppercase', marginTop: 4, opacity: 0.9 }}>Poya Day</p>
    </div>

    {/* Text */}
    <div style={{
      position: 'absolute', left: 48, right: 48, top: '36%', bottom: '37%',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
    }}>
      <CardText data={data} />
    </div>
  </div>
)

/* ══════════════════════════════════════════════════════════════════════
   4.  PANDAL TEMPLATE  — festive night pandal with colorful lights
   ══════════════════════════════════════════════════════════════════════ */
const PandalCard = ({ data }: TemplateProps) => {
  const bulbColors = ['#FF6B9D','#FFD700','#7B68EE','#00CED1','#FF9933','#98FB98','#FF6347']
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse at center, #1a0a4e 0%, #07021a 100%)',
    }}>
      {/* Stars */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 600 800">
        {[...Array(70)].map((_, i) => (
          <circle key={i}
            cx={(i * 83 + 17) % 600}
            cy={(i * 113 + 31) % 700}
            r={i % 5 === 0 ? 1.5 : 0.8}
            fill="white" opacity={0.2 + (i % 6) * 0.1}
          />
        ))}
      </svg>

      {/* Pandal structure */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '85%' }} viewBox="0 0 600 680" preserveAspectRatio="xMidYMax meet">
        {/* Strings of lights */}
        {[80,160,240,320,400].map((y,row) => (
          <g key={row}>
            <path d={`M20,${y} Q300,${y+30} 580,${y}`} stroke="rgba(255,255,200,0.2)" strokeWidth="1" fill="none"/>
            {[...Array(14)].map((_, i) => {
              const t = (i+1)/15
              const bx = 20 + t * 560
              const by = y + 30 * 4 * t * (1-t)
              const col = bulbColors[(i + row * 3) % bulbColors.length]
              return (
                <g key={i}>
                  <circle cx={bx} cy={by} r="5" fill={col} opacity="0.9"/>
                  <circle cx={bx} cy={by} r="10" fill={col} opacity="0.2"/>
                </g>
              )
            })}
          </g>
        ))}

        {/* Main pandal frame */}
        <line x1="300" y1="10" x2="60"  y2="500" stroke="#D4AF37" strokeWidth="2.5" opacity="0.6"/>
        <line x1="300" y1="10" x2="540" y2="500" stroke="#D4AF37" strokeWidth="2.5" opacity="0.6"/>
        <line x1="300" y1="10" x2="300" y2="660" stroke="#D4AF37" strokeWidth="1.5" opacity="0.5"/>
        {/* Cross beams */}
        {[200,350,480].map((y,i) => (
          <line key={i}
            x1={300 - (y-10)/490*240}
            y1={y}
            x2={300 + (y-10)/490*240}
            y2={y}
            stroke="#D4AF37" strokeWidth="1.5" opacity="0.4"
          />
        ))}
        {/* Peak ornament */}
        <polygon points="300,0 318,25 300,20 282,25" fill="#D4AF37" opacity="0.9"/>
        <circle cx="300" cy="0" r="8" fill="#FFD700" opacity="0.9"/>
        <circle cx="300" cy="0" r="15" fill="#FFD700" opacity="0.2"/>

        {/* Hanging decorations */}
        {[130,200,300,400,470].map((x,i) => {
          const y = 90 + Math.abs(x-300)/3
          const col = bulbColors[i % bulbColors.length]
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={x} y2={y+30} stroke="#D4AF37" strokeWidth="1" opacity="0.5"/>
              <polygon
                points={`${x},${y+30} ${x+12},${y+42} ${x},${y+55} ${x-12},${y+42}`}
                fill={col} opacity="0.8"
              />
              <circle cx={x} cy={y+30} r="8" fill={col} opacity="0.3"/>
            </g>
          )
        })}

        {/* Flag bunting */}
        <path d="M30,50 Q300,20 570,50" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.5"/>
        {[...Array(12)].map((_, i) => {
          const t = (i+0.5)/12
          const fx = 30 + t*540
          const fy = 50 - 30*4*t*(1-t) + 20
          const col = bulbColors[i % bulbColors.length]
          return (
            <polygon key={i}
              points={`${fx-8},${fy} ${fx+8},${fy} ${fx},${fy+18}`}
              fill={col} opacity="0.8"
            />
          )
        })}
      </svg>

      {/* Golden border */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 600 800">
        <rect x="10" y="10" width="580" height="780" rx="6" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.7"/>
      </svg>

      {/* Title */}
      <div style={{ position: 'absolute', top: 28, left: 0, right: 0, textAlign: 'center', zIndex: 20 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#D4AF37', margin: 0, textShadow: '0 0 20px rgba(212,175,55,0.7)' }}>Happy Vesak</h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: 4, color: '#FFD700', textTransform: 'uppercase', marginTop: 4, opacity: 0.85 }}>✨ Poya Day ✨</p>
      </div>

      {/* Text */}
      <div style={{
        position: 'absolute', left: 50, right: 50, top: '36%', bottom: '18%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20,
      }}>
        <CardText data={data} />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   5.  MINIMALIST TEMPLATE  — zen clean with lotus line art
   ══════════════════════════════════════════════════════════════════════ */
const MinimalistCard = ({ data }: TemplateProps) => (
  <div style={{
    width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(160deg, #FFFEF9 0%, #FFF8E7 100%)',
    display: 'flex', flexDirection: 'column',
  }}>
    {/* Subtle grid texture */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }} viewBox="0 0 600 800">
      {[...Array(30)].map((_, i) => <line key={`h${i}`} x1="0" y1={i*28} x2="600" y2={i*28} stroke="#8B6914" strokeWidth="0.5"/>)}
      {[...Array(22)].map((_, i) => <line key={`v${i}`} x1={i*28} y1="0" x2={i*28} y2="800" stroke="#8B6914" strokeWidth="0.5"/>)}
    </svg>

    {/* Lotus line art — top center */}
    <svg style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)', width: '55%' }} viewBox="0 0 200 120">
      {/* Stem */}
      <path d="M100,118 Q95,90 100,70" stroke="#D4AF37" strokeWidth="1.5" fill="none"/>
      <path d="M100,100 Q80,85 60,88" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6"/>
      <path d="M100,100 Q120,85 140,88" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6"/>
      {/* Petals — just strokes */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => {
        const r = i % 2 === 0 ? 42 : 30
        return (
          <path key={i}
            d={`M100,70 Q${100+Math.cos(((a-90)*Math.PI)/180)*r*0.6},${70+Math.sin(((a-90)*Math.PI)/180)*r*0.6} ${100+Math.cos(((a-90)*Math.PI)/180)*r},${70+Math.sin(((a-90)*Math.PI)/180)*r} Q${100+Math.cos(((a+30-90)*Math.PI)/180)*r*0.6},${70+Math.sin(((a+30-90)*Math.PI)/180)*r*0.6} 100,70`}
            fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity={0.5+i*0.03}
          />
        )
      })}
      <circle cx="100" cy="70" r="8" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.8"/>
      <circle cx="100" cy="70" r="3" fill="#D4AF37" opacity="0.9"/>
    </svg>

    {/* Horizontal gold dividers */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 600 800">
      {/* Top divider */}
      <line x1="60" y1="240" x2="540" y2="240" stroke="#D4AF37" strokeWidth="1" opacity="0.4"/>
      <circle cx="300" cy="240" r="4" fill="#D4AF37" opacity="0.5"/>
      <circle cx="60"  cy="240" r="3" fill="#D4AF37" opacity="0.4"/>
      <circle cx="540" cy="240" r="3" fill="#D4AF37" opacity="0.4"/>
      {/* Bottom divider */}
      <line x1="60" y1="590" x2="540" y2="590" stroke="#D4AF37" strokeWidth="1" opacity="0.4"/>
      <circle cx="300" cy="590" r="4" fill="#D4AF37" opacity="0.5"/>
    </svg>

    {/* Double border */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 600 800">
      <rect x="14" y="14" width="572" height="772" rx="2" fill="none" stroke="#D4AF37" strokeWidth="2" opacity="0.7"/>
      <rect x="24" y="24" width="552" height="752" rx="2" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.35"/>
      {/* Corner dots */}
      {[[18,18],[582,18],[18,782],[582,782]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#D4AF37" opacity="0.7"/>
      ))}
    </svg>

    {/* Title */}
    <div style={{ position: 'absolute', top: 40, left: 0, right: 0, textAlign: 'center', zIndex: 10 }}>
      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, letterSpacing: 8, color: '#9A7A22', textTransform: 'uppercase', margin: 0 }}>Wishing You A</p>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 400, color: '#2C1810', margin: '6px 0 0', letterSpacing: 2 }}>Happy Vesak</h1>
      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, letterSpacing: 6, color: '#D4AF37', textTransform: 'uppercase', marginTop: 6 }}>Poya Day</p>
    </div>

    {/* Text */}
    <div style={{
      position: 'absolute', left: 60, right: 60, top: '38%', bottom: '25%',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
    }}>
      <CardText data={data} />
    </div>

    {/* Bottom lotus motif */}
    <svg style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', width: '30%', opacity: 0.5 }} viewBox="0 0 100 40">
      {[270,310,350,30,70].map((a,i) => (
        <path key={i}
          d={`M50,30 Q${50+Math.cos((a*Math.PI)/180)*25},${30+Math.sin((a*Math.PI)/180)*25} ${50+Math.cos((a*Math.PI)/180)*35},${30+Math.sin((a*Math.PI)/180)*35}`}
          fill="none" stroke="#D4AF37" strokeWidth="1"
        />
      ))}
      <circle cx="50" cy="30" r="4" fill="none" stroke="#D4AF37" strokeWidth="1"/>
    </svg>
  </div>
)

/* ══════════════════════════════════════════════════════════════════════
   6.  GOLDEN TEMPLATE  — sacred gold with mandala border
   ══════════════════════════════════════════════════════════════════════ */
const GoldenCard = ({ data }: TemplateProps) => (
  <div style={{
    width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(145deg, #6B4A0A 0%, #B8962E 25%, #D4AF37 50%, #F5D060 75%, #B8962E 100%)',
  }}>
    {/* Radial shimmer overlay */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    }}/>

    {/* Mandala corner decorations */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 600 800">
      <defs>
        <pattern id="mandalaPat" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
          <circle cx="30" cy="30" r="10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
          {[0,45,90,135].map((a,i) => (
            <line key={i}
              x1={30+Math.cos((a*Math.PI)/180)*10}
              y1={30+Math.sin((a*Math.PI)/180)*10}
              x2={30+Math.cos((a*Math.PI)/180)*20}
              y2={30+Math.sin((a*Math.PI)/180)*20}
              stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"
            />
          ))}
        </pattern>
      </defs>
      <rect width="600" height="800" fill="url(#mandalaPat)"/>
    </svg>

    {/* Large circular mandala behind title */}
    <svg style={{ position: 'absolute', top: '3%', left: '50%', transform: 'translateX(-50%)', width: '70%' }} viewBox="0 0 300 300">
      {[...Array(8)].map((_, ring) => (
        <circle key={ring} cx="150" cy="150" r={20+ring*16}
          fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"
          strokeDasharray={ring % 2 === 0 ? '4,4' : '8,4'}
        />
      ))}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => (
        <line key={i}
          x1={150+Math.cos((a*Math.PI)/180)*20}
          y1={150+Math.sin((a*Math.PI)/180)*20}
          x2={150+Math.cos((a*Math.PI)/180)*140}
          y2={150+Math.sin((a*Math.PI)/180)*140}
          stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"
        />
      ))}
      {/* Lotus petals in circle */}
      {[0,40,80,120,160,200,240,280,320].map((a,i) => (
        <ellipse key={i}
          cx={150+Math.cos((a*Math.PI)/180)*80}
          cy={150+Math.sin((a*Math.PI)/180)*80}
          rx="22" ry="10"
          transform={`rotate(${a},${150+Math.cos((a*Math.PI)/180)*80},${150+Math.sin((a*Math.PI)/180)*80})`}
          fill="rgba(255,255,255,0.12)"
        />
      ))}
    </svg>

    {/* Om / lotus center symbol */}
    <svg style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '25%' }} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="36" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      <text x="40" y="52" textAnchor="middle" fontSize="36" fill="rgba(255,255,255,0.7)" fontFamily="serif">ॐ</text>
    </svg>

    {/* Ornate multi-layer border */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 600 800">
      <rect x="8"  y="8"  width="584" height="784" rx="6" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
      <rect x="16" y="16" width="568" height="768" rx="4" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
      <rect x="24" y="24" width="552" height="752" rx="3" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="10,5"/>
      {/* Corner mandalas */}
      {[[40,40],[560,40],[40,760],[560,760]].map(([cx,cy],i) => (
        <g key={i}>
          {[0,45,90,135,180,225,270,315].map((a,j) => (
            <line key={j}
              x1={cx} y1={cy}
              x2={cx+Math.cos((a*Math.PI)/180)*22}
              y2={cy+Math.sin((a*Math.PI)/180)*22}
              stroke="rgba(255,255,255,0.35)" strokeWidth="1"
            />
          ))}
          <circle cx={cx} cy={cy} r="22" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <circle cx={cx} cy={cy} r="8"  fill="rgba(255,255,255,0.2)"/>
        </g>
      ))}
    </svg>

    {/* Title */}
    <div style={{ position: 'absolute', top: 32, left: 0, right: 0, textAlign: 'center', zIndex: 10 }}>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: 7, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', margin: 0 }}>✦  Sacred Blessings  ✦</p>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 700, color: '#FFFFFF', margin: '8px 0 0', textShadow: '0 2px 16px rgba(0,0,0,0.3)', letterSpacing: 1 }}>Happy Vesak</h1>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: 4, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', marginTop: 4 }}>Poya Day</p>
    </div>

    {/* Text content */}
    <div style={{
      position: 'absolute', left: 50, right: 50, top: '40%', bottom: '18%',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
    }}>
      <CardText data={data} />
    </div>

    {/* Bottom lotus row */}
    <svg style={{ position: 'absolute', bottom: 20, left: 0, width: '100%' }} viewBox="0 0 600 50">
      {[100,200,300,400,500].map((x,i) => (
        <g key={i} transform={`translate(${x},25)`}>
          {[0,60,120,180,240,300].map((a,j) => (
            <ellipse key={j}
              cx={Math.cos((a*Math.PI)/180)*12}
              cy={Math.sin((a*Math.PI)/180)*12}
              rx="8" ry="4"
              transform={`rotate(${a},${Math.cos((a*Math.PI)/180)*12},${Math.sin((a*Math.PI)/180)*12})`}
              fill="rgba(255,255,255,0.25)"
            />
          ))}
          <circle cx="0" cy="0" r="4" fill="rgba(255,255,255,0.4)"/>
        </g>
      ))}
    </svg>
  </div>
)

/* ══════════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════════════════════ */
export default function CardTemplate({ data, isPreview }: TemplateProps) {
  const W = data.orientation === 'landscape' ? 800 : 600
  const H = data.orientation === 'landscape' ? 600 : 800

  const inner = () => {
    switch (data.templateId) {
      case 'lantern':    return <LanternCard   data={data} isPreview={isPreview} />
      case 'lotus':      return <LotusCard     data={data} isPreview={isPreview} />
      case 'temple':     return <TempleCard    data={data} isPreview={isPreview} />
      case 'pandal':     return <PandalCard    data={data} isPreview={isPreview} />
      case 'minimalist': return <MinimalistCard data={data} isPreview={isPreview}/>
      case 'golden':     return <GoldenCard    data={data} isPreview={isPreview} />
      default:           return <LanternCard   data={data} isPreview={isPreview} />
    }
  }

  return (
    <div
      style={{ width: W, height: H, position: 'relative', flexShrink: 0 }}
      data-card-template
    >
      {inner()}
    </div>
  )
}
