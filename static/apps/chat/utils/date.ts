export function formatRelativeDate(date: Date): string {
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();
	const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
	const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	if (diffInMinutes < 1) {
		return "Just now";
	}

	if (diffInMinutes < 60) {
		return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
	}

	if (diffInHours < 24) {
		return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
	}

	if (diffInDays === 1) {
		return "Yesterday";
	}

	if (diffInDays < 7) {
		return `${diffInDays} days ago`;
	}

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const month = months[date.getMonth()];
	const day = date.getDate();
	const year = date.getFullYear();
	const currentYear = now.getFullYear();

	if (year === currentYear) {
		return `${month} ${day}`;
	}

	return `${month} ${day}, ${year}`;
}

export function getDateCategory(date: Date): string {
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	const isToday =
		date.getDate() === now.getDate() &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear();

	if (isToday) {
		return "Today";
	}

	const yesterday = new Date(now);
	yesterday.setDate(yesterday.getDate() - 1);
	const isYesterday =
		date.getDate() === yesterday.getDate() &&
		date.getMonth() === yesterday.getMonth() &&
		date.getFullYear() === yesterday.getFullYear();

	if (isYesterday) {
		return "Yesterday";
	}

	if (diffInDays < 7) {
		return "This Week";
	}

	if (diffInDays < 30) {
		return "This Month";
	}

	return "Older";
}

export function groupConversationsByDate<
	T extends { createdAt: Date; id: string },
>(conversations: T[]): Record<string, T[]> {
	const groups: Record<string, T[]> = {
		Today: [],
		Yesterday: [],
		"This Week": [],
		"This Month": [],
		Older: [],
	};

	for (const conversation of conversations) {
		const category = getDateCategory(conversation.createdAt);
		groups[category].push(conversation);
	}

	for (const category of Object.keys(groups)) {
		groups[category].sort(
			(a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
		);
	}

	return groups;
}
