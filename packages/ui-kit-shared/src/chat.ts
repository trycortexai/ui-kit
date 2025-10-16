import { type CortexUIKitAPIOptions, UI_KIT_API_URL } from ".";

export const CHAT_API_URL: string = `${UI_KIT_API_URL}/chat`;

export const CHAT_STATIC_APP_HOSTED_URL =
	"https://unpkg.com/@cortex-ai/static@latest/dist/chat/index.html";

/**
 * A suggested message with a label and prompt
 */
export type SuggestedMessage = {
	/**
	 * The display label for the suggested message button
	 */
	label: string;
	/**
	 * The actual prompt/message to send when the button is clicked
	 */
	prompt: string;
};

/**
 * Theme configuration for the chat interface
 */
export type CortexChatTheme = {
	/**
	 * Color scheme for the chat interface
	 * @default "light"
	 */
	colorScheme?: "light" | "dark";

	/**
	 * Primary accent color for the chat interface
	 * @default "blue"
	 */
	accentColor?:
		| "blue"
		| "indigo"
		| "violet"
		| "purple"
		| "fuchsia"
		| "pink"
		| "rose"
		| "sky"
		| "cyan"
		| "teal"
		| "gray"
		| "stone";

	/**
	 * Neutral color scheme for secondary UI elements
	 * @default "zinc"
	 */
	neutralColor?: "gray" | "zinc" | "stone";
};

/**
 * Start screen configuration for the chat interface
 */
export type CortexChatStartScreen = {
	/**
	 * Initial greeting message shown when the chat starts
	 * @example "Hello! How can I help you today?"
	 */
	greeting?: string;

	/**
	 * Array of suggested messages to display as quick action buttons
	 * @example [{ label: "Tell me about services", prompt: "What services do you offer?" }]
	 */
	suggestedMessages?: SuggestedMessage[];
};

/**
 * Composer configuration for the chat interface
 */
export type CortexChatComposer = {
	/**
	 * Custom placeholder text for the message input
	 * @default "Type a message..."
	 */
	placeholder?: string;
};

/**
 * Configuration options for the Cortex chat interface
 */
export type CortexChatOptions = {
	/**
	 * The agent ID to use for the chat
	 */
	agentId: string;

	/**
	 * API configuration options
	 */
	api: CortexUIKitAPIOptions;

	/**
	 * Theme customization options
	 */
	theme?: CortexChatTheme;

	/**
	 * Start screen configuration
	 */
	startScreen?: CortexChatStartScreen;

	/**
	 * Composer configuration
	 */
	composer?: CortexChatComposer;
};
