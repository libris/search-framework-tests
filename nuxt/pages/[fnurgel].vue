<script setup lang="ts">
const route = useRoute()

const { data } = await useFetch(`/api/${route.params.fnurgel}`);

useHeadSafe({
  title: `${data.value.title} | Libris`,
  meta: [
    {
      name: "description",
      content: "This is where the description goes for SEO",
    },
  ],
});

definePageMeta({
  middleware: "is-fnurgel",
});
</script>

<template>
  <div class="record-page">
    <div class="record">
      <h1>{{data.title}}</h1>
      <div>Not much to see here yet...</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.record-page {
  padding: var(--padding-page);
}
@media screen and (min-width: $layout-breakpoint-large) {
  .record-page {
    display: grid;
    grid-template-areas: "record record .";
    grid-template-columns: 1fr 2fr 1fr;
  }

  .record {
    grid-area: record;
  }
}
</style>
