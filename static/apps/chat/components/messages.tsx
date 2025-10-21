import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { useChat } from "../hooks/use-chat";
import Greeting from "./greeting";

export default function Messages(): React.ReactNode {
	const { currentMessages, isLoading } = useChat();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (currentMessages.length < 3) return;
		if (messagesEndRef.current && scrollContainerRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [currentMessages.length]);

	if (currentMessages.length === 0) {
		return <Greeting />;
	}

	return (
		<div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
			<div className="max-w-3xl mx-auto px-4 py-8 pb-[14%] space-y-6">
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
									? "max-w-[80%] bg-primary-500 text-white rounded-full px-3.5 py-2"
									: "max-w-[80%]"
							}
						>
							{message.role === "assistant" ? (
								<article className="prose neutral-zinc:prose-zinc neutral-stone:prose-stone neutral-gray:prose-gray dark:prose-invert! prose-sm max-w-none prose-pre:bg-neutral-100 dark:prose-pre:bg-neutral-900 prose-pre:text-neutral-900 dark:prose-pre:text-neutral-100">
									<Markdown>{message.content}</Markdown>
								</article>
							) : (
								<p className="text-sm leading-relaxed">{message.content}</p>
							)}
						</div>
					</div>
				))}
				{isLoading && (
					<div className="flex justify-start w-full">
						<div className="size-3 bg-neutral-900 dark:bg-white rounded-full animate-pulse" />
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>
		</div>
	);
}
