// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["unplugin-icons/nuxt"],
  nitro: {
    compressPublicAssets: true,
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "assets/css/variables.scss" as *;',
        },
      },
    },
  },
});
