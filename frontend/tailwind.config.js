/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0A0E1A',
          900: '#0B1020',
          800: '#111827',
        },
        voltage: {
          DEFAULT: '#22D3EE',
          light: '#67E8F9',
        },
        // Editorial Industrial — Landing
        // Editorial Industrial — recalibrado pra navy/teal/sage (alinhado ao logo)
        paper: {
          DEFAULT: '#EDF0F2',   // off-white frio (vellum / papel de desenho técnico)
          warm: '#DEE5E8',      // não mais "warm" — agora pale blue-gray. Token mantido pra não quebrar classes.
        },
        sand: '#C9D5D5',        // mist verde-azulado (substitui o areia quente)
        ink: {
          DEFAULT: '#0B1620',   // quase preto puxado a navy
          warm: '#0B1A2E',      // navy-black alinhado ao logo #011F41
        },
        graphite: '#1F2A36',
        rule: '#B8C5CB',        // filete frio (era marrom-bege)
        mute: '#5C6B72',        // cinza azulado
        oxblood: {
          DEFAULT: '#1F6B6B',   // signal petrol/teal — token mantido, hex repropósito (era vermelho)
          deep: '#0F4848',
        },
        olive: {
          DEFAULT: '#2E4A3F',   // sage / verde-musgo (era olive amarelado)
          light: '#4A6B5C',
        },
        blueprint: {
          DEFAULT: '#16314F',   // = logo claro
          deep: '#011F41',      // = logo escuro
          light: '#3A5F85',
          paper: '#DCE5EC',     // fundo planta técnica em tom frio
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      boxShadow: {
        voltage: '0 10px 30px -10px rgba(34, 211, 238, 0.4)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 55%, #6D28D9 100%)',
      },
    },
  },
  plugins: [],
}
