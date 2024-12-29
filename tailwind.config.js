/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				navbar: "#131313",
				sidemenu: "#111725",
				accent: "#7C90F6",
				accent2: "#596FE3",
				content: "#2D3250",
				extracontent: "#424669",
				border: "#5E638A",
				extra: "#6D70A3",
				extra2: "#8D91CC",
				mainbg: "#161E31"
			}
		},
	},
	plugins: [],
}

