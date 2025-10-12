import {
	type CortexChatConfig,
	parseConfigFromHash,
} from "@cortex-ai/ui-helpers";
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";

export type Message = {
	role: "user" | "assistant";
	content: string;
};

export type Conversation = {
	id: string;
	title: string;
	messages: Message[];
	createdAt: Date;
};

type ChatContextType = {
	conversations: Conversation[];
	currentConversationId: string | null;
	currentMessages: Message[];
	greeting: string;
	suggestedMessages: string[];
	isHistoryOpen: boolean;
	sendMessage: (content: string) => void;
	createNewChat: () => void;
	selectConversation: (id: string) => void;
	toggleHistory: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

const mockConversations: Conversation[] = [
	{
		id: "1",
		title: "Getting started with React",
		messages: [
			{ role: "user", content: "How do I get started with React?" },
			{
				role: "assistant",
				content:
					"React is a JavaScript library for building user interfaces. To get started, you can create a new React app using Create React App or Vite. Would you like me to guide you through the setup process?",
			},
		],
		createdAt: new Date("2025-10-09"),
	},
	{
		id: "2",
		title: "TypeScript best practices",
		messages: [
			{ role: "user", content: "What are TypeScript best practices?" },
			{
				role: "assistant",
				content:
					"TypeScript best practices include using strict mode, avoiding 'any' types, using interfaces for object types, and leveraging type inference. Let me explain each in detail.",
			},
		],
		createdAt: new Date("2025-10-08"),
	},
];

export function ChatProvider({ children }: PropsWithChildren) {
	const [conversations, setConversations] =
		useState<Conversation[]>(mockConversations);
	const [currentConversationId, setCurrentConversationId] = useState<
		string | null
	>(null);
	const [isHistoryOpen, setIsHistoryOpen] = useState(false);
	const [clientSecret, setClientSecret] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const config = parseConfigFromHash<CortexChatConfig>();
			if (config) {
				setClientSecret(config.clientSecret);
			}
		}
	}, []);

	const greeting = "Hello! How can I help you today?";
	const suggestedMessages = [
		"Explain React hooks",
		"Help me debug my code",
		"What's new in JavaScript?",
		"Best practices for TypeScript",
		clientSecret || "",
	];

	const currentConversation = conversations.find(
		(c) => c.id === currentConversationId,
	);
	const currentMessages = currentConversation?.messages || [];

	const sendMessage = (content: string) => {
		if (!currentConversationId) {
			const newConversation: Conversation = {
				id: Date.now().toString(),
				title: content.slice(0, 50),
				messages: [
					{ role: "user", content },
					{
						role: "assistant",
						content:
							"This is a mock response. The actual implementation will handle real responses.",
					},
				],
				createdAt: new Date(),
			};
			setConversations([newConversation, ...conversations]);
			setCurrentConversationId(newConversation.id);
		} else {
			setConversations(
				conversations.map((conv) =>
					conv.id === currentConversationId
						? {
								...conv,
								messages: [
									...conv.messages,
									{ role: "user", content },
									{
										role: "assistant",
										content:
											"This is a mock response. The actual implementation will handle real responses.",
									},
								],
							}
						: conv,
				),
			);
		}
	};

	const createNewChat = () => {
		setCurrentConversationId(null);
		setIsHistoryOpen(false);
	};

	const selectConversation = (id: string) => {
		setCurrentConversationId(id);
		setIsHistoryOpen(false);
	};

	const toggleHistory = () => {
		setIsHistoryOpen(!isHistoryOpen);
	};

	return (
		<ChatContext.Provider
			value={{
				conversations,
				currentConversationId,
				currentMessages,
				greeting,
				suggestedMessages,
				isHistoryOpen,
				sendMessage,
				createNewChat,
				selectConversation,
				toggleHistory,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}

export function useChat() {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error("useChat must be used within ChatProvider");
	}
	return context;
}
