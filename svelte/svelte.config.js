import adapter from '@sveltejs/adapter-node';
import sveltePreprocess from 'svelte-preprocess';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sveltePreprocess({
			scss: {
				prependData: `@use '${join(__dirname, 'src/variables.scss').replace(/\\/g, '/')}' as *;`
			},
	}),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	},
	vitePlugin: {
		inspector: {
			holdMode: true,
			toggleKeyCombo: 'meta-shift',
		}
	}
};

export default config;
