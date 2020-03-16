import { navigateTo, reloadCurrentPage } from 'f61ui/browserutils';
import { CommandDefinition, CommandField, CommandFieldKind } from 'f61ui/commandtypes';
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

interface CommandValueCollection {
	[key: string]: any;
}

interface CommandPageletState {
	values: CommandValueCollection;
	additional_confirmation?: boolean;
	validationStatuses: { [key: string]: boolean };
	submitError: string;
	fieldsThatWerePrefilled: { [key: string]: boolean };
}

export class CommandPagelet extends React.Component<CommandPageletProps, CommandPageletState> {
	constructor(props: CommandPageletProps) {
		super(props);

		const state: CommandPageletState = {
			values: {},
			validationStatuses: {},
			submitError: '',
			fieldsThatWerePrefilled: {},
		};

		// copy default values to values, because they are only updated on
		// "onChange" event, and thus if user doesn't change them, they wouldn't get filled
		this.props.command.fields.forEach((field) => {
			switch (field.Kind) {
				case CommandFieldKind.Integer:
					state.values[field.Key] = null;
					if (field.DefaultValueNumber !== undefined) {
						state.values[field.Key] = field.DefaultValueNumber;
						state.fieldsThatWerePrefilled[field.Key] = true;
					}
					break;
				case CommandFieldKind.Password:
				case CommandFieldKind.Text:
				case CommandFieldKind.Date:
				case CommandFieldKind.Multiline:
					state.values[field.Key] = field.DefaultValueString;
					if (field.DefaultValueString !== undefined) {
						state.fieldsThatWerePrefilled[field.Key] = true;
					}
					break;
				case CommandFieldKind.Checkbox:
					state.values[field.Key] = field.DefaultValueBoolean;
					break;
				default:
					unrecognizedValue(field.Kind);
			}

			state.validationStatuses[field.Key] = this.validate(field, state.values[field.Key]);
		});

		this.state = state;

		// so that initial validation state is used - otherwise only the
		// first onchange would yield in current state
		this.broadcastChanges();
	}

	render() {
		const shouldShow = (field: CommandField) =>
			!field.HideIfDefaultValue || !(field.Key in this.state.fieldsThatWerePrefilled);

		const fieldGroups = this.props.command.fields.filter(shouldShow).map((field, idx) => {
			const shouldAutofocus = idx === 0;

			const input = this.createInput(field, shouldAutofocus);

			const valid = this.state.validationStatuses[field.Key];

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

				{this.state.submitError ? (
					<DangerAlert>{this.state.submitError}</DangerAlert>
				) : null}

				{footer}
			</form>
		);
	}

	async submitAndReloadOnSuccess() {
		try {
			const response = await this.submit();
			const redirectFn = this.props.command.settings.redirect;

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
		} catch (err) {
			const ser = coerceToStructuredErrorResponse(err);

			if (this.props.command.settings.errorHandler) {
				this.props.command.settings.errorHandler(ser);
			} else if (!handleKnownGlobalErrors(ser)) {
				this.setState({ submitError: formatStructuredErrorResponse(ser) });
			}
		}
	}

	// official submit, which should trigger validation
	private async submit(): Promise<Response> {
		// disable submit button while server is processing
		this.props.onChanges({
			processing: true,
			submitEnabled: false,
		});

		this.setState({ submitError: '' });

		try {
			return await this.validateAndPost();
		} finally {
			// whether fulfilled or rejected, return submitEnabled
			// state back to what it should be
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

	private validate(field: CommandField, value: any): boolean {
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

	private async validateAndPost(): Promise<Response> {
		if (!this.isEverythingValid()) {
			return Promise.reject(new Error('Invalid form data'));
		}

		return await postJsonReturningVoid<CommandValueCollection>(
			`/command/${this.props.command.key}`,
			this.state.values,
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

	private isEverythingValid(): boolean {
		if (
			this.props.command.additional_confirmation !== undefined &&
			this.state.additional_confirmation !== true
		) {
			return false;
		}

		return Object.keys(this.state.validationStatuses).every(
			(key) => this.state.validationStatuses[key],
		);
	}

	private updateFieldValue(key: string, value: any) {
		const field = this.fieldByKey(key);

		this.state.values[key] = value;
		this.state.validationStatuses[field.Key] = this.validate(field, value);

		this.setState(this.state);

		// TODO: this sets processing: false. this should not be
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

	private createInput(field: CommandField, autoFocus: boolean): JSX.Element {
		switch (field.Kind) {
			case CommandFieldKind.Password:
				return (
					<input
						type="password"
						className="form-control"
						name={field.Key}
						placeholder={field.Placeholder}
						autoFocus={autoFocus}
						required={field.Required}
						value={this.state.values[field.Key]}
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
						value={this.state.values[field.Key]}
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
						value={this.state.values[field.Key]}
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
						value={this.state.values[field.Key]}
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
						checked={this.state.values[field.Key]}
						onChange={this.onCheckboxChange.bind(this)}
					/>
				);
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
