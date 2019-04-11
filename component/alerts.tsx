import { jsxChildType } from 'f61ui/types';
import * as React from 'react';

interface AlertCommonProps {
	children: jsxChildType;
}

type Level = 'success' | 'info' | 'warning' | 'danger';

function render(level: Level, children: jsxChildType) {
	return (
		<div className={`alert alert-${level}`} role="alert">
			{children}
		</div>
	);
}

export class WarningAlert extends React.Component<AlertCommonProps, {}> {
	render() {
		return render('warning', this.props.children);
	}
}

export class InfoAlert extends React.Component<AlertCommonProps, {}> {
	render() {
		return render('info', this.props.children);
	}
}

export class SuccessAlert extends React.Component<AlertCommonProps, {}> {
	render() {
		return render('success', this.props.children);
	}
}

export class DangerAlert extends React.Component<AlertCommonProps, {}> {
	render() {
		return render('danger', this.props.children);
	}
}

// for when your level needs are dynamic

interface AlertProps {
	children: jsxChildType;
	level: Level;
}

export class Alert extends React.Component<AlertProps, {}> {
	render() {
		return render(this.props.level, this.props.children);
	}
}
