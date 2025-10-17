"use client";

import type { CortexChatElement } from "@cortex-ai/ui-kit";
import type { CortexChatOptions as CoreCortexChatOptions } from "@cortex-ai/ui-kit-shared/chat";
import { useEffect, useRef } from "react";
import type { CortexUIKitControl } from ".";

export type CortexChatProps = React.HTMLAttributes<CortexChatElement> & {
	control: CortexUIKitControl;
	options: CoreCortexChatOptions;
};

declare module "react" {
	namespace JSX {
		interface IntrinsicElements {
			"cortex-chat": React.DetailedHTMLProps<
				React.HTMLAttributes<CortexChatElement>,
				CortexChatElement
			>;
		}
	}
}

export function CortexChat({
	options,
	control,
	...htmlProps
}: CortexChatProps): React.ReactNode {
	const chatRef = useRef<CortexChatElement>(null!);

	useEffect(() => {
		const el = chatRef.current;
		if (!el) return;

		const optionsToSet = {
			...control,
			...options,
		};

		if (customElements.get("cortex-chat")) {
			el.setOptions(optionsToSet);
			return;
		}

		customElements.whenDefined("cortex-chat").then(() => {
			el.setOptions(optionsToSet);
		});
	}, [options, control]);

	return <cortex-chat ref={chatRef} {...htmlProps}></cortex-chat>;
}

export default CortexChat;
