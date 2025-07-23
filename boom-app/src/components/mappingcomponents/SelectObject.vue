<script setup lang="ts">
const objectTypes = ['Type 1', 'Type 2', 'Type 3'] // Example object types
</script>

<template>
  <label>Select object-type</label>
  <select name="objectType">
    <option v-for="type in objectTypes" :key="type" :value="type">
      {{ type }}
    </option>
  </select>
</template>
