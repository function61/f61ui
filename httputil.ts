import { asError } from 'f61ui/errors';
import { StructuredErrorResponse } from 'f61ui/types';

export async function getJson<T>(url: string): Promise<T> {
	const headers: { [key: string]: string } = {
		Accept: 'application/json',
	};

	const csrfToken = readCsrfToken();
	if (csrfToken) {
		headers['x-csrf-token'] = csrfToken;
	}

	const response = await fetch(url, { method: 'GET', headers });

	await httpMustBeOk(response);

	return await response.json();
}

export async function postJson<I, O>(url: string, body: I): Promise<O> {
	const response = await postJsonReturningVoid<I>(url, body);
	return await response.json();
}

export async function postJsonReturningVoid<T>(url: string, body: T): Promise<Response> {
	const bodyToPost = JSON.stringify(body);

	const headers: { [key: string]: string } = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};

	const csrfToken = readCsrfToken();
	if (csrfToken) {
		headers['x-csrf-token'] = csrfToken;
	}

	const response = await fetch(url, {
		headers,
		method: 'POST',
		body: bodyToPost,
	});

	await httpMustBeOk(response);

	return response;
}

export async function httpMustBeOk(response: Response): Promise<void> {
	if (response.ok) {
		return;
	}

	// response not ok, dig up response body to make a detailed error object
	let responseBody: string;

	try {
		responseBody = await response.text();
	} catch (err) {
		throw new Error(
			'HTTP response failure. Also, error fetching response body: ' + asError(err).toString(),
		);
	}

	if (response.headers.get('content-type') === 'application/json') {
		throw JSON.parse(responseBody) as StructuredErrorResponse;
	} else {
		throw new Error('HTTP response failure: ' + responseBody);
	}
}

export function makeQueryParams(path: string, params: QueryParams): string {
	const queryParamKvs = Object.keys(params).map(
		(key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]),
	);

	return queryParamKvs.length === 0 ? path : path + '?' + queryParamKvs.join('&');
}

export interface QueryParams {
	[key: string]: string;
}

export function parseQueryParams(queryParamsSerialized: string): QueryParams {
	// "foo=bar&quu=qux" => ["foo=bar", "quu=qux"]
	const queryParPairs = queryParamsSerialized === '' ? [] : queryParamsSerialized.split('&');

	return queryParPairs.reduce((acc, current) => {
		const eqPos = current.indexOf('=');

		const key = decodeURIComponent(current.substr(0, eqPos));
		const value = decodeURIComponent(current.substr(eqPos + 1));

		acc[key] = value;

		return acc;
	}, {} as QueryParams);
}

function readCsrfToken(): string | null {
	// TODO: fix this botched way of reading the cookie value..
	const csrfToken = /csrf_token=([^;]+)/.exec(document.cookie);
	return csrfToken ? csrfToken[1] : null;
}
