import type { PageServerLoad } from './$types';
import { PUBLIC_API_PATH } from '$env/static/public';
import { error } from '@sveltejs/kit';
import { preprocessResources } from 'lxljs/vocab';
import { initDisplayUtil } from 'lxljs/display';

export const load = (async ({ params, fetch }) => {
	const [resourcesRes, recordRes] = await Promise.all([
		fetch('/api/resources'),
		fetch(`${PUBLIC_API_PATH}/${params.fnurgel}/data.jsonld`)
	]);

	const resources = preprocessResources(await resourcesRes.json());
	const { getItemLabel } = initDisplayUtil(resources, { language: 'sv' });
	const record = await recordRes.json();

	if (record.status_code === 404) {
		throw error(401, 'Not found');
	}

	return {
		title: record['@graph']?.[1].hasTitle
			? getItemLabel(record['@graph'][1].hasTitle[0])
			: 'Titel här'
	};
}) satisfies PageServerLoad;
