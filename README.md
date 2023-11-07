# search-framework-tests

A repo containing the same Libris Search test app (using a proxy API) implemented in two different meta.frameworks: [Nuxt3](https://nuxt.com/) and [SvelteKit](https://kit.svelte.dev/).

The functionality should be more or less the same in both the implementations (currently the Nuxt app doesn't support duplicate URL search params as `ofetch` which Nuxt relies upon has no support for it – so we need a workaround).


## Build and preview apps
Change directory to `nuxt` or `svelte`

Add a `.env` file in the same folder (see `.env.example` for reference).

Then run `npm install && npm run build`
followed with `npm run preview`

Or start development server with `npm run dev`
