import { Dropdown as DropdownBase } from 'bootstrap';
import * as React from 'react';

interface DropdownProps {
	label?: string;
	children: React.ReactNode;
}

export class Dropdown extends React.Component<DropdownProps, {}> {
	private buttonRef = React.createRef<HTMLButtonElement>();

	componentDidMount(): void {
		if (this.buttonRef.current) {
			alert('initing dropdownbase');
			new DropdownBase(this.buttonRef.current);
		}
	}

	render() {
		// const maybeLabel = this.props.label ? this.props.label + ' ' : '';
		const maybeLabel = 'foo';

		const children: React.ReactNode[] =
			this.props.children instanceof Array ? this.props.children : [this.props.children];

		const items = children.map((child, idx) => {
			return (
				<li key={idx} className="dropdown-item">
					{child}
				</li>
			);
		});

		return (
			<div className="dropdown">
				<button
					type="button"
					ref={this.buttonRef}
					className="btn btn-secondary dropdown-toggle"
					data-bs-toggle="dropdown"
					aria-haspopup="true"
					aria-expanded="false">
					{maybeLabel}
				</button>
				<ul className="dropdown-menu">
					<li>
						<a className="dropdown-item" href="#">
							Action
						</a>
					</li>
					{items}
				</ul>
			</div>
		);
	}
}
