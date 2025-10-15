import { useCallback, useEffect, useState } from "react";

export interface IndexedDBConfig {
	dbName: string;
	version: number;
	stores: {
		name: string;
		keyPath: string;
		indexes?: {
			name: string;
			keyPath: string | string[];
			unique?: boolean;
		}[];
	}[];
}

export function useIndexedDB(config: IndexedDBConfig) {
	const [isReady, setIsReady] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [db, setDb] = useState<IDBDatabase | null>(null);

	const initDB = useCallback((): Promise<IDBDatabase> => {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(config.dbName, config.version);

			request.onerror = () => {
				reject(request.error);
			};

			request.onsuccess = () => {
				const database = request.result;

				const missingStores = config.stores.some(
					(store) => !database.objectStoreNames.contains(store.name),
				);

				if (missingStores) {
					database.close();
					indexedDB.deleteDatabase(config.dbName);
					setTimeout(() => {
						initDB().then(resolve).catch(reject);
					}, 100);
					return;
				}

				resolve(database);
			};

			request.onupgradeneeded = (event) => {
				const database = (event.target as IDBOpenDBRequest).result;

				config.stores.forEach((storeConfig) => {
					if (database.objectStoreNames.contains(storeConfig.name)) {
						database.deleteObjectStore(storeConfig.name);
					}

					const store = database.createObjectStore(storeConfig.name, {
						keyPath: storeConfig.keyPath,
					});

					if (storeConfig.indexes) {
						storeConfig.indexes.forEach((index) => {
							store.createIndex(index.name, index.keyPath, {
								unique: index.unique ?? false,
							});
						});
					}
				});
			};
		});
	}, [config]);

	useEffect(() => {
		initDB()
			.then((database) => {
				setDb(database);
				setIsReady(true);
			})
			.catch((err) => setError(err));

		return () => {
			db?.close();
		};
	}, [initDB, db?.close]);

	const performTransaction = useCallback(
		async <T,>(
			storeName: string,
			mode: IDBTransactionMode,
			callback: (store: IDBObjectStore) => IDBRequest<T>,
		): Promise<T> => {
			const database = db || (await initDB());
			return new Promise((resolve, reject) => {
				try {
					const transaction = database.transaction(storeName, mode);
					const store = transaction.objectStore(storeName);
					const request = callback(store);

					request.onsuccess = () => resolve(request.result);
					request.onerror = () => reject(request.error);
					transaction.onerror = () => reject(transaction.error);
				} catch (error) {
					reject(error);
				}
			});
		},
		[db, initDB],
	);

	const add = useCallback(
		async <T,>(storeName: string, item: T): Promise<IDBValidKey> => {
			try {
				return await performTransaction(storeName, "readwrite", (store) =>
					store.add(item),
				);
			} catch (err) {
				setError(err as Error);
				throw err;
			}
		},
		[performTransaction],
	);

	const put = useCallback(
		async <T,>(storeName: string, item: T): Promise<IDBValidKey> => {
			try {
				return await performTransaction(storeName, "readwrite", (store) =>
					store.put(item),
				);
			} catch (err) {
				setError(err as Error);
				throw err;
			}
		},
		[performTransaction],
	);

	const get = useCallback(
		async <T,>(storeName: string, key: IDBValidKey): Promise<T | undefined> => {
			try {
				return await performTransaction(storeName, "readonly", (store) =>
					store.get(key),
				);
			} catch (err) {
				setError(err as Error);
				throw err;
			}
		},
		[performTransaction],
	);

	const getAll = useCallback(
		async <T,>(storeName: string): Promise<T[]> => {
			try {
				return await performTransaction(storeName, "readonly", (store) =>
					store.getAll(),
				);
			} catch (err) {
				setError(err as Error);
				throw err;
			}
		},
		[performTransaction],
	);

	const getAllByIndex = useCallback(
		async <T,>(
			storeName: string,
			indexName: string,
			query?: IDBValidKey | IDBKeyRange,
		): Promise<T[]> => {
			try {
				const database = db || (await initDB());
				return new Promise((resolve, reject) => {
					const transaction = database.transaction(storeName, "readonly");
					const store = transaction.objectStore(storeName);
					const index = store.index(indexName);
					const request = query ? index.getAll(query) : index.getAll();

					request.onsuccess = () => resolve(request.result);
					request.onerror = () => reject(request.error);
				});
			} catch (err) {
				setError(err as Error);
				throw err;
			}
		},
		[db, initDB],
	);

	const deleteItem = useCallback(
		async (storeName: string, key: IDBValidKey): Promise<void> => {
			try {
				await performTransaction(storeName, "readwrite", (store) =>
					store.delete(key),
				);
			} catch (err) {
				setError(err as Error);
				throw err;
			}
		},
		[performTransaction],
	);

	const deleteByIndex = useCallback(
		async (
			storeName: string,
			indexName: string,
			query: IDBValidKey | IDBKeyRange,
		): Promise<void> => {
			try {
				const database = db || (await initDB());
				const transaction = database.transaction(storeName, "readwrite");
				const store = transaction.objectStore(storeName);
				const index = store.index(indexName);
				const request = index.openCursor(query);

				return new Promise((resolve, reject) => {
					request.onsuccess = (event) => {
						const cursor = (event.target as IDBRequest<IDBCursorWithValue>)
							.result;
						if (cursor) {
							cursor.delete();
							cursor.continue();
						} else {
							resolve();
						}
					};
					request.onerror = () => reject(request.error);
				});
			} catch (err) {
				setError(err as Error);
				throw err;
			}
		},
		[db, initDB],
	);

	const clear = useCallback(
		async (storeName: string): Promise<void> => {
			try {
				await performTransaction(storeName, "readwrite", (store) =>
					store.clear(),
				);
			} catch (err) {
				setError(err as Error);
				throw err;
			}
		},
		[performTransaction],
	);

	const clearAll = useCallback(async (): Promise<void> => {
		try {
			await Promise.all(
				config.stores.map((store) =>
					performTransaction(store.name, "readwrite", (objectStore) =>
						objectStore.clear(),
					),
				),
			);
		} catch (err) {
			setError(err as Error);
			throw err;
		}
	}, [config.stores, performTransaction]);

	return {
		isReady,
		error,
		db,
		add,
		put,
		get,
		getAll,
		getAllByIndex,
		deleteItem,
		deleteByIndex,
		clear,
		clearAll,
	};
}
