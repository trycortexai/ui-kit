import {
	type CortexChatConfig,
	parseConfigFromHash,
} from "@cortex-ai/ui-helpers";
import {
	createContext,
	type PropsWithChildren,
	use,
	useCallback,
	useEffect,
	useState,
} from "react";
import {
	type DBConversation,
	type DBMessage,
	useIndexedDB,
} from "./use-indexed-db";

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
	isLoading: boolean;
	sendMessage: (content: string) => Promise<void>;
	createNewChat: () => void;
	selectConversation: (id: string) => void;
	toggleHistory: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

const API_BASE_URL = "http://localhost:3001";

export function ChatProvider({ children }: PropsWithChildren) {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [currentConversationId, setCurrentConversationId] = useState<
		string | null
	>(null);
	const [isHistoryOpen, setIsHistoryOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [workflowId, setWorkflowId] = useState<string | null>(null);

	const db = useIndexedDB();

	useEffect(() => {
		if (typeof window !== "undefined") {
			const config = parseConfigFromHash<CortexChatConfig>();
			if (config) {
				setClientSecret(config.clientSecret);
				setWorkflowId(config.agentId || null);
			}
		}
	}, []);

	useEffect(() => {
		if (!db.isReady) return;

		const loadConversations = async () => {
			try {
				const dbConversations = await db.getAllConversations();
				const conversationsWithMessages = await Promise.all(
					dbConversations.map(async (conv) => {
						const messages = await db.getMessagesForConversation(conv.id);
						return {
							id: conv.id,
							title: conv.title,
							messages: messages.map((msg) => ({
								role: msg.role,
								content: msg.content,
							})),
							createdAt: conv.createdAt,
						};
					}),
				);
				setConversations(conversationsWithMessages);
			} catch {}
		};

		loadConversations();
	}, [db.isReady, db.getAllConversations, db.getMessagesForConversation]);

	const greeting = "Hello! How can I help you today?";
	const suggestedMessages = [
		"Explain React hooks",
		"Help me debug my code",
		"What's new in JavaScript?",
		"Best practices for TypeScript",
	];

	const currentConversation = conversations.find(
		(c) => c.id === currentConversationId,
	);
	const currentMessages = currentConversation?.messages || [];

	const streamChatResponse = useCallback(
		async (messages: Message[]): Promise<string> => {
			if (!clientSecret || !workflowId) {
				throw new Error(
					"Configuration missing: clientSecret and workflowId are required",
				);
			}

			const response = await fetch(`${API_BASE_URL}/chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages,
					clientSecret,
					workflowId,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to stream response");
			}

			if (!response.body) {
				throw new Error("No response body");
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let assistantMessage = "";

			try {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = decoder.decode(value, { stream: true });
					const lines = chunk.split("\n");

					for (const line of lines) {
						if (line.startsWith("data: ")) {
							try {
								const data = JSON.parse(line.slice(6));
								if (data.output?.MODEL) {
									const modelOutput = data.output.MODEL.output;
									if (modelOutput?.message) {
										assistantMessage = modelOutput.message;
									}
								}
							} catch {}
						}
					}
				}
			} finally {
				reader.releaseLock();
			}

			return assistantMessage || "Sorry, I couldn't generate a response.";
		},
		[clientSecret, workflowId],
	);

	const updateConversationMessages = useCallback(
		(conversationId: string, messages: Message[]) => {
			setConversations((prev) => {
				const existing = prev.find((c) => c.id === conversationId);
				if (existing) {
					return prev.map((c) =>
						c.id === conversationId ? { ...c, messages } : c,
					);
				}
				return [
					{
						id: conversationId,
						title: messages[0]?.content.slice(0, 50) || "New Chat",
						messages,
						createdAt: new Date(),
					},
					...prev,
				];
			});
		},
		[],
	);

	const sendMessage = useCallback(
		async (content: string) => {
			if (!db.isReady) {
				return;
			}

			setIsLoading(true);

			try {
				let conversationId = currentConversationId;

				if (!conversationId) {
					conversationId = Date.now().toString();
					const newConversation: DBConversation = {
						id: conversationId,
						title: content.slice(0, 50),
						createdAt: new Date(),
						updatedAt: new Date(),
					};
					await db.saveConversation(newConversation);
					setCurrentConversationId(conversationId);
				}

				const userMessage: DBMessage = {
					id: `${conversationId}-${Date.now()}`,
					conversationId,
					role: "user",
					content,
					timestamp: new Date(),
				};
				await db.saveMessage(userMessage);

				const updatedMessages = [
					...currentMessages,
					{ role: "user" as const, content },
				];
				updateConversationMessages(conversationId, updatedMessages);

				const assistantContent = await streamChatResponse(updatedMessages);

				const assistantMessage: DBMessage = {
					id: `${conversationId}-${Date.now()}-assistant`,
					conversationId,
					role: "assistant",
					content: assistantContent,
					timestamp: new Date(),
				};
				await db.saveMessage(assistantMessage);

				updateConversationMessages(conversationId, [
					...updatedMessages,
					{ role: "assistant" as const, content: assistantContent },
				]);

				const conversation = await db.getConversation(conversationId);
				if (conversation) {
					await db.saveConversation({
						...conversation,
						updatedAt: new Date(),
					});
				}
			} finally {
				setIsLoading(false);
			}
		},
		[
			db,
			currentConversationId,
			currentMessages,
			streamChatResponse,
			updateConversationMessages,
		],
	);

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
		<ChatContext
			value={{
				conversations,
				currentConversationId,
				currentMessages,
				greeting,
				suggestedMessages,
				isHistoryOpen,
				isLoading,
				sendMessage,
				createNewChat,
				selectConversation,
				toggleHistory,
			}}
		>
			{children}
		</ChatContext>
	);
}

export function useChat() {
	const context = use(ChatContext);
	if (!context) {
		throw new Error("useChat must be used within ChatProvider");
	}
	return context;
}
