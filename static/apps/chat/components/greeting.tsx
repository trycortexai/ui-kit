import { useChat } from "../hooks/use-chat";

export default function Greeting(): React.ReactNode {
	const { chatOptions, sendMessage } = useChat();

	const greeting = chatOptions?.startScreen?.greeting;
	const suggestedMessages = chatOptions?.startScreen?.suggestedMessages;

	return (
		<div className="flex flex-col items-center justify-center h-full px-4">
			<div className="max-w-2xl w-full space-y-8">
				<h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 text-center">
					{greeting}
				</h1>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{suggestedMessages?.map((message, index) => (
						<button
							type="button"
							key={index}
							onClick={() => sendMessage(message.prompt)}
							className="p-4 text-left text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
						>
							{message.label}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
