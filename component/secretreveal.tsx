import { Glyphicon } from 'f61ui/component/bootstrap';
import { ClipboardButton } from 'f61ui/component/clipboardbutton';
import * as React from 'react';

interface SecretRevealProps {
	secret: string;
	noAutomaticClipboard?: boolean;
}

interface SecretRevealState {
	visible: boolean;
}

export class SecretReveal extends React.Component<SecretRevealProps, SecretRevealState> {
	state = { visible: false };

	render() {
		const secretVisibleOrNot = this.state.visible ? this.props.secret : '********';

		const icon = this.state.visible ? 'eye-close' : 'eye-open';

		return (
			<span>
				{secretVisibleOrNot}
				<span
					className="hovericon margin-left"
					onClick={() => {
						this.setState({ visible: !this.state.visible });
					}}>
					<Glyphicon icon={icon} />
				</span>
				{!this.props.noAutomaticClipboard && <ClipboardButton text={this.props.secret} />}
			</span>
		);
	}
}
