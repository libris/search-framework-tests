<script setup>
import IconMenu from "~icons/mdi/menu";
import IconClose from "~icons/mdi/close";
import menuItems from "~/assets/json/menuItems.json";

const router = useRouter();

const clientRenderedMenuButton = ref(false); // Progressively replace anchor link to menu button on mount (when javascript is activated).
const expandedMenu = ref(false);

const props = defineProps({
  sticky: {
    type: Boolean,
    default: true,
  },
  withSearch: {
    type: Boolean,
    default: true,
  },
});

onMounted(() => {
  clientRenderedMenuButton.value = true;
});

router.afterEach(() => {
  expandedMenu.value = false;
});

function toggleMenu() {
  expandedMenu.value = !expandedMenu.value;
}
</script>

<template>
  <header
    :class="{
      'with-search': withSearch,
      'with-expanded-menu': expandedMenu,
      sticky,
    }"
  >
    <div class="logo">
      <NuxtLink href="/" title="Startsida">
        <img
          src="~/assets/img/libris_logotyp.gif"
          width="141"
          height="25"
          alt="Startsida"
        />
      </NuxtLink>
    </div>
    <nav class="menu" id="menu" v-if="expandedMenu">
      <ul>
        <li v-for="{ href, label } in menuItems" :key="href">
          <NuxtLink :to="href">{{ label }}</NuxtLink>
        </li>
      </ul>
    </nav>
    <div class="search" v-if="props.withSearch">
      <Search />
    </div>
    <div class="actions">
      <nav aria-label="Shortcuts">
        <ul>
          <li
            v-for="{ href, label } in menuItems.filter((item) => item.shortcut)"
            :key="href"
          >
            <NuxtLink :to="href">{{ label }}</NuxtLink>
          </li>
        </ul>
      </nav>
      <button
        class="menu-toggle"
        :aria-expanded="expandedMenu"
        aria-controls="menu"
        aria-label="Menu"
        @click="toggleMenu"
        v-if="clientRenderedMenuButton"
      >
        <IconClose width="24" height="24" v-if="expandedMenu" />
        <IconMenu width="24" height="24" v-else />
      </button>
      <a class="menu-toggle" href="#footer-menu" v-else>
        <IconMenu width="24" height="24" />
      </a>
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  display: grid;
  grid-template-areas: "logo actions";
  grid-template-columns: max-content auto;
  grid-auto-rows: var(--height-input);
  column-gap: var(--column-gap-header);
  row-gap: var(--row-gap-header);
  padding: var(--padding-header);
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 1px 0 var(--color-border);
}

.with-search {
  grid-template-areas:
    "logo actions"
    "search search";

  @media screen and (min-width: $layout-breakpoint-large) {
    grid-template-areas: "logo search actions";
    grid-template-columns: 1fr 2fr 1fr;
  }
}

.with-expanded-menu {
  grid-template-areas:
    "logo actions"
    "menu menu";
  grid-template-rows: var(--height-input) auto;

  .menu {
    display: flex;
  }

  @media screen and (min-width: $layout-breakpoint-large) {
    grid-template-areas: "logo actions";
    grid-template-rows: revert;

    .menu {
      display: none;
    }
  }
}

.with-search.with-expanded-menu {
  grid-template-areas:
    "logo actions"
    "menu menu";
  grid-template-rows: var(--height-input) auto;

  .search {
    display: none;
  }

  @media screen and (min-width: $layout-breakpoint-large) {
    grid-template-areas: "logo search actions";
    grid-template-rows: revert;

    .menu {
      display: none;
    }

    .search {
      display: grid;
    }
  }
}

.sticky {
  position: sticky;
  top: 0;
}

.logo {
  grid-area: logo;

  a {
    display: flex;
    align-items: center;
    width: fit-content;
    height: var(--height-input);
  }

  img {
    display: block;
    width: 112px;
    height: auto;
  }
}

.menu-toggle {
  width: var(--height-input);
  height: var(--height-input);
  font-size: inherit;
  cursor: pointer;
  padding: 0;
  color: inherit;
  background: none;
  border: none;

  @media screen and (min-width: $layout-breakpoint-large) {
    display: none;
  }
}

.menu {
  grid-area: menu;
  display: none;
  flex-direction: column;
}

.search {
  grid-area: search;

  @media screen and (min-width: $layout-breakpoint-large) {
    display: grid;
    grid-template-columns: minmax(auto, 640px);
    justify-content: center;
  }
}

.actions {
  grid-area: actions;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  white-space: nowrap;
  font-size: var(--font-size-smaller);
}

.actions ul {
  display: none;
  list-style-type: none;
  padding: 0;
  margin: 0;
  gap: 1rem;

  @media screen and (min-width: $layout-breakpoint-large) {
    display: flex;
  }
}

.menu ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.menu li {
  display: flex;
  align-items: center;
  height: var(--height-input);
}
</style>
