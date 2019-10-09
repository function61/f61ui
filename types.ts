// nominal type
enum dateRFC3339_ {}
export type dateRFC3339 = dateRFC3339_ & string;

// nominal type
enum datetimeRFC3339_ {}
export type datetimeRFC3339 = datetimeRFC3339_ & string;

// nominal type
enum binaryBase64_ {}
export type binaryBase64 = binaryBase64_ & string;

export interface StructuredErrorResponse {
	error_code: string;
	error_description: string;
}

export function plainDateToDateTime(date: dateRFC3339): datetimeRFC3339 {
	return (date + 'T00:00:00Z') as datetimeRFC3339;
}

export function dateObjToDateTime(date: Date): datetimeRFC3339 {
	return date.toISOString() as datetimeRFC3339;
}
