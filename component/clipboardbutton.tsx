import { elToClipboard } from 'f61ui/clipboard';
import { TextFadeOutAnimation } from 'f61ui/component/animations';
import * as React from 'react';

interface ClipboardButtonProps {
	text: string;
}

interface ClipboardButtonState {
	animation?: React.ReactNode;
}

export class ClipboardButton extends React.Component<ClipboardButtonProps, ClipboardButtonState> {
	state: ClipboardButtonState = {};

	render() {
		return (
			<div>
				<span
					data-to-clipboard={this.props.text}
					onClick={(e) => {
						elToClipboard(e);

						this.setState({
							animation: TextFadeOutAnimation.make(
								'Copied',
								e.nativeEvent.target as HTMLElement | null,
							),
						});
					}}
					className="fauxlink margin-left">
					📋
				</span>
				{this.state.animation}
			</div>
		);
	}
}
