import 'bootstrap'; // side effect import, cool stuff guys
import { getCurrentLocation } from 'f61ui/browserutils';
import { GlobalConfig, globalConfigure } from 'f61ui/globalconfig';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface Router {
	handle: (relativeUrl: string) => JSX.Element;
	hasRouteFor: (relativeUrl: string) => boolean;
}

export function makeRouter(
	hasRouteFor: (relativeUrl: string) => boolean,
	handle: (relativeUrl: string) => JSX.Element,
): Router {
	return {
		handle,
		hasRouteFor,
	};
}

// entrypoint for the app. this is called when DOM is loaded
export function boot(appElement: HTMLElement, globalConfig: GlobalConfig, router: Router): void {
	globalConfigure(globalConfig);

	ReactDOM.render(<AppController router={router} />, appElement);
}

interface AppControllerProps {
	router: Router;
}

export interface AppControllerState {
	relativeUrl: string;
}

export class AppController extends React.Component<AppControllerProps, AppControllerState> {
	state: AppControllerState = { relativeUrl: getCurrentLocation() };

	constructor(props: AppControllerProps) {
		super(props);

		// can't do these in componentDidMount() because router's rendered content would
		// already have been rendered (via our render()) which in some cases emit "f61navigate"
		// events which we wouldn't catch
		window.addEventListener('f61navigate', this.f61navigate);
		window.addEventListener('popstate', this.popstate);
		window.addEventListener('click', this.windowClick);
	}

	render() {
		// handles 404s internally
		return this.props.router.handle(this.state.relativeUrl);
	}

	componentWillUnmount() {
		window.removeEventListener('f61navigate', this.f61navigate);
		window.removeEventListener('popstate', this.popstate);
		window.removeEventListener('click', this.windowClick);
	}

	// browserutils.{navigateTo, reloadCurrentPage} emit this event for us to implement
	// because it is somewhat complicated to implement
	private f61navigate = (e: Event) => {
		if (!isCustomEvent(e)) {
			return;
		}

		// could be just the hash, relative URL or absolute URL
		const to = e.detail;

		// needed to resolve partial URLs (hash, relative) to absolute
		const loc = document.location!;

		if (this.isInAppUrl(to, loc)) {
			this.navigateInApp(to);
		} else {
			loc.assign(to);
		}
	};

	// this is called on back/forward events
	//
	// need to create create bound proxy, because this object function
	// ref (bound one) must be used for removeEventListener()
	private popstate = () => {
		this.setState({ relativeUrl: getCurrentLocation() });
	};

	// catch *all* clicks, filter to <a>'s that navigate within our routes and do so without
	// full-page navigation dance
	private windowClick = (e: MouseEvent) => {
		// we always get absolute URLs from <a href=..>
		const absoluteUrl = clickedAnchorHrefWithoutTarget(e);

		// event not match or is not app-internal navigation
		// => do not intervene
		if (!absoluteUrl || !this.isInAppUrl(absoluteUrl, document.location!)) {
			return;
		}

		// cancel browser's internal navigation - we'll handle navigation chores ourselves
		e.preventDefault();

		this.navigateInApp(absoluteUrl);
	};

	private navigateInApp(to: string) {
		// replace document's URL without doing full page navigation
		history.pushState(null, '', to);

		// notify logic to re-render
		this.setState({ relativeUrl: getCurrentLocation() });
	}

	// given url and a reference (used to resolve partial URLs into absolute), tells if this
	// is an in-app URL which we can render without full page navigation
	private isInAppUrl(url: string, reference: Location): boolean {
		// hash => relative
		const atLeastRelative = hasPrefix(url, '#')
			? reference.pathname + reference.search + url // make relative
			: url; // was at least relative

		// relative => absolute
		const absolute = hasPrefix(atLeastRelative, '/')
			? reference.origin + atLeastRelative // make absolute
			: atLeastRelative; // was absolute

		if (!hasPrefix(absolute, self.origin)) {
			return false;
		}

		// now make relative. I know this seems funny b/c we just went through effort to
		// make it absolute, but we needed that because
		const relative = absolute.substr(self.origin.length);

		return this.props.router.hasRouteFor(relative);
	}
}

function clickedAnchorHrefWithoutTarget(e: MouseEvent): string | null {
	if (!e.target || !(e.target instanceof HTMLElement)) {
		return null;
	}

	const anchor = findParent('A', e.target) as HTMLAnchorElement | null;
	if (!anchor) {
		return null;
	}

	// wants to open new tab? (or some other explicit target)
	if (anchor.target !== '') {
		return null;
	}

	return anchor.href;
}

function findParent(tagName: string, el: HTMLElement): HTMLElement | null {
	let curr: HTMLElement | null = el;
	do {
		if (curr.tagName === tagName) {
			return curr;
		}

		curr = curr.parentElement;
	} while (curr);

	return null;
}

function hasPrefix(input: string, prefix: string): boolean {
	return input.substr(0, prefix.length) === prefix;
}

// to keep TypeScript happy: https://stackoverflow.com/q/47166369
function isCustomEvent(event: Event): event is CustomEvent {
	return 'detail' in event;
}
