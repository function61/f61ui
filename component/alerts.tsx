import { jsxChildType } from 'f61ui/types';
import * as React from 'react';

interface AlertCommonProps {
	children: jsxChildType;
}

export class WarningAlert extends React.Component<AlertCommonProps, {}> {
	render() {
		return (
			<div className="alert alert-warning" role="alert">
				{this.props.children}
			</div>
		);
	}
}

export class InfoAlert extends React.Component<AlertCommonProps, {}> {
	render() {
		return (
			<div className="alert alert-info" role="alert">
				{this.props.children}
			</div>
		);
	}
}

export class SuccessAlert extends React.Component<AlertCommonProps, {}> {
	render() {
		return (
			<div className="alert alert-success" role="alert">
				{this.props.children}
			</div>
		);
	}
}

export class DangerAlert extends React.Component<AlertCommonProps, {}> {
	render() {
		return (
			<div className="alert alert-danger" role="alert">
				{this.props.children}
			</div>
		);
	}
}
