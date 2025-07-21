<script setup lang="ts">
import { inject } from 'vue'

const csvData = inject('csvData')
</script>

<template>
  <h1>Observe that uploaded data!</h1>
  <div class="data-box">{{ csvData }}</div>
</template>

<style scoped>
h1 {
  text-align: center;
}
.data-box {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
