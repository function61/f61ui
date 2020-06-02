import * as React from 'react';

export class PagerData {
	public pageNum: number;
	public pageCount: number;
	public perPage: number;

	constructor(pageNum: number, items: number, perPage: number) {
		this.pageNum = pageNum;
		this.pageCount = Math.ceil(items / perPage);
		this.perPage = perPage;
	}

	// makes a callback suitable for giving to filter() to pick out items for the specific page
	idxFilter(): (_: any, idx: number) => boolean {
		const pageIdx = this.pageNum - 1;
		return (_: any, idx: number) =>
			idx >= pageIdx * this.perPage && idx <= (pageIdx + 1) * this.perPage - 1;
	}
}

interface PagerProps {
	data: PagerData;

	pageUrl: (idx: number) => string;
}

export class Pager extends React.Component<PagerProps, {}> {
	render() {
		// my services are not required :)
		if (this.props.data.pageCount < 2) {
			return null;
		}

		const canMoveLeft = this.props.data.pageNum > 1;
		const canMoveRight = this.props.data.pageNum < this.props.data.pageCount;

		const pages: JSX.Element[] = [];
		for (let pageNum = 1; pageNum <= this.props.data.pageCount; pageNum++) {
			pages.push(
				<li className={pageNum === this.props.data.pageNum ? 'active' : ''}>
					<a href={this.props.pageUrl(pageNum)}>{pageNum}</a>
				</li>,
			);
		}

		// margin resets because our users should get to decide margins

		return (
			<nav aria-label="Page navigation">
				<ul className="pagination" style={{ margin: '0', marginBottom: '0' }}>
					{canMoveLeft && (
						<li>
							<a
								href={this.props.pageUrl(this.props.data.pageNum - 1)}
								aria-label="Previous">
								<span aria-hidden="true">&laquo;</span>
							</a>
						</li>
					)}
					{pages}
					{canMoveRight && (
						<li>
							<a
								href={this.props.pageUrl(this.props.data.pageNum + 1)}
								aria-label="Next">
								<span aria-hidden="true">&raquo;</span>
							</a>
						</li>
					)}
				</ul>
			</nav>
		);
	}
}
