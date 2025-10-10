import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { type KeyboardEvent, useState } from "react";
import Button from "../../../../ui/button";
import { useChat } from "../../hooks/use-chat";

export default function Composer(): React.ReactNode {
	const { sendMessage } = useChat();
	const [input, setInput] = useState("");

	const handleSend = () => {
		if (input.trim()) {
			sendMessage(input.trim());
			setInput("");
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
			<div className="max-w-3xl mx-auto px-4 py-4">
				<div className="flex items-end gap-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-2">
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Type a message..."
						rows={1}
						className="flex-1 bg-transparent border-0 outline-none resize-none px-2 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-500 max-h-32"
					/>
					<Button
						onClick={handleSend}
						disabled={!input.trim()}
						size="sm"
						className="shrink-0"
					>
						<PaperAirplaneIcon data-slot="icon" />
					</Button>
				</div>
			</div>
		</div>
	);
}
