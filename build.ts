import tailwindcss from "@bunup/plugin-tailwindcss";

await Bun.$`rm -rf dist/**`;
await Bun.$`mkdir -p dist/chat`;

const copyHtmlPlugin: Bun.BunPlugin = {
	name: "copy-html",
	setup(build) {
		build.onEnd(async () => {
			await Bun.$`cp static/index.html ${build.config.outdir}/index.html`;
		});
	},
};

await Bun.build({
	entrypoints: ["static/apps/chat/index.tsx"],
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
