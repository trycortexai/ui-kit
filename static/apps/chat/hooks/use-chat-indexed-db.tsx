import { useCallback, useMemo } from "react";
import { useIndexedDB } from "./use-indexed-db";

const DB_NAME = "cortex-chat-db";
const DB_VERSION = 2;
const CONVERSATIONS_STORE = "conversations";
const MESSAGES_STORE = "messages";

export interface DBConversation {
	id: string;
	title: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface DBMessage {
	id: string;
	conversationId: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

export function useChatIndexedDB() {
	const dbConfig = useMemo(
		() => ({
			dbName: DB_NAME,
			version: DB_VERSION,
			stores: [
				{
					name: CONVERSATIONS_STORE,
					keyPath: "id",
					indexes: [
						{
							name: "createdAt",
							keyPath: "createdAt",
							unique: false,
						},
					],
				},
				{
					name: MESSAGES_STORE,
					keyPath: "id",
					indexes: [
						{
							name: "conversationId",
							keyPath: "conversationId",
							unique: false,
						},
						{
							name: "timestamp",
							keyPath: "timestamp",
							unique: false,
						},
					],
				},
			],
		}),
		[],
	);

	const {
		isReady,
		error,
		put,
		get,
		getAll,
		getAllByIndex,
		deleteItem,
		deleteByIndex,
		clearAll,
	} = useIndexedDB(dbConfig);

	const saveConversation = useCallback(
		async (conversation: DBConversation): Promise<void> => {
			await put(CONVERSATIONS_STORE, conversation);
		},
		[put],
	);

	const getConversation = useCallback(
		async (id: string): Promise<DBConversation | undefined> => {
			return await get<DBConversation>(CONVERSATIONS_STORE, id);
		},
		[get],
	);

	const getAllConversations = useCallback(async (): Promise<
		DBConversation[]
	> => {
		const conversations = await getAll<DBConversation>(CONVERSATIONS_STORE);
		return conversations.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);
	}, [getAll]);

	const deleteConversation = useCallback(
		async (id: string): Promise<void> => {
			await deleteItem(CONVERSATIONS_STORE, id);
			await deleteByIndex(
				MESSAGES_STORE,
				"conversationId",
				IDBKeyRange.only(id),
			);
		},
		[deleteItem, deleteByIndex],
	);

	const saveMessage = useCallback(
		async (message: DBMessage): Promise<void> => {
			await put(MESSAGES_STORE, message);
		},
		[put],
	);

	const getMessagesForConversation = useCallback(
		async (conversationId: string): Promise<DBMessage[]> => {
			const messages = await getAllByIndex<DBMessage>(
				MESSAGES_STORE,
				"conversationId",
				conversationId,
			);
			return messages.sort(
				(a, b) =>
					new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
			);
		},
		[getAllByIndex],
	);

	const deleteMessage = useCallback(
		async (id: string): Promise<void> => {
			await deleteItem(MESSAGES_STORE, id);
		},
		[deleteItem],
	);

	const clearAllData = useCallback(async (): Promise<void> => {
		await clearAll();
	}, [clearAll]);

	return {
		isReady,
		error,
		saveConversation,
		getConversation,
		getAllConversations,
		deleteConversation,
		saveMessage,
		getMessagesForConversation,
		deleteMessage,
		clearAllData,
	};
}
