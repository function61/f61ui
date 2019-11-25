import * as React from 'react';

export interface NavLink {
	url: string;
	title: string;
	glyphicon?: string;
	active: boolean;
}

export function renderNavLink(link: NavLink): React.ReactNode {
	const activeOrNot = link.active ? 'active' : '';

	return (
		<li className={activeOrNot} key={link.url}>
			<a href={link.url}>
				{link.glyphicon && (
					<span className={'glyphicon glyphicon-' + link.glyphicon}>&nbsp;</span>
				)}
				{link.title}
			</a>
		</li>
	);
}

interface NavigationProps {
	links: NavLink[];
}

export default class NavigationTabs extends React.Component<NavigationProps, {}> {
	render() {
		return <ul className="nav nav-tabs">{this.props.links.map(renderNavLink)}</ul>;
	}
}
