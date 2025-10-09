import { PropsWithChildren } from "react";

export default function Button({ children }: PropsWithChildren): React.ReactNode {
	return (
		<button className="text-gray-500 hover:text-gray-700">{children}</button>
	);
}
