import * as React from 'react';

export class Loading extends React.Component<{}, {}> {
	render() {
		return (
			<div className="spinner-border" role="status">
				<span className="visually-hidden">Loading...</span>
			</div>
		);
	}
}
