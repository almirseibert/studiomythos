import React, { useId } from 'react';

// Função local para substituir a importação externa ausente
const acharViseira = (nome) => {
  const viseiras = {
    'transparente': { tipo: 'transparente', tint: '#00000080' },
    'solido': { tipo: 'solido', cor: '#222222' },
    'cromada': { tipo: 'cromada', stops: ['#e2e8f0', '#94a3b8'] }
  };
  return viseiras[nome] || viseiras['transparente'];
};

// Caminhos extraídos do novo SVG fornecido
const SHELL_PATH = "M-648.374-999.736s49.027-4.343 71.789-12.885c23.448-8.8 51.483-17.215 64.426-38.656 3.372-5.586 6.292-45.19 3.681-58.29-3.477-17.452-17.446-32.88-32.52-42.337-13.625-8.548-31.225-11.26-47.245-9.817-18.46 1.663-37.965 8.243-51.541 20.862-11.189 10.4-20.248 41.11-20.248 41.11s20.023 5.8 30.065 8.59c12.86 3.572 29.346.868 38.656 10.43 4.256 4.372 5.108 11.747 4.295 17.795-.903 6.713-4.651 13.411-9.817 17.793-7.942 6.738-19.27 8.242-29.452 10.431-12.04 2.588-36.815 3.068-36.815 3.068l-3.682-4.295s-.142 10.587 1.841 15.34c3.42 8.195 16.567 20.861 16.567 20.861";

const VISOR_PATH = "M-510.608-1054.081c-17.879 19.91-42.981 29.629-64.477 37.657-25.365 7.05-51.41 11.406-75.134 15.044a128 128 0 0 0 2.407 2.407l.903.86 1.247-.13s12.329-1.059 27.509-3.223c15.18-2.165 33.157-5.355 45.003-9.8 23.312-8.749 47.781-14.96 61.468-37.633.506-.853.798-4.405 1.074-5.182";

export default function HelmetSVG({
  corBase = '#DC2626',
  viseira = 'transparente',
  grafismo = 'nenhum',
  corGrafismo = '#FFFFFF',
  className = '',
}) {
  const raw = useId().replace(/:/g, '');
  const id = (s) => `${s}-${raw}`;
  
  const v = acharViseira?.(viseira) || { tipo: 'transparente', tint: '#00000080' };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 124.27 131.654"
      className={className}
      role="img"
      aria-label="Pré-visualização do capacete"
    >
      <defs>
        {/* === FILTROS E ESTILOS ORIGINAIS ADAPTADOS === */}
        <clipPath id={id('shell')}>
          <path d={SHELL_PATH} />
        </clipPath>

        <linearGradient id={id('chrome')} x1="0" y1="0" x2="1" y2="1">
          {(v.stops || ['#e2e8f0', '#94a3b8']).map((c, i, arr) => (
            <stop key={i} offset={`${(i / (arr.length - 1)) * 100}%`} stopColor={c} />
          ))}
        </linearGradient>

        <linearGradient id={id('glass')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>

        <linearGradient id={id('shadeV')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="40%" stopColor="#fff" stopOpacity="0.03" />
          <stop offset="72%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>

        <radialGradient id={id('gloss')} cx="42%" cy="29%" r="40%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.40" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>

        {grafismo === 'carbono' && (
          <pattern id={id('carbon')} width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="18" height="18" fill={corGrafismo} opacity="0.16" />
            <rect width="9" height="9" fill="#000" opacity="0.30" />
            <rect x="9" y="9" width="9" height="9" fill="#000" opacity="0.30" />
          </pattern>
        )}

        {/* === DEFS DO NOVO SVG === */}
        <linearGradient id={id('lg3606')}>
          <stop offset="0" stopColor="#1a1a1a" stopOpacity="1" />
          <stop offset="1" stopColor="#333" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={id('lg3640')}>
          <stop offset="0" stopColor="#000" stopOpacity="1" />
          <stop offset="1" stopColor="#4d4d4d" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={id('lg3650')}>
          <stop offset="0" stopColor="#999" stopOpacity="1" />
          <stop offset="0.137" stopColor="#d0d0d0" stopOpacity="1" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.402" stopColor="#fff" stopOpacity="0.498" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={id('lg10041')}>
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#ccc" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={id('lg4447')}>
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={id('lg9450')} xlinkHref={`#${id('lg3640')}`} x1="-650.449" x2="-637.336" y1="-607.043" y2="-615.245" gradientTransform="translate(282.511 -218.787)scale(1.37545)" gradientUnits="userSpaceOnUse" />
        <linearGradient id={id('lg9452')} xlinkHref={`#${id('lg3650')}`} x1="-691.466" x2="-608.161" y1="-615.334" y2="-615.334" gradientTransform="translate(282.511 -218.787)scale(1.37545)" gradientUnits="userSpaceOnUse" />
        <linearGradient id={id('lg9456')} xlinkHref={`#${id('lg4447')}`} x1="-143.062" x2="-266.971" y1="-1229.033" y2="-1083.104" gradientTransform="translate(-358.336)" gradientUnits="userSpaceOnUse" />

        <radialGradient id={id('rg9444')} xlinkHref={`#${id('lg3606')}`} cx="-634.484" cy="-599.068" r="32.342" fx="-634.484" fy="-599.068" gradientTransform="matrix(.78572 -1.12894 1.90494 1.3258 1049.524 -967.542)" gradientUnits="userSpaceOnUse" />
        <radialGradient id={id('rg9454')} xlinkHref={`#${id('lg10041')}`} cx="-731.371" cy="-638.017" r="2.9" fx="-731.371" fy="-638.017" gradientUnits="userSpaceOnUse" />

        <filter id={id('f7229')} colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="1.625" />
        </filter>
        <filter id={id('f7247')} width="1.046" height="1.265" x="-0.023" y="-0.132" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="1.356" />
        </filter>
        <filter id={id('f4463')} colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="0.85" />
        </filter>
      </defs>

      <g transform="translate(-676.079 -65.355)">
        <g transform="translate(392.232 449.852)scale(.67119)">
          
          {/* Sombras baseadas no novo design */}
          <path fill="#000" filter={`url(#${id('f7229')})`} opacity="0.5" d="M521.344-561.5c-2.296.038-4.56.172-6.813.375-18.46 1.663-37.987 8.225-51.562 20.844-7.26 6.747-13.513 21.8-17.063 31.656l29.781 5.188-1.28 45.437-40.157 30v.656s1.352.201 2.125.313c.264 2.587.685 5.227 1.438 7.031 2.741 6.571 11.448 15.702 14.906 19.188l-.188.03a84 84 0 0 0 2.438 2.407l.875.844 1.25-.125s12.351-1.054 27.531-3.219 33.154-5.367 45-9.813c23.313-8.748 47.782-14.952 61.469-37.625.506-.853.786-4.41 1.062-5.187-.252.281-.495.567-.75.844 3.007-9.782 5.277-44.258 2.875-56.313-3.477-17.452-17.426-32.886-32.5-42.344-11.07-6.945-24.786-10.046-38.125-10.187a87 87 0 0 0-2.312 0" />
          <path fill="#000" filter={`url(#${id('f7247')})`} opacity="0.5" transform="matrix(.97992 -.3031 .51142 1.9519 -88.919 496.391)" d="M878.805-342.235c0 2.962-33.188 5.363-74.127 5.363-40.94 0-74.128-2.401-74.128-5.363 0-2.961 33.188-5.362 74.128-5.362s74.127 2.4 74.127 5.362" />
          
          <g transform="translate(1102.765 600.59)">
            
            {/* CASCO (cor base) + Volume Base */}
            <path d={SHELL_PATH} fill={corBase} />
            <path d={SHELL_PATH} fill={`url(#${id('shadeV')})`} />
            <path d={SHELL_PATH} fill={`url(#${id('gloss')})`} />

            {/* GRAFISMO: Renderizado, mascarado e ajustado para o novo formato do casco */}
            <g clipPath={`url(#${id('shell')})`}>
              <g transform="translate(-665, -1160) scale(0.31)">
                {grafismo === 'faixa' && (
                  <g fill={corGrafismo}>
                    <rect x="0" y="120" width="512" height="66" />
                    <rect x="0" y="108" width="512" height="7" opacity="0.85" />
                    <rect x="0" y="192" width="512" height="7" opacity="0.85" />
                  </g>
                )}
                {grafismo === 'linhas' && (
                  <g fill={corGrafismo}>
                    <rect x="0" y="116" width="512" height="10" />
                    <rect x="0" y="140" width="512" height="10" />
                    <rect x="0" y="164" width="512" height="10" />
                  </g>
                )}
                {grafismo === 'chamas' && (
                  <path fill={corGrafismo} d="M50,330 C80,272 70,222 116,190 C112,236 152,220 182,194 C176,240 216,224 246,200 C240,250 282,248 302,222 C284,302 230,334 150,342 C108,346 74,346 50,330 Z" />
                )}
                {grafismo === 'raio' && (
                  <path fill={corGrafismo} d="M300,80 L244,206 L288,206 L210,338 L244,216 L206,216 L262,96 Z" />
                )}
                {grafismo === 'carbono' && (
                  <rect x="0" y="0" width="512" height="512" fill={`url(#${id('carbon')})`} />
                )}
              </g>
            </g>

            {/* Sombra interna / base do casco (do novo SVG) */}
            <path fill={`url(#${id('rg9444')})`} d="M-666.782-1032.748s2.408-10.509 5.523-14.725c5.372-7.272 21.475-16.567 21.475-16.567l5.522-31.272 56.45 11.024-11.045 53.995-59.517 8.59z" />

            {/* JANELA DA VISEIRA (Dinâmica) */}
            <path d={VISOR_PATH} fill="#151515" />
            {v.tipo === 'cromada' ? (
              <path d={VISOR_PATH} fill={`url(#${id('chrome')})`} />
            ) : v.tipo === 'solido' ? (
              <path d={VISOR_PATH} fill={v.cor} />
            ) : (
              <path d={VISOR_PATH} fill={v.tint} />
            )}
            <path d={VISOR_PATH} fill={`url(#${id('glass')})`} />

            {/* Detalhes da Viseira e Pivô (Reflexos e contornos do novo SVG) */}
            <path fill={`url(#${id('lg9450')})`} d="M-660.426-1101.088c-.09.295-.258.774-.258.774l-.774 2.622 2.665.774s20.006 5.796 30.088 8.596c6.894 1.915 14.336 2.115 21.019 3.052s12.42 2.555 16.42 6.662c3.305 3.395 4.264 10.014 3.524 15.517-.8 5.956-4.243 12.163-8.855 16.076-7.112 6.033-17.943 7.577-28.282 9.8-10.84 2.33-38.607 2.264-40.672 2.315-1.941-2.825-1.116 4.882-.955 5.936 3.3-.063 31.04-.31 42.787-2.835 10.026-2.156 21.918-3.606 30.69-11.047 5.72-4.852 9.741-12.043 10.746-19.514.886-6.592.135-14.725-5.072-20.073-5.312-5.456-12.455-7.3-19.557-8.296-18.34-1.74-37.573-6.643-53.514-10.359" />
            <path fill={`url(#${id('lg9452')})`} stroke="#fff" strokeWidth="1.375" opacity="0.4" d="M-660.933-1103.858s21.637 6.695 32.757 8.677c12.155 2.167 24.564 4.364 36.879 3.471 10.985-.796 23.114-6.009 32.106-7.81 1.902-.38 5.206 2.604 5.206 2.604l-2.603 44.255s-25.125 11.301-38.18 15.619c-12.19 4.03-24.605 7.722-37.313 9.545-8.308 1.191-16.778 1.205-25.164.868-3.782-.153-11.28-1.302-11.28-1.302s-.368-27.55 1.084-41.217c1.243-11.706 6.508-34.71 6.508-34.71z" />
            <path fill={`url(#${id('rg9454')})`} transform="translate(443.883 -212.651)scale(1.37545)" d="M-728.472-638.017a2.9 2.9 0 1 1-5.8 0 2.9 2.9 0 0 1 5.8 0" />
            
            {/* Brilho superior (Highlight) */}
            <path fill={`url(#${id('lg9456')})`} filter={`url(#${id('f4463')})`} d="M-583.43-1158.031c-21.7 1.425-45.645 8.085-58.845 26.752-.965 2.62-5.56 6.873-3.154 8.592 38.108 14.69 82.865 13.94 120-3.438 3.764-1.096 4.712-3.006 1.562-5.562-14.224-17.865-36.723-28.002-59.562-26.344" />

          </g>
        </g>
      </g>
    </svg>
  );
}