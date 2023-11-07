import displayGroups from '@/assets/json/displayGroups.json';
import i18n from '@/assets/json/i18n.json';

/**
 * Groups the external API calls required for the LXLJS `resources` parameter
 * into a single response, which can be cached (depending on if the data is suitable for caching?).
 * Unique version hashes could maybe also be an alternative to allow longer cache max-ages?
 *
 * Further optimization can also be made using middlewares to hit the LibrisXL API
 * directly when server-side rendering using localhost (bypassing whatever proxies and load
 * balancers sit between it and the public internet).
 * See: https://nuxt.com/docs/guide/directory-structure/middleware
 */

export default defineEventHandler(async (event) => {
  const [context, vocab, display] = await Promise.all([
		$fetch(`${process.env.PUBLIC_ID_PATH}/context.jsonld`),
		$fetch(`${process.env.PUBLIC_ID_PATH}/vocab/data.jsonld`),
		$fetch(`${process.env.PUBLIC_ID_PATH}/vocab/display/data.jsonld`)
	]);

  return {
    context,
    vocab,
    display,
    displayGroups,
    i18n
  }
})