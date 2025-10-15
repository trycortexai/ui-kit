import { XMarkIcon } from "@heroicons/react/24/solid";
import { createPortal } from "react-dom";
import Button from "../../../../ui/button";
import { useChat } from "../../hooks/use-chat";
import { formatRelativeDate, groupConversationsByDate } from "../../utils/date";

export default function History(): React.ReactNode {
	const { conversations, selectConversation, isHistoryOpen, toggleHistory } =
		useChat();

	if (!isHistoryOpen) return null;

	const groupedConversations = groupConversationsByDate(conversations);

	const categoryOrder = [
		"Today",
		"Yesterday",
		"This Week",
		"This Month",
		"Older",
	];

	const content = (
		<>
			<button
				type="button"
				tabIndex={0}
				className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
				onClick={toggleHistory}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						toggleHistory();
					}
				}}
			/>

			<aside className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 z-50 flex flex-col">
				<div className="flex items-center justify-between h-14 px-4 border-b border-neutral-200 dark:border-neutral-800">
					<h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
						History
					</h2>
					<Button variant="plain" onClick={toggleHistory}>
						<XMarkIcon data-slot="icon" />
					</Button>
				</div>

				<div className="flex-1 overflow-y-auto p-2">
					{categoryOrder.map((category) => {
						const categoryConversations = groupedConversations[category];
						if (!categoryConversations || categoryConversations.length === 0) {
							return null;
						}

						return (
							<div key={category} className="mb-4">
								<h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-500 tracking-wider px-3 py-2">
									{category}
								</h3>
								<div className="space-y-1">
									{categoryConversations.map((conversation) => (
										<button
											type="button"
											key={conversation.id}
											onClick={() => selectConversation(conversation.id)}
											className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
										>
											<p className="truncate font-medium">
												{conversation.title}
											</p>
											<p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
												{formatRelativeDate(conversation.createdAt)}
											</p>
										</button>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</aside>
		</>
	);

	return createPortal(content, document.body);
}
