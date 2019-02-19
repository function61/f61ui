// nominal type
enum dateRFC3339_ {}
export type dateRFC3339 = dateRFC3339_ & string;

// nominal type
enum datetimeRFC3339_ {}
export type datetimeRFC3339 = datetimeRFC3339_ & string;

// nominal type
enum binaryBase64_ {}
export type binaryBase64 = binaryBase64_ & string;

type jsxChildItem = JSX.Element | string;

// FFS this is the problem with JS culture.. if this can be a list, then why not a
// single-item child could be a list with n=1 instead of having this frankenstein type??!
export type jsxChildType = jsxChildItem | jsxChildItem[];

export interface StructuredErrorResponse {
	error_code: string;
	error_description: string;
}

export function dateToDateTime(date: dateRFC3339): datetimeRFC3339 {
	return (date + 'T00:00:00Z') as datetimeRFC3339;
}
