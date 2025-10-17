"use client";

import type { CortexUIKitAPIOptions } from "@cortex-ai/ui-kit-shared";

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
