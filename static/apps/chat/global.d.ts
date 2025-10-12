import type { CortexChatConfig } from "@cortex-ai/ui-helpers";

declare global {
	interface Window {
		CHAT_CONFIG: CortexChatConfig;
	}
}
