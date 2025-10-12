export function encodeObject<T>(input: T): string {
	return btoa(JSON.stringify(input));
}

export function decodeObject<T>(input: string): T {
	return JSON.parse(atob(input));
}
