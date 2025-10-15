import Composer from "./components/composer";
import Header from "./components/header";
import History from "./components/history";
import Messages from "./components/messages";

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
