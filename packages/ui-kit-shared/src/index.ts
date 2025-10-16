export const UI_KIT_DEV_SERVER_PORT = 3001;

export const UI_KIT_API_URL: string =
	process.env.NODE_ENV === "development"
		? `http://localhost:${UI_KIT_DEV_SERVER_PORT}`
		: "https://onrender.com";

export const UI_KIT_SCRIPT_URL =
	"https://unpkg.com/@cortex-ai/ui-kit@latest/dist/index.js";
