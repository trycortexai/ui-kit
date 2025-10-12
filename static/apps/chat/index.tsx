"use client";

import "../../styles/index.css";

import {
	type CortexChatConfig,
	parseConfigFromHash,
} from "@cortex-ai/ui-helpers";
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
	const config = parseConfigFromHash<CortexChatConfig>();

	if (config) {
		applyConfiguration(config);
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
}

document.addEventListener("DOMContentLoaded", applyConfigFromHash);
