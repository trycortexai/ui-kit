import "../../styles/index.css";

import ReactDOM from "react-dom/client";
import Composer from "./components/composer/composer";
import Header from "./components/header/header";
import History from "./components/history/history";
import Messages from "./components/messages/messages";
import { ChatProvider } from "./hooks/use-chat";

function Chat(): React.ReactNode {
	return (
		<ChatProvider>
			<div className="w-full h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col">
				<History />
				<div className="flex-1 flex flex-col min-h-0">
					<Header />
					<Messages />
					<Composer />
				</div>
			</div>
		</ChatProvider>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Chat />);
