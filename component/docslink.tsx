import QuestionCircleFill from 'bootstrap-icons/icons/question-circle-fill.svg';
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
				<QuestionCircleFill />
				{this.props.title ? ' ' + this.props.title : ''}
			</a>
		);
	}
}
