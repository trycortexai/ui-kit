import { type CortexChatOptions, encodeObject } from "@cortex-ai/ui-helpers";

const IFRAME_SRC =
	"https://unpkg.com/@cortex-ai/static@latest/dist/chat/index.html";

export class CortexChat extends HTMLElement {
	public options: CortexChatOptions;

	constructor() {
		super();

		this.attachShadow({ mode: "open" });
		this.options = {};
	}

	connectedCallback(): void {
		this.render();
	}

	getResolvedOptions(): CortexChatOptions {
		const colorScheme = this.getAttribute("theme") || "light";
		const title = this.getAttribute("title") || "Chat";
		const accentColor = this.getAttribute("accent-color") || "blue";
		const neutralColor = this.getAttribute("neutral-color") || "zinc";

		return {
			colorScheme,
			title,
			accentColor,
			neutralColor,
		};
	}

	getIframeUrl() {
		const clientKey = this.getAttribute("client-key");

		const config = {
			clientKey,
			options: this.getResolvedOptions(),
		};

		return `${IFRAME_SRC}#${encodeObject(config)}`;
	}

	render(): void {
		const iframeUrl = this.getIframeUrl();

		if (!this.shadowRoot) {
			return;
		}

		this.shadowRoot.innerHTML = `
      <iframe src="${iframeUrl}"></iframe>
    `;
	}
}

customElements.define("cortex-chat", CortexChat);
