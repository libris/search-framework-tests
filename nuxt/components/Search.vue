<script setup lang="ts">
const url = useRequestURL();

const searchParams = computed(() =>
  Array.from(getSortedSearchParams(getDefaultSearchParams(url.searchParams)))
);

async function handleSubmit(e: Event) {
  const formData = new FormData((e as SubmitEvent).target as HTMLFormElement);
  const q = formData.get("q") as string;
  if (q && q.trim()) {
    await navigateTo({
      path: "/search",
      query: Object.fromEntries(formData) as { [k: string]: string }, // Note! the query option doesn't support duplicate keys or sorted keys, so we should rely on URLSearchParams when creating the path (however Nuxt doesn't seem to take notice of added path params when navigating so we probably need a work-around?)
    });
  }
}
</script>

<template>
  <form action="/search" @submit.prevent="handleSubmit">
    <input
      type="search"
      name="q"
      placeholder="Sök på författare, titel, ämne eller fria sökord"
      aria-label="Sök"
      spellcheck="false"
      :value="$route.query.q"
      autofocus
    />
    <input
      v-for="[name, value] in searchParams.filter((param) => param[0] !== 'q')"
      :key="name + value"
      type="hidden"
      :name="name"
      :value="value"
    />
  </form>
</template>

<style lang="scss" scoped>
form {
  display: flex;
  align-items: center;
  width: 100%;
}
input {
  width: 100%;
  min-height: var(--height-input);
  border: none;
  border-radius: 48px;
  padding: 0 1rem;
  font-size: inherit;
  box-shadow: 0 1px 1px rgba(112 112 112 / 0.12),
    0 1px 5px rgba(112 112 112 / 0.375);
}
</style>
