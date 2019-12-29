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
				<span className="glyphicon glyphicon-question-sign">&nbsp;</span>
				{this.props.title || ''}
			</a>
		);
	}
}
