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
				],
				splitting: false,
			},
		},
		{
			name: "ui-kit",
			root: "packages/ui-kit",
		},
	],
	{
		exports: true,
		unused: true,
	},
);
