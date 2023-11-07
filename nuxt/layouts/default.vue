<script setup>
import "~/assets/css/styles.scss";
const route = useRoute()
const home = computed(() => route.path === "/");
</script>

<template>
  <Header :withSearch="!home" :sticky="!home" />
  <slot />
</template>
