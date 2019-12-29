import * as React from 'react';

interface PanelProps {
	heading?: React.ReactNode;
	children?: React.ReactNode;
	footer?: React.ReactNode;
}

export class Panel extends React.Component<PanelProps, {}> {
	render() {
		return (
			<div className="panel panel-default">
				{this.props.heading && <div className="panel-heading">{this.props.heading}</div>}
				{this.props.children && <div className="panel-body">{this.props.children}</div>}
				{this.props.footer && <div className="panel-footer">{this.props.footer}</div>}
			</div>
		);
	}
}

interface ButtonProps {
	label: string;
	click: () => void;
}

export class Button extends React.Component<ButtonProps, {}> {
	render() {
		return (
			<span className="btn btn-default" onClick={this.props.click}>
				{this.props.label}
			</span>
		);
	}
}

export class Well extends React.Component<{}, {}> {
	render() {
		return <div className="well">{this.props.children}</div>;
	}
}
