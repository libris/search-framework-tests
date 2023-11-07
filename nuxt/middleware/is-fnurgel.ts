import { getNumberOfVowels } from 'lxljs/string';

export default defineNuxtRouteMiddleware((to) => {
  if (getNumberOfVowels(to.params.fnurgel) > 0 && to.params.fnurgel.length < 14) {
    return abortNavigation()
  }
})