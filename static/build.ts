import tailwindcss from "@bunup/plugin-tailwindcss";

const copyHtmlPlugin: Bun.BunPlugin = {
	name: "copy-html",
	setup(build) {
		build.onEnd(async () => {
			await Bun.$`cp assets/index.html ${build.config.outdir}/index.html`;
		});
	},
};

await Bun.build({
	entrypoints: ["chat/index.tsx"],
	outdir: "dist/chat",
	format: "esm",
	minify: true,
	plugins: [
		tailwindcss({
			preflight: true,
		}),
		copyHtmlPlugin,
	],
});
