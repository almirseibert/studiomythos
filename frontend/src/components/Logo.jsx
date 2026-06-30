import React from 'react';

// Marca Studio Mythos (identidade "winged M" / Voltage).
// O símbolo (winged M) é a imagem em /public/logo-mark.png — PNG transparente
// extraído do artefato de identidade. O nome é renderizado como texto (Roboto),
// garantindo nitidez, escalabilidade e a grafia correta ("Studio Mythos").
const BRAND_MARK = '/logo-mark.png';

// Cores da tipografia (do artefato de identidade)
const COR_STUDIO_CLARO = '#16314F';
const COR_NOME_CLARO = '#011F41';

// Monograma SVG de fallback, caso a imagem do símbolo não carregue.
function LogoMarkSvg({ size = 40 }) {
  const uid = React.useId();
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Studio Mythos">
      <defs>
        <linearGradient id={`ring-${uid}`} x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#22D3EE" /><stop offset="1" stopColor="#2F8AF0" />
        </linearGradient>
      </defs>
      <path d="M30 92 L30 34" stroke={`url(#ring-${uid})`} strokeWidth="12" strokeLinecap="round" />
      <path d="M90 92 L90 34" stroke={`url(#ring-${uid})`} strokeWidth="12" strokeLinecap="round" />
      <path d="M30 34 L60 66 L90 34" stroke={`url(#ring-${uid})`} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/**
 * Símbolo da marca (winged M). Usa a imagem; cai no SVG se falhar.
 *  - size: altura em px (default 40)
 *  - glow: aceito por compatibilidade (sem efeito)
 */
export function LogoMark({ size = 40 }) {
  const [imgOk, setImgOk] = React.useState(true);
  if (!imgOk) return <LogoMarkSvg size={size} />;
  return (
    <img
      src={BRAND_MARK}
      alt="Studio Mythos"
      style={{ height: size, width: 'auto' }}
      className="select-none object-contain"
      onError={() => setImgOk(false)}
      draggable={false}
    />
  );
}

/**
 * Logo completo (símbolo + nome) com light sweep.
 *  - size: altura do símbolo em px (default 40); o nome escala junto.
 *  - showText: exibe o wordmark "Studio Mythos" (default true)
 *  - variant: 'light' (texto branco p/ fundo escuro) | 'dark' (texto navy p/ fundo claro)
 *  - sweep: ativa a animação de light sweep (default true)
 *  - tagline: subtítulo opcional sob o nome
 */
export default function Logo({ size = 40, showText = true, variant = 'light', tagline, sweep = true }) {
  const fundoEscuro = variant === 'light';
  const corStudio = fundoEscuro ? '#FFFFFF' : COR_STUDIO_CLARO;
  const corNome = fundoEscuro ? '#FFFFFF' : COR_NOME_CLARO;

  return (
    <div className="logo-lockup" style={{ gap: size * 0.2 }}>
      <LogoMark size={size} />
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontFamily: "'Roboto', ui-sans-serif, sans-serif", lineHeight: 1 }}>
          <span style={{ fontSize: size * 0.262, fontWeight: 400, letterSpacing: '0.34em', color: corStudio }}>STUDIO</span>
          <span style={{ fontSize: size * 0.553, fontWeight: 900, letterSpacing: '-0.01em', color: corNome, marginTop: size * 0.04 }}>MYTHOS</span>
          {tagline && (
            <span style={{ fontSize: size * 0.16, letterSpacing: '0.18em', marginTop: size * 0.12, textTransform: 'uppercase', color: fundoEscuro ? '#94A3B8' : '#64748B' }}>{tagline}</span>
          )}
        </div>
      )}
      {sweep && <span className="logo-sweep" aria-hidden="true" />}
    </div>
  );
}
