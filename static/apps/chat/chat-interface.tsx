import Composer from "./components/composer/composer";
import Header from "./components/header/header";
import History from "./components/history/history";
import Messages from "./components/messages/messages";

export default function ChatInterface() {
	return (
		<div className="w-full h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col">
			<History />
			<div className="flex-1 flex flex-col min-h-0">
				<Header />
				<Messages />
				<Composer />
			</div>
		</div>
	);
}
