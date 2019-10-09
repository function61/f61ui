import * as React from 'react';

interface AlertCommonProps {
	children: React.ReactNode;
}

type Level = 'success' | 'info' | 'warning' | 'danger';

function render(level: Level, children: React.ReactNode) {
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
	children: React.ReactNode;
	level: Level;
}

export class Alert extends React.Component<AlertProps, {}> {
	render() {
		return render(this.props.level, this.props.children);
	}
}
