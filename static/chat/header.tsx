export default function Header(): React.ReactNode {
	return (
		<div className="flex items-center justify-between px-4 py-2">
			<h1 className="text-xl font-bold">Chat</h1>
			<button type="button">Settings</button>
		</div>
	);
}
