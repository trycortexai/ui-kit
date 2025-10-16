export function encodeObject<T>(input: T): string {
	return btoa(JSON.stringify(input));
}

export function decodeObject<T>(input: string): T {
	return JSON.parse(atob(input));
}

export function parseOptionsFromHash<T>(): T | null {
	try {
		const hash = window.location.hash.substring(1);

		if (hash) {
			return decodeObject<T>(hash);
		}

		return null;
	} catch {
		return null;
	}
}
