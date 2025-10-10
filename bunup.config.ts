import { defineWorkspace } from "bunup";

export default defineWorkspace(
	[
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
