import { Bars3Icon, PencilSquareIcon } from "@heroicons/react/24/solid";
import Button from "../../../ui/button";
import { useChat } from "../hooks/use-chat";

export default function Header(): React.ReactNode {
	const { currentConversationId, createNewChat, toggleHistory } = useChat();

	return (
		<header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
			<div className="flex items-center justify-between h-14 px-4">
				<Button variant="plain" onClick={toggleHistory} className="shrink-0">
					<Bars3Icon data-slot="icon" />
				</Button>

				{currentConversationId && (
					<Button variant="plain" onClick={createNewChat} className="shrink-0">
						<PencilSquareIcon data-slot="icon" />
					</Button>
				)}
			</div>
		</header>
	);
}
