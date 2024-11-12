const timezoneOffset = (new Date()).getTimezoneOffset() * 60 * 1000;

export function tsToIndex(ts: number) {
	return 2147483647 + Math.round((ts - timezoneOffset) / 86_400_000);
}

export function indexToTs(index: number) {
	return ((index - 2147483647) * 86_400_000) + timezoneOffset;
}
