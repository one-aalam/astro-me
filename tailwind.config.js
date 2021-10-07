const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const theme = require('./themes/purple')

module.exports = {
    mode: 'jit',
    darkMode: 'class',
    purge: ['./public/**/*.html', './src/**/*.{astro,js,ts}'],
    theme: {
        colors: {
            ...colors,
            ...theme,
        },
		fontFamily: {
			sans: ['Fira Code', ...fontFamily.sans],
		},
		extend: {
            screens: {
                'print': {'raw': 'print'},
            }
		}
	},
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/aspect-ratio'),
    ]
};
