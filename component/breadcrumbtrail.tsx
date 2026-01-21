import * as React from 'react';

export interface Breadcrumb {
	url?: string;
	title: React.ReactNode;
}

interface BreadcrumbTrailProps {
	items: Breadcrumb[];
}

export class BreadcrumbTrail extends React.Component<BreadcrumbTrailProps, {}> {
	render() {
		const items = this.props.items.map((item, index) => {
			if (!item.url) {
				return (
					<li key={index} className="breadcrumb-item active">
						{item.title}
					</li>
				);
			}
			return (
				<li key={index} className="breadcrumb-item">
					<a href={item.url}>{item.title}</a>
				</li>
			);
		});

		return (
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb breadcrumb-custom overflow-hidden text-center bg-body-tertiary border rounded-3 mt-3">
					{items}
				</ol>
			</nav>
		);
	}
}
