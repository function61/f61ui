// why these abstractions? it's not pretty putting these non-null asserts everywhere,
// and whether we should use document.location or window.location
// (or document.location.assign or document.location.href) is not something we want to
// repeat all around.

// returns location in in-app format (= relative URL)
export function getCurrentLocation(): string {
	const loc = document.location!;

	return loc.pathname + loc.search;
}

// supports "#foo" (bare hash)
// supports "/path" (relative)
// supports "http://example.com/path" (absolute)
export function navigateTo(to: string): void {
	// AppController will have to handle this, because if it's an in-app navigation, there
	// are special things to do
	window.dispatchEvent(new CustomEvent('f61navigate', { detail: to }));
}

export function reloadCurrentPage(): void {
	navigateTo(getCurrentLocation());
}

export class LocalStorageItem {
	private key: string;

	constructor(key: string) {
		this.key = key;
	}

	get(): string | null {
		return localStorage.getItem(this.key);
	}

	set(value: string) {
		localStorage.setItem(this.key, value);
	}

	remove() {
		localStorage.removeItem(this.key);
	}
}
