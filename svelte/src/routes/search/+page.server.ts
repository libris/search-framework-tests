import type { PageServerLoad } from './$types';
import type { FindResponse } from '$lib/types';
import { PUBLIC_API_PATH } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import getFnurgelFromUri from '$lib/utils/getFnurgelFromUri';
import getRecordContributions from '$lib/utils/getRecordContributions';
import propertyChains from '$lib/assets/json/propertyChains.json';
import { preprocessResources } from 'lxljs/vocab';
import { initDisplayUtil } from 'lxljs/display';

export const load = (async ({ fetch, url }) => {
	if (!url.searchParams.size) {
		throw redirect(303, `/`); // redirect to home page if no search params are given
	}

	const [resourcesRes, recordsRes] = await Promise.all([
		fetch('/api/resources'),
		fetch(`${PUBLIC_API_PATH}/find.jsonld?${url.searchParams.toString()}`)
	]);

	const resources = preprocessResources(await resourcesRes.json());
	const { getItemLabel } = initDisplayUtil(resources, { language: 'sv' });

	const records = (await recordsRes.json()) as FindResponse;

	const items = records.items.map((item) => ({
		id: item['@id'],
		fnurgel: getFnurgelFromUri(item['@id']),
		title: getItemLabel(item.hasTitle?.[0]), // should we use chip here? Linking to contributors won't be possible if we only get strings in return...,
		contributions: getRecordContributions(item, resources),
		languages: item.language?.map((lang) => getItemLabel(lang))
	}));

	const selectedFacets = records.search.mapping
		.filter((mapping) => mapping.variable !== 'q' && mapping.object?.['@id'] !== 'Work')
		.map((mapping) => {
			return {
				id: mapping.variable,
				label: mapping.value || getItemLabel(mapping?.object).replace('https://id.kb.se/', ''),
				groupLabel: mapping.variable, // TODO: language should'nt be hardcoded
				link: mapping?.up?.['@id'].replace('/find?', '/search?')
			};
		});

	const facetGroups = records?.stats
		? Object.keys(records.stats?.sliceByDimension).map((key) => {
				const group = records.stats?.sliceByDimension[key];
				return {
					id: group.dimension,
					label: propertyChains[group.dimension].sv,
					items: group.observation.map((observation) => {
						return {
							id: observation.view?.['@id'],
							label: getItemLabel(observation.object).replace('https://id.kb.se/', ''),
							link: observation.view?.['@id'].replace('/find?', '/search?'),
							totalItems: observation.totalItems
						};
					})
				};
		  })
		: [];

	return {
		items,
		totalItems: records.totalItems,
		offset: records.offset,
		selectedFacets,
		facetGroups
	};
}) satisfies PageServerLoad;
