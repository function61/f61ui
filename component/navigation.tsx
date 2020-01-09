import { Glyphicon, GlyphiconIcon } from 'f61ui/component/bootstrap';
import * as React from 'react';

export interface NavLink {
	url: string;
	title: string;
	glyphicon?: GlyphiconIcon;
	active: boolean;
}

export function renderNavLink(link: NavLink): React.ReactNode {
	const activeOrNot = link.active ? 'active' : '';

	return (
		<li className={activeOrNot} key={link.url}>
			<a href={link.url}>
				{link.glyphicon && <Glyphicon icon={link.glyphicon} />}
				&nbsp;
				<span className={link.glyphicon ? 'margin-left' : ''}>{link.title}</span>
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
