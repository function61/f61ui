import { Breadcrumb, BreadcrumbTrail } from 'f61ui/component/breadcrumbtrail';
import NavigationTabs, { NavLink } from 'f61ui/component/navigation';
import * as React from 'react';

interface DefaultLayoutProps {
	pageTitle: string;
	version: string;
	appName: string;
	appHomepage: string;
	logoClickUrl: string;
	logoNode: React.ReactNode;
	navLinks: NavLink[];
	breadcrumbs: Breadcrumb[];
	content: React.ReactNode;
	searchWidget?: React.ReactNode;
}

export class DefaultLayout extends React.Component<DefaultLayoutProps, {}> {
	render() {
		document.title = `${this.props.pageTitle} - ${this.props.appName}`;

		return (
			<div>
				<div className="header clearfix">
					<div className="float-start">
						<h3 className="app-logo text-muted">
							<a href={this.props.logoClickUrl}>
								{this.props.logoNode || this.props.appName}
							</a>
						</h3>
					</div>

					{this.props.searchWidget ? (
						<div className="float-start" style={{ padding: '18px 0 0 20px' }}>
							{this.props.searchWidget}{' '}
						</div>
					) : null}

					<nav className="float-end">
						<NavigationTabs links={this.props.navLinks} />
					</nav>
				</div>

				<BreadcrumbTrail items={this.props.breadcrumbs} />

				{this.props.content}

				<div className="card mt-3" style={{ marginTop: '16px' }}>
					<div className="card-body text-body-tertiary">
						<div className="float-start">
							<a href={this.props.appHomepage} target="_blank" className="text-reset">
								{this.props.appName}
							</a>
							&nbsp;{this.props.version}&nbsp;by{' '}
							<a
								href="https://function61.com/"
								target="_blank"
								className="text-reset">
								function61.com
							</a>
						</div>
						<div className="float-end">{this.enjoyYourDayGreeting()}</div>
					</div>
				</div>
			</div>
		);
	}

	// the world deserves a bit more light
	private enjoyYourDayGreeting() {
		const dayOfWeek = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday, and have a nice weekend',
			'Saturday',
		][new Date().getDay()];

		return (
			<span>
				<a href="https://function61.com/happy" target="_blank" className="text-reset">
					Enjoy
				</a>{' '}
				your {dayOfWeek}! :)
			</span>
		);
	}
}
