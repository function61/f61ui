import { jsxChildType } from 'f61ui/types';
import * as React from 'react';

interface PanelProps {
	heading?: jsxChildType;
	children: jsxChildType;
	footer?: jsxChildType;
}

export class Panel extends React.Component<PanelProps, {}> {
	render() {
		return (
			<div className="panel panel-default">
				{this.props.heading ? (
					<div className="panel-heading">{this.props.heading}</div>
				) : (
					''
				)}
				<div className="panel-body">{this.props.children}</div>
				{this.props.footer ? <div className="panel-footer">{this.props.footer}</div> : ''}
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
