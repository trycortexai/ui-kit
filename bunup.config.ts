import { tailwindcss } from "@bunup/plugin-tailwindcss";
import { defineWorkspace } from "bunup";
import { copy } from "bunup/plugins";

export default defineWorkspace(
	[
		{
			root: "./",
			name: "chat",
			config: {
				entry: "src/ui/chat/index.tsx",
			},
		},
	],
	{
		plugins: [
			tailwindcss({
				preflight: true,
			}),
			copy("src/assets/index.html"),
		],
		dts: false,
	},
);
