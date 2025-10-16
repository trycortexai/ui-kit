export const UI_KIT_DEV_SERVER_PORT = 3001;

export const UI_KIT_API_URL: string =
	process.env.NODE_ENV === "development"
		? `http://localhost:${UI_KIT_DEV_SERVER_PORT}`
		: "https://onrender.com";

export const UI_KIT_SCRIPT_URL =
	"https://unpkg.com/@cortex-ai/ui-kit@latest/dist/index.js";

export type CortexUIKitOptions = {
	/**
	 * API configuration options
	 */
	api: CortexUIKitAPIOptions;
};

/**
 * API configuration options for Cortex UI Kit
 */
export type CortexUIKitAPIOptions = {
	/**
	 * Function to retrieve or refresh the client secret for authentication
	 * @returns A promise that resolves to the client secret string
	 * @example
	 * async getClientSecret() {
	 *   const res = await fetch('/api/session', {
	 *     method: 'POST',
	 *     body: JSON.stringify({ currentClientSecret }),
	 *     headers: { 'Content-Type': 'application/json' }
	 *   });
	 *   const { client_secret } = await res.json();
	 *   return client_secret;
	 * }
	 */
	getClientSecret: () => Promise<string>;
};
