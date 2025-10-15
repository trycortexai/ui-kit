import { useCallback, useEffect, useState } from "react";

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

const initDB = (): Promise<IDBDatabase> => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => {
			reject(request.error);
		};

		request.onsuccess = () => {
			const db = request.result;

			if (
				!db.objectStoreNames.contains(CONVERSATIONS_STORE) ||
				!db.objectStoreNames.contains(MESSAGES_STORE)
			) {
				db.close();
				indexedDB.deleteDatabase(DB_NAME);
				setTimeout(() => {
					initDB().then(resolve).catch(reject);
				}, 100);
				return;
			}

			resolve(db);
		};

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;

			if (db.objectStoreNames.contains(CONVERSATIONS_STORE)) {
				db.deleteObjectStore(CONVERSATIONS_STORE);
			}
			if (db.objectStoreNames.contains(MESSAGES_STORE)) {
				db.deleteObjectStore(MESSAGES_STORE);
			}

			const conversationsStore = db.createObjectStore(CONVERSATIONS_STORE, {
				keyPath: "id",
			});
			conversationsStore.createIndex("createdAt", "createdAt", {
				unique: false,
			});

			const messagesStore = db.createObjectStore(MESSAGES_STORE, {
				keyPath: "id",
			});
			messagesStore.createIndex("conversationId", "conversationId", {
				unique: false,
			});
			messagesStore.createIndex("timestamp", "timestamp", {
				unique: false,
			});
		};
	});
};

const performTransaction = async <T,>(
	storeName: string,
	mode: IDBTransactionMode,
	callback: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> => {
	const db = await initDB();
	return new Promise((resolve, reject) => {
		try {
			const transaction = db.transaction(storeName, mode);
			const store = transaction.objectStore(storeName);
			const request = callback(store);

			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
			transaction.onerror = () => reject(transaction.error);
		} catch (error) {
			reject(error);
		}
	});
};

export function useIndexedDB() {
	const [isReady, setIsReady] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		initDB()
			.then(() => setIsReady(true))
			.catch((err) => setError(err));
	}, []);

	const saveConversation = useCallback(
		async (conversation: DBConversation): Promise<void> => {
			try {
				await performTransaction(CONVERSATIONS_STORE, "readwrite", (store) =>
					store.put(conversation),
				);
			} catch (err) {
				setError(err as Error);
				throw err;
			}
		},
		[],
	);

	const getConversation = useCallback(
		async (id: string): Promise<DBConversation | undefined> => {
			try {
				return await performTransaction(
					CONVERSATIONS_STORE,
					"readonly",
					(store) => store.get(id),
				);
			} catch (err) {
				setError(err as Error);
				throw err;
			}
		},
		[],
	);

	const getAllConversations = useCallback(async (): Promise<
		DBConversation[]
	> => {
		try {
			const conversations = await performTransaction(
				CONVERSATIONS_STORE,
				"readonly",
				(store) => store.getAll(),
			);
			return conversations.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, []);

	const deleteConversation = useCallback(async (id: string): Promise<void> => {
		try {
			await performTransaction(CONVERSATIONS_STORE, "readwrite", (store) =>
				store.delete(id),
			);

			const db = await initDB();
			const transaction = db.transaction(MESSAGES_STORE, "readwrite");
			const store = transaction.objectStore(MESSAGES_STORE);
			const index = store.index("conversationId");
			const request = index.openCursor(IDBKeyRange.only(id));

			request.onsuccess = (event) => {
				const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
				if (cursor) {
					cursor.delete();
					cursor.continue();
				}
			};
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, []);

	const saveMessage = useCallback(async (message: DBMessage): Promise<void> => {
		try {
			await performTransaction(MESSAGES_STORE, "readwrite", (store) =>
				store.put(message),
			);
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, []);

	const getMessagesForConversation = useCallback(
		async (conversationId: string): Promise<DBMessage[]> => {
			try {
				const db = await initDB();
				return new Promise((resolve, reject) => {
					const transaction = db.transaction(MESSAGES_STORE, "readonly");
					const store = transaction.objectStore(MESSAGES_STORE);
					const index = store.index("conversationId");
					const request = index.getAll(conversationId);

					request.onsuccess = () => {
						const messages = request.result;
						messages.sort(
							(a, b) =>
								new Date(a.timestamp).getTime() -
								new Date(b.timestamp).getTime(),
						);
						resolve(messages);
					};
					request.onerror = () => reject(request.error);
				});
			} catch (err) {
				setError(err as Error);
				throw err;
			}
		},
		[],
	);

	const deleteMessage = useCallback(async (id: string): Promise<void> => {
		try {
			await performTransaction(MESSAGES_STORE, "readwrite", (store) =>
				store.delete(id),
			);
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, []);

	const clearAllData = useCallback(async (): Promise<void> => {
		try {
			await performTransaction(CONVERSATIONS_STORE, "readwrite", (store) =>
				store.clear(),
			);
			await performTransaction(MESSAGES_STORE, "readwrite", (store) =>
				store.clear(),
			);
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, []);

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
