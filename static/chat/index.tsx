import "./styles.css";

import ReactDOM from "react-dom/client";

function Chat(): React.ReactNode {
	return (
		<div className="chat">
			<div className="chat-header">
				<h2 className="text-red-500">Chat</h2>
			</div>
			<div className="chat-body">
				<div className="chat-message">
					<p>Hello!</p>
				</div>
			</div>
			<div className="chat-footer">
				<input type="text" placeholder="Type a message..." />
			</div>
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Chat />);
