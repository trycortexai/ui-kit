import tailwindcss from "@bunup/plugin-tailwindcss";
import chokidar from "chokidar";

const hasWatchFlag = Bun.argv.includes("--watch");

await Bun.$`rm -rf dist`;
await Bun.$`mkdir -p dist/chat`;

const copyHtmlPlugin: Bun.BunPlugin = {
	name: "copy-html",
	setup(build) {
		build.onEnd(async () => {
			await Bun.$`cp index.html ${build.config.outdir}/index.html`;
		});
	},
};

async function build() {
	console.log("Building...");
	await Bun.build({
		entrypoints: ["apps/chat/index.tsx"],
		outdir: "dist/chat",
		format: "esm",
		plugins: [
			tailwindcss({
				preflight: true,
			}),
			copyHtmlPlugin,
		],
	});
	console.log("Build complete!");
}

await build();

if (hasWatchFlag) {
	console.log("Watch mode enabled. Watching for changes...");

	const watchPaths = new Bun.Glob("**/*.{tsx,ts}");

	const watcher = chokidar.watch(Array.from(watchPaths.scanSync()), {
		ignored: /(^|[/\\])\../,
		persistent: true,
		ignoreInitial: true,
		ignorePermissionErrors: true,
	});

	watcher.on("change", async () => {
		await build();
	});

	process.on("SIGINT", () => {
		watcher.close();
		process.exit(0);
	});
}
