import * as React from 'react';

export interface NavLink {
	url: string;
	title: string;
	icon?: React.ReactNode;
	active: boolean;
}

export function renderNavLink(link: NavLink): React.ReactNode {
	const activeOrNot = link.active ? 'active nav-underline' : '';

	return (
		<li className={'nav-item'} key={link.url}>
			<a className={'nav-link ' + activeOrNot} href={link.url}>
				{link.icon && link.icon}
				&nbsp;
				<span className={link.icon ? 'margin-left' : ''}>{link.title}</span>
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
