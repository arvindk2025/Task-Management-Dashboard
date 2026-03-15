export function kebabToTitleCase(input: string): string {
	return input
		.split('-')
		.map(
			(word) =>
				word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
		)
		.join(' ');
}

export function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}
