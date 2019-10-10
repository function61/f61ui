import * as React from 'react';

interface DropdownProps {
	label?: string;
	children: React.ReactNode;
}

export class Dropdown extends React.Component<DropdownProps, {}> {
	render() {
		const maybeLabel = this.props.label ? this.props.label + ' ' : '';

		const children: React.ReactNode[] =
			this.props.children instanceof Array ? this.props.children : [this.props.children];

		const items = children.map((child, idx) => {
			return <li key={idx}>{child}</li>;
		});

		return (
			<div className="btn-group">
				<button
					type="button"
					className="btn btn-default dropdown-toggle"
					data-toggle="dropdown"
					aria-haspopup="true"
					aria-expanded="false">
					{maybeLabel}
					<span className="caret" />
				</button>
				<ul className="dropdown-menu">{items}</ul>
			</div>
		);
	}
}
