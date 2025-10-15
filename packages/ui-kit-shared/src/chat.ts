import { UI_KIT_API_URL } from ".";

export type CortexChatOptions = {
	colorScheme?: string;
	title?: string;
	accentColor?: string;
	neutralColor?: string;
	greeting?: string;
	suggestedMessages?: string[];
};

export type CortexChatConfig = {
	clientSecret: string;
	agentId?: string;
	options: CortexChatOptions;
};

export const CHAT_API_URL: string = `${UI_KIT_API_URL}/chat`;
