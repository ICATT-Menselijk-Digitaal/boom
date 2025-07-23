<script setup lang="ts">
import MappingComponent from '@/components/MappingComponent.vue'
</script>

<template>
  <main>
    <h1>Ok let's Map!</h1>
    <MappingComponent class="mapping-component" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
.mapping-component {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
