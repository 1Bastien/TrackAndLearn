<template>
  <component :is="to ? 'router-link' : 'button'" :to="to" class="inline-block">
    <slot></slot>
  </component>
</template>

<script setup>
  defineProps({
    to: {
      type: [String, Object],
      default: null,
    },
  })
</script>

<style scoped></style>
