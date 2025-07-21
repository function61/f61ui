import { uniqueDomId } from 'f61ui/utils';
import * as React from 'react';

interface TextFadeOutAnimationProps {
	label: string;
	offsetLeft: number;
	offsetTop: number;
}

export class TextFadeOutAnimation extends React.Component<TextFadeOutAnimationProps, {}> {
	static make(label: string, el: HTMLElement | null): React.ReactNode {
		if (!el) {
			return null;
		}

		const bounds = el.getBoundingClientRect();

		// uniqueDomId to force us to unmount/mount each time make() is called. this is due
		// to stateful animations. each trigger (maybe click) should start animation from over.
		return (
			<TextFadeOutAnimation
				key={uniqueDomId()}
				label={label}
				offsetLeft={bounds.x}
				offsetTop={bounds.y}
			/>
		);
	}

	render() {
		return (
			<div
				className="textFadeOutAnimation"
				style={{
					left: this.props.offsetLeft + 'px',
					top: this.props.offsetTop + 'px',
				}}>
				<span>{this.props.label}</span>
			</div>
		);
	}
}
