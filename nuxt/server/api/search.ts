import type { FindResponse } from "@/types/findResponse";
import { preprocessResources } from "lxljs/vocab";
import { initDisplayUtil } from "lxljs/display";
import getFnurgelFromUri from "@/utils/getFnurgelFromUri";
import getRecordContributions from "@/utils/getRecordContributions";
import propertyChains from '@/assets/json/propertyChains.json';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const [resourcesRes, recordsRes] = await Promise.all([
    $fetch("/api/resources"),
    $fetch(`${process.env.PUBLIC_API_PATH}/find.jsonld`, { query }),
  ]);
  
  const records = recordsRes as FindResponse;
  const resources = preprocessResources(resourcesRes);
  const { getItemLabel } = initDisplayUtil(resources, { language: "sv" });

  const items = records.items.map((item) => ({
    id: item["@id"],
    fnurgel: getFnurgelFromUri(item["@id"]),
    title: getItemLabel(item.hasTitle?.[0]), // should we use chip here? Linking to contributors won't be possible if we only get strings in return...,
    contributions: getRecordContributions(item, resources),
    languages: item.language?.map((lang) => getItemLabel(lang)),
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
});
