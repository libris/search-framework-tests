import type { FindResponse } from "@/types/findResponse";
import { preprocessResources } from "lxljs/vocab";
import { initDisplayUtil } from "lxljs/display";

export default defineEventHandler(async (event) => {
  const fnurgel = getRouterParam(event, 'fnurgel')
  const [resourcesRes, record] = await Promise.all([
    $fetch("/api/resources"),
    $fetch(`${process.env.PUBLIC_API_PATH}/${fnurgel}/data.jsonld`),
  ]);

  const resources = preprocessResources(await resourcesRes);
  const { getItemLabel } = initDisplayUtil(resources, { language: "sv" });

  if (record.status_code === 404) {
    throw createError({ statusCode: 401, statusMessage: "Not Found" });
  }

  return {
    title: record["@graph"]?.[1].hasTitle
      ? getItemLabel(record["@graph"][1].hasTitle[0])
      : "Titel här",
  };
});
