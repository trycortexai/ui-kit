import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { type KeyboardEvent, useState } from "react";
import Button from "../../../ui/button";
import { useChat } from "../hooks/use-chat";

export default function Composer(): React.ReactNode {
	const { sendMessage, isLoading, chatOptions } = useChat();
	const [input, setInput] = useState("");

	const handleSend = async () => {
		if (input.trim() && !isLoading) {
			const message = input.trim();
			setInput("");
			await sendMessage(message);
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
				<div className="flex items-end gap-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full p-2 pl-3">
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={chatOptions?.composer?.placeholder}
						rows={1}
						className="flex-1 bg-transparent border-0 outline-none resize-none px-2 py-1.5 text-sm text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-500 dark:placeholder:text-neutral-500 max-h-32 disabled:opacity-50"
					/>
					<Button
						onClick={handleSend}
						disabled={!input.trim() || isLoading}
						size="sm"
						className="shrink-0"
						radius="full"
					>
						<PaperAirplaneIcon data-slot="icon" />
					</Button>
				</div>
			</div>
		</div>
	);
}
