<script setup lang="ts">
import type { FindResponse } from '~/types/findResponse';
const route = useRoute()
const query = computed(() => route.query);

const { data } = await useFetch<FindResponse>(`/api/search`, { query });

useHeadSafe({
  title: `${query.value.q} | Libris`,
  meta: [
    {
      name: "description",
      content: "This is where the description goes for SEO",
    },
  ],
});

definePageMeta({
  middleware: [
    function (to) {
      if (!Object.keys(to.query).length) {
        return navigateTo("/", { redirectCode: 303 }); // redirect to home page if no search params are given
      }
    },
  ],
});
</script>

<template>
  <main class="search-page">
    <div class="results">
      <h1 class="results-title">Sökresultat för: {{ query.q }}</h1>
      <p class="results-count">
        <strong>{{ data?.totalItems }}</strong> träffar
      </p>
      <ul class="results-list" v-if="data?.items">
        <li class="results-list-item" v-for="item in data.items" :key="item.id">
          <NuxtLink :to="item.fnurgel">
            <h2>{{ item.title }}</h2>
          </NuxtLink>
          <ul
            class="contributions"
            v-if="item.contributions"
            v-for="contribution in item.contributions"
          >
            <li :key="contribution.agent">
              <NuxtLink :to="contribution.fnurgel">
                {{ contribution.agent }}</NuxtLink
              >
              <template v-if="contribution.role">
                •
                <span>
                  {{
                    Array.isArray(contribution.role)
                      ? contribution.role.join(", ")
                      : contribution.role
                  }}
                </span>
              </template>
            </li>
          </ul>
          <div class="language" v-if="item.languages">
            {{ item.languages.join(", ") }}
          </div>
        </li>
      </ul>
      <div>Visar 1-10 av {{ data.totalItems }} träffar</div>
    </div>
    <aside class="filters">
      <header
        class="filters-header"
        v-if="data?.facetGroups && data.selectedFacets"
      >
        <h2 class="filters-title">Förfina urvalet</h2>
        <ul class="selected-facets" v-for="facet in data.selectedFacets">
          <li :key="facet.link">
            <Facet deletable :label="facet.label" :link="facet.link" />
          </li>
        </ul>
      </header>
      <ul class="facet-groups" v-if="data.facetGroups">
        <li v-for="facetGroup in data?.facetGroups">
          <FacetGroup :data="facetGroup" />
        </li>
      </ul>
    </aside>
  </main>
</template>

<style lang="scss" scoped>
.filters {
  grid-area: filters;
  display: none;
  flex-direction: column;
  min-width: 0;
  position: sticky;
  top: var(--height-header);
  height: calc(100vh - var(--height-header));
  overflow-y: scroll;

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
}

.results {
  grid-area: results;
  padding: var(--padding-page);
  min-height: 100vh;
  min-width: 0;
}

.results-list {
  list-style-type: none;
  padding: 0;
  background: #fff;
  overflow: hidden;
  border-radius: 5px;
  border: 1px solid var(--color-border);
}

.results-list-item {
  padding: var(--padding-page);
  border-bottom: 1px solid var(--color-border);
  & h2 {
    font-size: inherit;
    margin: 0 0 0.25rem 0;
  }

  & .contributions {
    font-size: var(--font-size-small);
  }

  & .language {
    font-size: var(--font-size-small);
  }
}
.results-title {
  font-size: inherit;
  font-weight: inherit;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.filters-header {
  position: sticky;
  top: 0;
  background: var(--color-background);
  padding: var(--padding-page) var(--padding-page) calc(var(--padding-page) / 2)
    var(--padding-page);
  z-index: 1;
}

.filters-title {
  font-size: inherit;
  font-weight: inherit;
  position: sticky;
  top: 0;
}

.selected-facets li {
  margin-bottom: 0.25rem;
}

.results-count {
  margin: 0;
  font-size: var(--font-size-small);
}

.contributions {
  list-style-type: none;
  padding: 0;
}
@media screen and (min-width: $layout-breakpoint-large) {
  .search-page {
    display: grid;
    grid-template-areas: "filters results .";
    grid-template-columns: 1fr 2fr 1fr;
  }

  .filters {
    display: flex;
    min-width: 0;
  }

  .results {
    width: 100%;
    max-width: 960px;
    box-sizing: border-box;
    margin: 0 auto;
  }
}
</style>
