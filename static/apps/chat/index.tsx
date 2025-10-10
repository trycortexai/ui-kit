import "../../styles/index.css";

import ReactDOM from "react-dom/client";
import Composer from "./components/composer/composer";
import Header from "./components/header/header";
import Messages from "./components/messages/messages";

function Chat(): React.ReactNode {
	return (
		<div className="w-full h-screen bg-neutral-100 dark:bg-neutral-900">
			<div className="max-w-6xl mx-auto size-full">
				<Header />
				<Messages />
				<Composer />
			</div>
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Chat />);
