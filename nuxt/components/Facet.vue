<script setup lang="ts">
import IconClose from "~icons/mdi/close";

const props = defineProps({
  label: {
    type: String,
  },
  deletable: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String,
  },
});
</script>

<template>
  <span class="facet" :class="deletable">
    <NuxtLink :href="link" v-if="link">
      <div class="label">
        {{ label }}
      </div>
      <IconClose class="icon" v-if="deletable" />
    </NuxtLink>
    <div class="label" v-else>{{ label }}</div>
  </span>
</template>

<style lang="scss" scoped>
.facet {
  display: inline-flex;
  background: hsla(188, 95%, 25%, 0.125);
  border: 1px solid hsla(188, 95%, 25%, 1);
  border-radius: 44px;
  padding: 0.25rem 0.5rem;
  font-size: var(--font-size-smaller);
}

a {
  display: flex;
  align-items: center;
  flex: 1;
}

a:hover {
  text-decoration: none;
}
.label {
  display: inline-flex;
}
.label::first-letter {
  text-transform: uppercase;
}

:global(.icon) {
  margin-left: 0.25rem;
}
</style>
