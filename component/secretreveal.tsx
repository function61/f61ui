import EyeFill from 'bootstrap-icons/icons/eye-fill.svg';
import EyeSlashFill from 'bootstrap-icons/icons/eye-slash-fill.svg';
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
		// it looks stupid if we show the password mask in UI and after clicking the "show password" there ain't anything there.
		if (this.props.secret.length === 0) {
			return <span />;
		}

		const secretVisibleOrNot = this.state.visible ? this.props.secret : '********';

		return (
			<span>
				{secretVisibleOrNot}
				<span
					className="hovericon margin-left"
					onClick={() => {
						this.setState({ visible: !this.state.visible });
					}}>
					{this.state.visible ? <EyeSlashFill /> : <EyeFill />}
				</span>
				{!this.props.noAutomaticClipboard && (
					<span className="margin-left">
						<ClipboardButton text={this.props.secret} />
					</span>
				)}
			</span>
		);
	}
}
