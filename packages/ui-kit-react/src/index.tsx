"use client";

import type { CortexUIKitAPIOptions } from "@cortex-ai/ui-kit-shared";

// load and initialize the cortex chat custom element
import "@cortex-ai/ui-kit/cortex-chat";

type UseCortexUIKitOptions = {
	api: CortexUIKitAPIOptions;
};

export type CortexUIKitControl = {
	api: CortexUIKitAPIOptions;
};

type UseCortexUIKitReturn = {
	control: CortexUIKitControl;
};

export function useCortexUIKit(
	options: UseCortexUIKitOptions,
): UseCortexUIKitReturn {
	return {
		control: {
			api: options.api,
		},
	};
}
