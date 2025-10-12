"use client";

import "../../styles/index.css";

import { type CortexChatConfig, decodeObject } from "@cortex-ai/ui-helpers";
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

function applyConfigFromHash() {
	const hash = window.location.hash.substring(1);

	if (hash) {
		try {
			const config = decodeObject<CortexChatConfig>(hash);
			applyConfiguration(config);
		} catch (error) {
			console.warn("Failed to parse configuration:", error);
		}
	}
}

function applyConfiguration(config: CortexChatConfig) {
	const html = document.documentElement;

	if (config.options.colorScheme) {
		html.classList.add(config.options.colorScheme);
	}

	if (config.options.accentColor) {
		html.classList.add(`accent-${config.options.accentColor}`);
	}

	if (config.options.neutralColor) {
		html.classList.add(`neutral-${config.options.neutralColor}`);
	}

	window.CHAT_CONFIG = config;
}

document.addEventListener("DOMContentLoaded", applyConfigFromHash);
