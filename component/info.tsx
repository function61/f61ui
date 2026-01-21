import InfoCircleFill from 'bootstrap-icons/icons/info-circle-fill.svg';
import * as React from 'react';

interface InfoProps {
	text: string;
}

export class Info extends React.Component<InfoProps, {}> {
	render() {
		return (
			<span title={this.props.text}>
				<InfoCircleFill />
			</span>
		);
	}
}
