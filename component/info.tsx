import { Glyphicon } from 'f61ui/component/bootstrap';
import * as React from 'react';

interface InfoProps {
	text: string;
}

export class Info extends React.Component<InfoProps, {}> {
	render() {
		return <Glyphicon icon="info-sign" title={this.props.text} />;
	}
}
