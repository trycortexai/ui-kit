import { useChat } from "../../hooks/use-chat";
import Greeting from "../greeting/greeting";

export default function Messages(): React.ReactNode {
	const { currentMessages } = useChat();

	if (currentMessages.length === 0) {
		return <Greeting />;
	}

	return (
		<div className="flex-1 overflow-y-auto">
			<div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
				{currentMessages.map((message, index) => (
					<div
						key={index}
						className={
							message.role === "user"
								? "flex justify-end"
								: "flex justify-start"
						}
					>
						<div
							className={
								message.role === "user"
									? "max-w-[80%] bg-primary-500 text-white rounded-2xl px-4 py-3"
									: "max-w-[80%]"
							}
						>
							<p
								className={
									message.role === "assistant"
										? "text-neutral-900 dark:text-neutral-100 text-sm leading-relaxed"
										: "text-sm leading-relaxed"
								}
							>
								{message.content}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
