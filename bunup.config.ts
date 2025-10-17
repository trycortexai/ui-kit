import { defineWorkspace } from "bunup";

export default defineWorkspace(
	[
		{
			name: "ui-kit-shared",
			root: "packages/ui-kit-shared",
			config: {
				entry: [
					"src/index.ts",
					"src/chat.ts",
					"src/cortex.ts",
					"src/common.ts",
					"src/bridge/index.ts",
					"src/bridge/client.ts",
				],
				splitting: false,
			},
		},
		{
			name: "ui-kit",
			root: "packages/ui-kit",
		},
		{
			name: "ui-kit-react",
			root: "packages/ui-kit-react",
			config: {
				entry: ["src/index.tsx", "src/chat.tsx"],
			},
		},
	],
	{
		exports: true,
		unused: true,
	},
);
