export interface CortexChatOptions {
	colorScheme?: string;
	title?: string;
	accentColor?: string;
	neutralColor?: string;
}

export type CortexChatConfig = CortexChatOptions & {
	clientSecret: string;
};
