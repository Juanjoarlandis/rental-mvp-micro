/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',        // Activa el modo oscuro por clase
    content: ['./index.html', './src/**/*.{ts,tsx}'],

    /* ───── Diseño básico ─────────────────────────────────────────────── */
    theme: {
        /* Breakpoints fluidos */
        screens: {
            xs: '375px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1440px',
            '3xl': '1920px',
        },

        /* Contenedor centrado */
        container: { center: true, padding: '1rem' },

        /* Tipografía por defecto */
        fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },

        /* ───── Extensiones (diseño tokens) ─────────────────────────────── */
        extend: {
            /* Paleta de marca accesible (AA) */
            colors: {
                brand: {
                    DEFAULT: '#0e9f6e',     // Contraste 4.5:1 con #fff y #0f172a :contentReference[oaicite:1]{index=1}
                    light: '#34d399',
                    hover: '#0fbf7f',
                    dark: '#047857',
                    'hover-dark': '#03563b',
                },
                surface: '#ffffff',
                'surface-dark': '#1f2937',
            },

            /* Sombras coherentes */
            boxShadow: {
                card: '0 1px 3px rgba(0,0,0,.08)',
                cardHover: '0 4px 12px rgba(0,0,0,.12)',
            },

            /* Keyframes reutilizables */
            keyframes: {
                'fade-in': {
                    '0%': { opacity: 0, transform: 'translateY(12px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            },

            /* Atajos de animación */
            animation: {
                'fade-in': 'fade-in 400ms ease-out forwards',
                marquee: 'marquee 25s linear infinite',
            },
        },
    },

    /* ───── Plugins oficiales ─────────────────────────────────────────── */
    plugins: [
        require('@tailwindcss/forms'),            // Inputs coherentes :contentReference[oaicite:2]{index=2}
        require('@tailwindcss/typography'),       // Prosa optimizada
        require('@tailwindcss/line-clamp'),       // Clamp de texto
        require('@tailwindcss/container-queries'),// Consultas de contenedor :contentReference[oaicite:3]{index=3}
        require('@tailwindcss/aspect-ratio'),     // Control de aspect‑ratio
    ],
};
