import { StructuredErrorResponse } from 'f61ui/types';

export enum CrudNature {
	update = 'update',
	delete = 'delete',
	create = 'create',
}

export interface CommandDefinition {
	title: string;
	key: string;
	additional_confirmation?: string;
	crudNature: CrudNature;
	fields: CommandField[];
	settings: CommandSettings;
	info: string[];
}

export interface CommandSettings {
	// so there's no hesitation of "did I pick the right row for this action?"
	disambiguation?: string;
	helpUrl?: string;
	redirect?: (id: string) => string;
	error?: (err: StructuredErrorResponse, values: CommandValueCollection) => boolean;
}

export enum CommandFieldKind {
	Text = 'text',
	Password = 'password',
	Multiline = 'multiline',
	Checkbox = 'checkbox',
	Integer = 'integer',
	Date = 'date',
	Any = 'any', // used for custom datatypes
}

export interface CommandField {
	Key: string;
	Title: string;
	Required: boolean;
	HideIfDefaultValue: boolean;
	Kind: CommandFieldKind;
	Unit: string | null;
	DefaultValueString?: string;
	DefaultValueBoolean?: boolean;
	DefaultValueNumber?: number;
	DefaultValueAny?: any;
	Help?: string;
	Placeholder?: string;
	ValidationRegex: string;
}

export interface CommandValueCollection {
	[key: string]: any;
}
