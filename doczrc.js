export default {
	title: "create-streamdeck-plugin",
	dest: "docs",
	src: "./docs-src",
	typescript: false,
	themeConfig: {
		initialColorMode: "dark",
		colors: {
			modes: {
				dark: {
					primary: "#6678FF",
					header: {
						bg: "#070f49",
						text: "#FFFFFF"
					},
					sidebar: {
						bg: "#2a2a2a",
						navGroup: "#ACAEBD",
						navLink: "#ACAEBD",
						navLinkActive: "#EBECF3",
						tocLink: "#ACAEBD",
						tocLinkActive: "#EBECF3"
					},
					background: "#282828",
					text: "#EFF0F3",
					muted: "#ACAEBD",
					link: "#6678FF",
					props: {
						highlight: "#6678FF"
					}
				}
			}
		}
	}
};
