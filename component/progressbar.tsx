import * as React from 'react';

type colourType = 'info' | 'success' | 'warning' | 'danger';

interface ProgressBarProps {
	progress: number; // 0-100 [%]
	colour?: colourType;
}

export class ProgressBar extends React.Component<ProgressBarProps, {}> {
	render() {
		const pct = Math.round(this.props.progress) + '%';

		const colour: colourType = this.props.colour || 'info';

		return (
			<div className="progress" title={pct}>
				<div
					className={`progress-bar progress-bar-${colour} progress-bar-striped`}
					style={{ width: pct }}
				/>
			</div>
		);
	}
}
