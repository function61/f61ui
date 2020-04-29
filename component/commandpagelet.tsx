import { navigateTo, reloadCurrentPage } from 'f61ui/browserutils';
import {
	CommandDefinition,
	CommandField,
	CommandFieldKind,
	CommandValueCollection,
} from 'f61ui/commandtypes';
import { DangerAlert, InfoAlert } from 'f61ui/component/alerts';
import { Glyphicon } from 'f61ui/component/bootstrap';
import { Info } from 'f61ui/component/info';
import {
	coerceToStructuredErrorResponse,
	formatStructuredErrorResponse,
	handleKnownGlobalErrors,
} from 'f61ui/errors';
import { postJsonReturningVoid } from 'f61ui/httputil';
import { unrecognizedValue } from 'f61ui/utils';
import * as React from 'react';

export type CommandSubmitListener = () => void;

export interface CommandChangesArgs {
	submitEnabled: boolean;
	// server is currently processing this request?
	processing: boolean;
}

export function initialCommandState(): CommandChangesArgs {
	return { submitEnabled: false, processing: false };
}

export type CommandChangesListener = (cmdState: CommandChangesArgs) => void;

interface CommandPageletProps {
	command: CommandDefinition;
	onChanges: CommandChangesListener;
	onSubmit: CommandSubmitListener;
}

interface CommandPageletState {
	additional_confirmation?: boolean;
	submitError: string;
}

export class CommandPagelet extends React.Component<CommandPageletProps, CommandPageletState> {
	state: CommandPageletState = { submitError: '' };
	cexec: CommandExecutor;
	fieldsThatWerePrefilled: { [key: string]: boolean } = {};

	constructor(props: CommandPageletProps) {
		super(props);

		this.cexec = new CommandExecutor(props.command);

		// CommandExecutor only puts entries into "values" when have non-undefined DefaultValues
		for (const key of Object.keys(this.cexec.values)) {
			this.fieldsThatWerePrefilled[key] = true;
		}

		// so that initial validation state is used - otherwise only the
		// first onchange would yield in current state
		this.broadcastChanges();
	}

	render() {
		const shouldShow = (field: CommandField) =>
			!field.HideIfDefaultValue || !(field.Key in this.fieldsThatWerePrefilled);

		const fieldGroups = this.props.command.fields.filter(shouldShow).map((field, idx) => {
			const shouldAutofocus = idx === 0;

			const input = this.createInput(field, shouldAutofocus);
			if (input === null) {
				// not visible component
				return <div />;
			}

			const valid = this.cexec.validationStatuses[field.Key];

			const validationFailedClass = valid ? '' : 'has-error';

			const addon = field.Unit && <div className="input-group-addon">{field.Unit}</div>;

			// TODO: label[for]
			// curiously, if we have input-group without addon the input doesn't get rounded
			// corners like it should get. this is why we wrap input conditionally..
			return (
				<div className={`form-group ${validationFailedClass}`} key={field.Key}>
					<div>
						<label style={{ marginRight: '8px' }}>
							{field.Title || field.Key} {field.Required ? '*' : ''}
						</label>
						{field.Help && <Info text={field.Help} />}
					</div>

					{addon ? (
						<div className="input-group" style={{ width: '100%' }}>
							{input}
							{addon}
						</div>
					) : (
						input
					)}
				</div>
			);
		});

		if (this.props.command.additional_confirmation) {
			fieldGroups.push(
				this.createAdditionalConfirmationFormGroup(
					this.props.command.additional_confirmation,
				),
			);
		}

		const footer =
			this.props.command.info.length > 0 ? (
				<InfoAlert>
					{this.props.command.info.map((info, idx) => (
						<p>
							{idx === 0 && <Glyphicon icon="info-sign" />} {info}
						</p>
					))}
				</InfoAlert>
			) : null;

		// hidden submit included because otherwise onSubmit does not work except if form has only one input
		// https://stackoverflow.com/a/40400840

		return (
			<form
				onSubmit={(e) => {
					e.preventDefault();
					this.onInternalEnterSubmit(e);
				}}>
				{fieldGroups}

				<input type="submit" style={{ display: 'none' }} />

				{this.state.submitError && <DangerAlert>{this.state.submitError}</DangerAlert>}

				{footer}
			</form>
		);
	}

	// returns whether operation succeeded
	// - true => close/hide possible UI the pagelet was on)
	// - false => nop-op - error displaying is handled internally
	async submitAndRedirectOnSuccess(): Promise<boolean> {
		// disable submit button while server is processing
		this.props.onChanges({
			processing: true,
			submitEnabled: false,
		});

		this.setState({ submitError: '' });

		try {
			if (!this.isEverythingValid()) {
				// shouldn't happen, because submit button is disabled when form is not valid
				return Promise.reject(new Error('Invalid form data'));
			}

			await this.cexec.executeAndRedirectOnSuccess();

			return true;
		} catch (err) {
			const ser = coerceToStructuredErrorResponse(err);

			if (
				this.props.command.settings.error &&
				this.props.command.settings.error(ser, this.cexec.values)
			) {
				// no-op, error handler reported as having handled this
			} else if (!handleKnownGlobalErrors(ser)) {
				this.setState({ submitError: formatStructuredErrorResponse(ser) });
			}

			return false;
		} finally {
			// whether fulfilled or rejected, return back to
			// {processing: false, submitEnabled: true}
			this.broadcastChanges();
		}
	}

	private createAdditionalConfirmationFormGroup(question: string) {
		return (
			<div className="form-group" key="additional_confirmation">
				<div>
					<label>{question} *</label>
				</div>

				<input
					type="checkbox"
					className="form-control"
					onChange={(e) => {
						this.setState({ additional_confirmation: e.currentTarget.checked }, () => {
							this.broadcastChanges();
						});
					}}
				/>
			</div>
		);
	}

	// lets outside components who are dependent on our "submitEnabled" (= data valid)
	// and "processing" states update their UIs
	private broadcastChanges() {
		this.props.onChanges({
			submitEnabled: this.isEverythingValid(),
			processing: false,
		});
	}

	private onInternalEnterSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault(); // prevent browser-based submit

		this.props.onSubmit();
	}

	// sames as CommandExecutor's validation but adds additional_confirmation
	private isEverythingValid(): boolean {
		if (
			this.props.command.additional_confirmation !== undefined &&
			this.state.additional_confirmation !== true
		) {
			return false;
		}

		return this.cexec.allFieldsValid();
	}

	private updateFieldValue(key: string, value: any) {
		const field = this.fieldByKey(key);

		this.cexec.values[key] = value;
		this.cexec.validationStatuses[field.Key] = this.cexec.validate(field, value);

		// force re-render
		this.setState(this.state);

		// FIXME: this sets processing: false. this should not be
		// done while the server is actually processing
		this.broadcastChanges();
	}

	private onInputChange(e: React.FormEvent<HTMLInputElement>) {
		this.updateFieldValue(e.currentTarget.name, e.currentTarget.value);
	}

	private onIntegerInputChange(e: React.FormEvent<HTMLInputElement>) {
		if (e.currentTarget.value === '') {
			this.updateFieldValue(e.currentTarget.name, null);
		} else {
			this.updateFieldValue(e.currentTarget.name, +e.currentTarget.value);
		}
	}

	private onCheckboxChange(e: React.FormEvent<HTMLInputElement>) {
		this.updateFieldValue(e.currentTarget.name, e.currentTarget.checked);
	}

	private onTextareaChange(e: React.FormEvent<HTMLTextAreaElement>) {
		this.updateFieldValue(e.currentTarget.name, e.currentTarget.value);
	}

	private createInput(field: CommandField, autoFocus: boolean): JSX.Element | null {
		switch (field.Kind) {
			case CommandFieldKind.CustomString:
			case CommandFieldKind.CustomInteger:
				const factory = this.props.command.customFields![field.Key];
				return factory(
					field,
					this.cexec.values[field.Key],
					(val: any) => {
						this.updateFieldValue(field.Key, val);
					},
					autoFocus,
				);
			case CommandFieldKind.Password:
				return (
					<input
						type="password"
						className="form-control"
						name={field.Key}
						placeholder={field.Placeholder}
						autoFocus={autoFocus}
						required={field.Required}
						value={this.cexec.values[field.Key]}
						onChange={this.onInputChange.bind(this)}
					/>
				);
			case CommandFieldKind.Text:
				return (
					<input
						type="text"
						className="form-control"
						name={field.Key}
						placeholder={field.Placeholder}
						autoFocus={autoFocus}
						required={field.Required}
						value={this.cexec.values[field.Key]}
						onChange={this.onInputChange.bind(this)}
					/>
				);
			case CommandFieldKind.Date:
				return (
					<input
						type="date"
						name={field.Key}
						placeholder={field.Placeholder}
						autoFocus={autoFocus}
						className="form-control"
						onChange={this.onInputChange.bind(this)}
					/>
				);
			case CommandFieldKind.Multiline:
				return (
					<textarea
						name={field.Key}
						placeholder={field.Placeholder}
						autoFocus={autoFocus}
						required={field.Required}
						className="form-control"
						rows={7}
						value={this.cexec.values[field.Key]}
						onChange={this.onTextareaChange.bind(this)}
					/>
				);
			case CommandFieldKind.Integer:
				return (
					<input
						type="number"
						className="form-control"
						name={field.Key}
						placeholder={field.Placeholder}
						autoFocus={autoFocus}
						required={field.Required}
						value={this.cexec.values[field.Key]}
						onChange={this.onIntegerInputChange.bind(this)}
					/>
				);
			case CommandFieldKind.Checkbox:
				return (
					<input
						type="checkbox"
						name={field.Key}
						autoFocus={autoFocus}
						className="form-control"
						checked={this.cexec.values[field.Key]}
						onChange={this.onCheckboxChange.bind(this)}
					/>
				);
			case CommandFieldKind.Any:
				return null;
			default:
				return unrecognizedValue(field.Kind);
		}
	}

	private fieldByKey(key: string): CommandField {
		const matches = this.props.command.fields.filter((field) => field.Key === key);

		if (matches.length !== 1) {
			throw new Error(`Field by key ${key} not found`);
		}

		return matches[0];
	}
}

// encapsulates command, its input/validation and submitting it to server
export class CommandExecutor {
	command: CommandDefinition;
	values: CommandValueCollection = {};
	validationStatuses: { [key: string]: boolean } = {};

	constructor(command: CommandDefinition) {
		this.command = command;

		// copy default values to values, because they are only updated on
		// "onChange" event, and thus if user doesn't change them, they wouldn't get filled
		this.command.fields.forEach((field) => {
			switch (field.Kind) {
				case CommandFieldKind.Any:
					if (field.DefaultValueAny !== undefined) {
						this.values[field.Key] = field.DefaultValueAny;
					}
					break;
				case CommandFieldKind.CustomInteger:
				case CommandFieldKind.Integer:
					this.values[field.Key] = null;
					if (field.DefaultValueNumber !== undefined) {
						this.values[field.Key] = field.DefaultValueNumber;
					}
					break;
				case CommandFieldKind.Password:
				case CommandFieldKind.Text:
				case CommandFieldKind.Date:
				case CommandFieldKind.CustomString:
				case CommandFieldKind.Multiline:
					if (field.DefaultValueString !== undefined) {
						this.values[field.Key] = field.DefaultValueString;
					}
					break;
				case CommandFieldKind.Checkbox:
					this.values[field.Key] = field.DefaultValueBoolean;
					break;
				default:
					unrecognizedValue(field.Kind);
			}

			this.validationStatuses[field.Key] = this.validate(field, this.values[field.Key]);
		});
	}

	async execute(): Promise<Response> {
		if (!this.allFieldsValid()) {
			// should happen very rarely, as UI is supposed to block submit buttons when
			// data is invalid
			throw new Error('Not all command fields are valid');
		}

		return await postJsonReturningVoid<CommandValueCollection>(
			`/command/${this.command.key}`,
			this.values,
		);
	}

	async executeAndRedirectOnSuccess(): Promise<void> {
		const response = await this.execute();

		const redirectFn = this.command.settings.redirect;

		if (redirectFn) {
			const recordId = response.headers.get('x-created-record-id'); // case insensitive

			if (!recordId) {
				throw new Error(
					`command has redirectFn specified, but server did not provide x-created-record-id`,
				);
			}

			const redirectTarget = redirectFn(recordId);

			// redirectFn can return '' to signify it handled redirection itself
			if (redirectTarget) {
				navigateTo(redirectTarget);
			}
		} else {
			reloadCurrentPage();
		}
	}

	allFieldsValid(): boolean {
		return Object.keys(this.validationStatuses).every((key) => this.validationStatuses[key]);
	}

	validate(field: CommandField, value: any): boolean {
		if (field.Required && (value === undefined || value === null || value === '')) {
			return false;
		}

		// strim with heading or trailing whitespace
		// TODO: opting out of this mechanism?
		if (typeof value === 'string' && value !== value.trim()) {
			return false;
		}

		if (field.ValidationRegex && !new RegExp(field.ValidationRegex).test(value)) {
			return false;
		}

		return true;
	}
}
