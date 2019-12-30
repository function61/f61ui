import { Glyphicon } from 'f61ui/component/bootstrap';
import * as React from 'react';

interface DocsLinkProps {
	url: string;
	title?: string;
}

export class DocsLink extends React.Component<DocsLinkProps, {}> {
	render() {
		return (
			<a
				href={this.props.url}
				title={this.props.title || 'View documentation'}
				target="_blank">
				<Glyphicon icon="question-sign" />
				{this.props.title || ''}
			</a>
		);
	}
}
