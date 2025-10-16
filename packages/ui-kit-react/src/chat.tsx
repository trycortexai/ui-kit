import type { CortexChatOptions as CoreCortexChatOptions } from "@cortex-ai/ui-kit-shared/chat";
import type { CortexUIKitControl } from ".";

type CortexChatOptions = {
	control: CortexUIKitControl;
	options: CoreCortexChatOptions;
};

export function CortexChat(_options: CortexChatOptions): React.ReactNode {
	return <></>;
}

export default CortexChat;
