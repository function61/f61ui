import { CommandDefinition, CrudNature } from 'f61ui/commandtypes';
import {
	CommandChangesArgs,
	CommandPagelet,
	initialCommandState,
} from 'f61ui/component/commandpagelet';
import { Loading } from 'f61ui/component/loading';
import { ModalDialog } from 'f61ui/component/modaldialog';
import { unrecognizedValue } from 'f61ui/utils';
import * as React from 'react';

interface CommandButtonProps {
	command: CommandDefinition;
}

interface CommandButtonState {
	dialogOpen: boolean;
	cmdState: CommandChangesArgs;
}

export class CommandButton extends React.Component<CommandButtonProps, CommandButtonState> {
	state = { dialogOpen: false, cmdState: initialCommandState() };

	private cmdPagelet: CommandPagelet | null = null;

	save() {
		this.cmdPagelet!.submitAndReloadOnSuccess();
	}

	render() {
		return (
			<div style={{ display: 'inline-block' }}>
				<a
					className="btn btn-default"
					onClick={() => {
						this.setState({ dialogOpen: true });
					}}>
					{this.props.command.title}
				</a>

				{this.state.dialogOpen
					? mkCommandDialog(
							this.props.command,
							this.state.cmdState,
							() => {
								this.setState({ dialogOpen: false });
							},
							() => {
								this.save();
							},
							(cmdState: CommandChangesArgs) => {
								this.setState({ cmdState });
							},
							(el: CommandPagelet) => {
								this.cmdPagelet = el;
							},
					  )
					: null}
			</div>
		);
	}
}

interface CommandIconProps {
	command: CommandDefinition;
}

interface CommandIconState {
	dialogOpen: boolean;
	cmdState: CommandChangesArgs;
}

function commandCrudNatureToIcon(nature: CrudNature): string {
	switch (nature) {
		case CrudNature.create:
			return 'glyphicon-plus';
		case CrudNature.update:
			return 'glyphicon-pencil';
		case CrudNature.delete:
			return 'glyphicon-remove';
		default:
			throw unrecognizedValue(nature);
	}
}

function btnClassFromCrudNature(nature: CrudNature): string {
	switch (nature) {
		case CrudNature.create:
			return 'btn-success';
		case CrudNature.update:
			return 'btn-primary';
		case CrudNature.delete:
			return 'btn-danger';
		default:
			throw unrecognizedValue(nature);
	}
}

export class CommandIcon extends React.Component<CommandIconProps, CommandIconState> {
	state = { dialogOpen: false, cmdState: initialCommandState() };

	private cmdPagelet: CommandPagelet | null = null;

	save() {
		this.cmdPagelet!.submitAndReloadOnSuccess();
	}

	render() {
		const icon = commandCrudNatureToIcon(this.props.command.crudNature);

		return (
			<span
				className={`glyphicon ${icon} hovericon margin-left`}
				onClick={() => {
					this.setState({ dialogOpen: true });
				}}
				title={this.props.command.title}>
				{this.state.dialogOpen
					? mkCommandDialog(
							this.props.command,
							this.state.cmdState,
							() => {
								this.setState({ dialogOpen: false });
							},
							() => {
								this.save();
							},
							(cmdState: CommandChangesArgs) => {
								this.setState({ cmdState });
							},
							(el: CommandPagelet) => {
								this.cmdPagelet = el;
							},
					  )
					: null}
			</span>
		);
	}
}

interface CommandLinkProps {
	command: CommandDefinition;
}

interface CommandLinkState {
	dialogOpen: boolean;
	cmdState: CommandChangesArgs;
}

export class CommandLink extends React.Component<CommandLinkProps, CommandLinkState> {
	state = { dialogOpen: false, cmdState: initialCommandState() };

	private cmdPagelet: CommandPagelet | null = null;

	save() {
		this.cmdPagelet!.submitAndReloadOnSuccess();
	}

	render() {
		return (
			<a
				className="fauxlink"
				onClick={() => {
					this.setState({ dialogOpen: true });
				}}
				key={this.props.command.key}>
				{this.props.command.title}
				{this.state.dialogOpen
					? mkCommandDialog(
							this.props.command,
							this.state.cmdState,
							() => {
								this.setState({ dialogOpen: false });
							},
							() => {
								this.save();
							},
							(cmdState: CommandChangesArgs) => {
								this.setState({ cmdState });
							},
							(el: CommandPagelet) => {
								this.cmdPagelet = el;
							},
					  )
					: null}
			</a>
		);
	}
}

interface CommandInlineFormProps {
	command: CommandDefinition;
}

interface CommandInlineFormState {
	cmdState?: CommandChangesArgs;
}

export class CommandInlineForm extends React.Component<
	CommandInlineFormProps,
	CommandInlineFormState
> {
	public state: CommandInlineFormState = {};
	private cmdPagelet: CommandPagelet | null = null;

	render() {
		const submitEnabled = this.state.cmdState && this.state.cmdState.submitEnabled;
		const maybeLoading =
			this.state.cmdState && this.state.cmdState.processing ? <Loading /> : null;

		return (
			<div>
				<CommandPagelet
					command={this.props.command}
					onSubmit={() => {
						this.save();
					}}
					onChanges={(cmdState) => {
						this.setState({ cmdState });
					}}
					ref={(el) => {
						this.cmdPagelet = el;
					}}
				/>

				<button
					className={'btn ' + btnClassFromCrudNature(this.props.command.crudNature)}
					onClick={() => {
						this.save();
					}}
					disabled={!submitEnabled}>
					{this.props.command.title}
				</button>

				{maybeLoading}
			</div>
		);
	}

	save() {
		this.cmdPagelet!.submitAndReloadOnSuccess();
	}
}

function mkCommandDialog(
	command: CommandDefinition,
	cmdState: CommandChangesArgs,
	close: () => void,
	submit: () => void,
	change: (cmdState: CommandChangesArgs) => void,
	ref: (el: CommandPagelet) => void,
) {
	const dialogTitle =
		command.settings.disambiguation !== undefined
			? `${command.title} (${command.settings.disambiguation})`
			: command.title;

	return (
		<ModalDialog
			title={dialogTitle}
			onClose={close}
			onSave={submit}
			loading={cmdState.processing}
			submitTitle={command.title}
			submitBtnClass={btnClassFromCrudNature(command.crudNature)}
			submitEnabled={cmdState.submitEnabled}>
			<CommandPagelet command={command} onSubmit={submit} onChanges={change} ref={ref} />
		</ModalDialog>
	);
}
