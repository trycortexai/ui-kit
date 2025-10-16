"use client";

import "../../styles/index.css";

import { BridgeClient } from "@cortex-ai/ui-kit-shared/bridge/client";
import type { CortexChatOptions } from "@cortex-ai/ui-kit-shared/chat";
import ReactDOM from "react-dom/client";
import ChatInterface from "./chat-interface";
import { ChatProvider } from "./hooks/use-chat";

function Chat(): React.ReactNode {
	return (
		<ChatProvider>
			<ChatInterface />
		</ChatProvider>
	);
}

const elem = document.getElementById("root");

if (elem) {
	const root = ReactDOM.createRoot(elem);
	root.render(<Chat />);
}

async function setGlobalStyleClasses() {
	try {
		const bridgeClient = new BridgeClient<CortexChatOptions>();
		const options = await bridgeClient.getOptions();
		bridgeClient.destroy();

		const html = document.documentElement;

		if (options.theme?.colorScheme) {
			html.classList.add(options.theme.colorScheme);
		}

		if (options.theme?.accentColor) {
			html.classList.add(`accent-${options.theme.accentColor}`);
		}

		if (options.theme?.neutralColor) {
			html.classList.add(`neutral-${options.theme.neutralColor}`);
		}
	} catch (error) {
		console.error("Failed to load theme from bridge:", error);
	}
}

document.addEventListener("DOMContentLoaded", setGlobalStyleClasses);
