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
}

export enum CommandFieldKind {
	Text = 'text',
	Password = 'password',
	Multiline = 'multiline',
	Checkbox = 'checkbox',
	Integer = 'integer',
	Date = 'date',
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
	Help?: string;
	Placeholder?: string;
	ValidationRegex: string;
}
