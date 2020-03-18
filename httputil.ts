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

export function postJson<I, O>(url: string, body: I): Promise<O> {
	return postJsonReturningVoid<I>(url, body).then((res) => res.json());
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
			'HTTP response failure. Also, error fetching response body: ' + err.toString(),
		);
	}

	if (response.headers.get('content-type') === 'application/json') {
		throw JSON.parse(responseBody) as StructuredErrorResponse;
	} else {
		throw new Error('HTTP response failure: ' + responseBody);
	}
}

export function makeQueryParams(path: string, queryParams: { [key: string]: string }): string {
	const queryParamKvs = Object.keys(queryParams).map(
		(key) => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]),
	);

	return queryParamKvs.length === 0 ? path : path + '?' + queryParamKvs.join('&');
}

function readCsrfToken(): string | null {
	// TODO: fix this botched way of reading the cookie value..
	const csrfToken = /csrf_token=([^;]+)/.exec(document.cookie);
	return csrfToken ? csrfToken[1] : null;
}
