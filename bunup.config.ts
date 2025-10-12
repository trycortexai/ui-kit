import { defineWorkspace } from "bunup";

export default defineWorkspace(
	[
		{
			name: "ui-helpers",
			root: "packages/ui-helpers",
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
