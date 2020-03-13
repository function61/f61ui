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
	return `${ser.error_code}: ${ser.error_description}`;
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
