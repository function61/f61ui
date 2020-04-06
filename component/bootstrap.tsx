import * as React from 'react';

export const tableClassStripedHover = 'table table-striped table-hover';

export const tableClassStripedHoverBordered = 'table table-striped table-hover table-bordered';

// generic visual style applicable to many Bootstrap components
type VisualStyle = 'primary' | 'default' | 'success' | 'warning' | 'danger';

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

interface AnchorButtonProps {
	href: string;
	visualStyle?: VisualStyle;
	children: React.ReactNode;
}

export class AnchorButton extends React.Component<AnchorButtonProps, {}> {
	render() {
		return (
			<a
				href={this.props.href}
				className={'btn btn-' + (this.props.visualStyle || 'default')}>
				{this.props.children}
			</a>
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

interface GlyphiconProps {
	icon: GlyphiconIcon;
	title?: string;
}

export class Glyphicon extends React.Component<GlyphiconProps, {}> {
	render() {
		return (
			<span className={'glyphicon glyphicon-' + this.props.icon} title={this.props.title} />
		);
	}
}

export type GlyphiconIcon =
	| 'asterisk'
	| 'plus'
	| 'euro'
	| 'eur'
	| 'minus'
	| 'cloud'
	| 'envelope'
	| 'pencil'
	| 'glass'
	| 'music'
	| 'search'
	| 'heart'
	| 'star'
	| 'star-empty'
	| 'user'
	| 'film'
	| 'th-large'
	| 'th'
	| 'th-list'
	| 'ok'
	| 'remove'
	| 'zoom-in'
	| 'zoom-out'
	| 'off'
	| 'signal'
	| 'cog'
	| 'trash'
	| 'home'
	| 'file'
	| 'time'
	| 'road'
	| 'download-alt'
	| 'download'
	| 'upload'
	| 'inbox'
	| 'play-circle'
	| 'repeat'
	| 'refresh'
	| 'list-alt'
	| 'lock'
	| 'flag'
	| 'headphones'
	| 'volume-off'
	| 'volume-down'
	| 'volume-up'
	| 'qrcode'
	| 'barcode'
	| 'tag'
	| 'tags'
	| 'book'
	| 'bookmark'
	| 'print'
	| 'camera'
	| 'font'
	| 'bold'
	| 'italic'
	| 'text-height'
	| 'text-width'
	| 'align-left'
	| 'align-center'
	| 'align-right'
	| 'align-justify'
	| 'list'
	| 'indent-left'
	| 'indent-right'
	| 'facetime-video'
	| 'picture'
	| 'map-marker'
	| 'adjust'
	| 'tint'
	| 'edit'
	| 'share'
	| 'check'
	| 'move'
	| 'step-backward'
	| 'fast-backward'
	| 'backward'
	| 'play'
	| 'pause'
	| 'stop'
	| 'forward'
	| 'fast-forward'
	| 'step-forward'
	| 'eject'
	| 'chevron-left'
	| 'chevron-right'
	| 'plus-sign'
	| 'minus-sign'
	| 'remove-sign'
	| 'ok-sign'
	| 'question-sign'
	| 'info-sign'
	| 'screenshot'
	| 'remove-circle'
	| 'ok-circle'
	| 'ban-circle'
	| 'arrow-left'
	| 'arrow-right'
	| 'arrow-up'
	| 'arrow-down'
	| 'share-alt'
	| 'resize-full'
	| 'resize-small'
	| 'exclamation-sign'
	| 'gift'
	| 'leaf'
	| 'fire'
	| 'eye-open'
	| 'eye-close'
	| 'warning-sign'
	| 'plane'
	| 'calendar'
	| 'random'
	| 'comment'
	| 'magnet'
	| 'chevron-up'
	| 'chevron-down'
	| 'retweet'
	| 'shopping-cart'
	| 'folder-close'
	| 'folder-open'
	| 'resize-vertical'
	| 'resize-horizontal'
	| 'hdd'
	| 'bullhorn'
	| 'bell'
	| 'certificate'
	| 'thumbs-up'
	| 'thumbs-down'
	| 'hand-right'
	| 'hand-left'
	| 'hand-up'
	| 'hand-down'
	| 'circle-arrow-right'
	| 'circle-arrow-left'
	| 'circle-arrow-up'
	| 'circle-arrow-down'
	| 'globe'
	| 'wrench'
	| 'tasks'
	| 'filter'
	| 'briefcase'
	| 'fullscreen'
	| 'dashboard'
	| 'paperclip'
	| 'heart-empty'
	| 'link'
	| 'phone'
	| 'pushpin'
	| 'usd'
	| 'gbp'
	| 'sort'
	| 'sort-by-alphabet'
	| 'sort-by-alphabet-alt'
	| 'sort-by-order'
	| 'sort-by-order-alt'
	| 'sort-by-attributes'
	| 'sort-by-attributes-alt'
	| 'unchecked'
	| 'expand'
	| 'collapse-down'
	| 'collapse-up'
	| 'log-in'
	| 'flash'
	| 'log-out'
	| 'new-window'
	| 'record'
	| 'save'
	| 'open'
	| 'saved'
	| 'import'
	| 'export'
	| 'send'
	| 'floppy-disk'
	| 'floppy-saved'
	| 'floppy-remove'
	| 'floppy-save'
	| 'floppy-open'
	| 'credit-card'
	| 'transfer'
	| 'cutlery'
	| 'header'
	| 'compressed'
	| 'earphone'
	| 'phone-alt'
	| 'tower'
	| 'stats'
	| 'sd-video'
	| 'hd-video'
	| 'subtitles'
	| 'sound-stereo'
	| 'sound-dolby'
	| 'sound-5-1'
	| 'sound-6-1'
	| 'sound-7-1'
	| 'copyright-mark'
	| 'registration-mark'
	| 'cloud-download'
	| 'cloud-upload'
	| 'tree-conifer'
	| 'tree-deciduous'
	| 'cd'
	| 'save-file'
	| 'open-file'
	| 'level-up'
	| 'copy'
	| 'paste'
	| 'alert'
	| 'equalizer'
	| 'king'
	| 'queen'
	| 'pawn'
	| 'bishop'
	| 'knight'
	| 'baby-formula'
	| 'tent'
	| 'blackboard'
	| 'bed'
	| 'apple'
	| 'erase'
	| 'hourglass'
	| 'lamp'
	| 'duplicate'
	| 'piggy-bank'
	| 'scissors'
	| 'bitcoin'
	| 'btc'
	| 'xbt'
	| 'yen'
	| 'jpy'
	| 'ruble'
	| 'rub'
	| 'scale'
	| 'ice-lolly'
	| 'ice-lolly-tasted'
	| 'education'
	| 'option-horizontal'
	| 'option-vertical'
	| 'menu-hamburger'
	| 'modal-window'
	| 'oil'
	| 'grain'
	| 'sunglasses'
	| 'text-size'
	| 'text-color'
	| 'text-background'
	| 'object-align-top'
	| 'object-align-bottom'
	| 'object-align-horizontal'
	| 'object-align-left'
	| 'object-align-vertical'
	| 'object-align-right'
	| 'triangle-right'
	| 'triangle-left'
	| 'triangle-bottom'
	| 'triangle-top'
	| 'console'
	| 'superscript'
	| 'subscript'
	| 'menu-left'
	| 'menu-right'
	| 'menu-down'
	| 'menu-up';

interface LabelProps {
	title?: string;
	children: React.ReactNode;
}

export class DefaultLabel extends React.Component<LabelProps, {}> {
	render() {
		return label(this.props, 'default');
	}
}

export class PrimaryLabel extends React.Component<LabelProps, {}> {
	render() {
		return label(this.props, 'primary');
	}
}

export class SuccessLabel extends React.Component<LabelProps, {}> {
	render() {
		return label(this.props, 'success');
	}
}

export class WarningLabel extends React.Component<LabelProps, {}> {
	render() {
		return label(this.props, 'warning');
	}
}

export class DangerLabel extends React.Component<LabelProps, {}> {
	render() {
		return label(this.props, 'danger');
	}
}

function label(props: LabelProps, visualStyle: VisualStyle): React.ReactNode {
	return (
		<span className={'label label-' + visualStyle} title={props.title}>
			{props.children}
		</span>
	);
}

interface MutedTextProps {
	children: React.ReactNode;
}

export class MutedText extends React.Component<MutedTextProps, {}> {
	render() {
		return <span className="text-muted">{this.props.children}</span>;
	}
}
