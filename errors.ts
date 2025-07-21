import { globalConfig } from 'f61ui/globalconfig';
import { StructuredErrorResponse } from 'f61ui/types';

export function defaultErrorHandler(err: Error | StructuredErrorResponse) {
	const ser = coerceToStructuredErrorResponse(err);

	if (handleKnownGlobalErrors(ser)) {
		return;
	}

	alert(formatStructuredErrorResponse(ser));
}

export function formatStructuredErrorResponse(ser: StructuredErrorResponse): string {
	if (ser.error_code === 'generic') {
		// means pretty much "unknown", so no sense in showing it
		return ser.error_description;
	}

	return `${ser.error_code}: ${ser.error_description}`;
}

export function formatAnyError(err: Error | StructuredErrorResponse): string {
	return formatStructuredErrorResponse(coerceToStructuredErrorResponse(err));
}

export function handleKnownGlobalErrors(err: StructuredErrorResponse): boolean {
	const handler = globalConfig().knownGlobalErrorsHandler;
	if (!handler) {
		return false;
	}

	return handler(err);
}

export function coerceToStructuredErrorResponse(
	err: Error | StructuredErrorResponse,
): StructuredErrorResponse {
	if (isStructuredErrorResponse(err)) {
		return err;
	}

	return { error_code: 'generic', error_description: err.toString() };
}

export function isStructuredErrorResponse(
	err: StructuredErrorResponse | {},
): err is StructuredErrorResponse {
	return typeof err === 'object' && 'error_code' in (err as StructuredErrorResponse);
}

// not all caught errors inherit from `Error` (which would have `.toString()` available which we likely need).
// most likely they do, but this function "coerces" everything to `Error` even if it means losing
// original object in entirety (because it's just unlikely anyway).
export function asError(possiblyError: any): Error {
	return possiblyError instanceof Error
		? possiblyError
		: new Error('given variable not instance of Error');
}
