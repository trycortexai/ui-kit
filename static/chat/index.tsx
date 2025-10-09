import "../styles/index.css";

import ReactDOM from "react-dom/client";
import Button from "../ui/button";

function Chat(): React.ReactNode {
	return (
		<div className="w-full h-screen">
			<div className="max-w-6xl mx-auto h-full flex flex-col items-center justify-center">
				<Button variant="solid" color="primary" className="w-fit">
					Hello World!
				</Button>
			</div>
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Chat />);
