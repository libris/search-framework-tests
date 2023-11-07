<script setup lang="ts">
import IconChevronRight from "~icons/mdi/chevron-right";
const props = defineProps({
  data: {
    type: Object,
    default: true,
  },
});
</script>

<template>
  <details>
    <summary>
      <IconChevronRight class="arrow" />
      {{ props.data.label }}
    </summary>
    <ul>
      <li v-for="item in props.data.items" :key="item.id">
        <NuxtLink :to="item.link">
          <div class="label">{{ item.label }}</div>
          <div class="count">{{ item.totalItems }}</div>
        </NuxtLink>
      </li>
    </ul>
  </details>
</template>

<style lang="scss" scoped>
details {
  display: flex;
  flex-direction: column;
  font-size: var(--font-size-smaller);
  overflow: hidden;

  :global(.arrow) {
    margin-left: -0.5rem;
  }

  &[open] {
    summary {
      color: #000;

      :global(.arrow) {
        transform: rotate(90deg);
      }

      &:hover {
        color: var(--color-link);
      }
    }
  }
}

summary {
  display: flex;
  align-items: center;
  min-height: 36px;
  cursor: pointer;
  padding: 0 var(--padding-page);
  font-size: var(--font-size-small);
  color: #666;

  &:hover {
    color: var(--color-link);
    background: rgb(234, 245, 246);
  }
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  position: relative;
  &::before {
    position: absolute;
    content: "";
    height: 100%;
    left: var(--padding-page);
    border-right: 1px solid #ccc;
    display: block;
  }
}

a {
  display: flex;
  align-items: center;
  padding: 0 var(--padding-page) 0 calc(var(--padding-page) * 1.5);
  min-height: 32px;
  color: #666;
  cursor: pointer;
}

a:hover {
  color: var(--color-link);
  background: rgb(234, 245, 246);
  text-decoration: none;
}

.label {
  display: inline-flex;
  border-radius: 44px;
  padding: 0.25rem 0.5rem;
  border: 1px solid transparent;
}

.count {
  margin-left: auto;
  font-size: 10px;
}

.label::first-letter {
  text-transform: uppercase;
}

a:hover .label {
  background: hsla(188, 95%, 25%, 0.125);
  border: 1px solid hsla(188, 95%, 25%, 1);
}
</style>
