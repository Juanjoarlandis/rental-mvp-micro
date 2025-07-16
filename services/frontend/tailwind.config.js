/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    darkMode: 'class',                     // ← permite forzar “night mode” con la clase .dark
    theme: {
        /* breakpoints & container idénticos … */
        screens: {
            xs: '375px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1440px',
            '3xl': '1920px'
        },
        container: { center: true, padding: '1rem' },

        /* ------------------------- PALETA ------------------------- */
        extend: {
            fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },

            /**  Pauta de color accesible (WCAG AA):  
             *   – surface.* → fondos de tarjetas, modales, etc.  
             *   – on‑surface.* → texto/íconos sobre esos fondos.
             */
            colors: {
                brand: {
                    DEFAULT: '#0d6efd',
                    hover: '#0b5ed7',
                    dark: '#047af0',
                    'hover-dark': '#0364c5'
                },

                /* superficies */
                surface: '#ffffff',
                'surface-dark': '#1f2937',

                /* texto sobre superficie */
                'on-surface': '#111827',
                'on-surface-dark': '#e5e7eb'
            },

            boxShadow: {
                card: '0 1px 3px rgb(0 0 0 / .08)',
                cardHover: '0 4px 12px rgb(0 0 0 / .12)'
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/container-queries')
    ]
};
