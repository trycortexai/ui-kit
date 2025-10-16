"use client";

import "../../styles/index.css";

import type { CortexChatSerializableOptions } from "@cortex-ai/ui-kit-shared/chat";
import { parseOptionsFromHash } from "@cortex-ai/ui-kit-shared/common";
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

function setGlobalStyleClasses() {
	const html = document.documentElement;

	const options = parseOptionsFromHash<CortexChatSerializableOptions>();

	if (!options) return;

	if (options.theme?.colorScheme) {
		html.classList.add(options.theme.colorScheme);
	}

	if (options.theme?.accentColor) {
		html.classList.add(`accent-${options.theme.accentColor}`);
	}

	if (options.theme?.neutralColor) {
		html.classList.add(`neutral-${options.theme.neutralColor}`);
	}
}

document.addEventListener("DOMContentLoaded", setGlobalStyleClasses);
