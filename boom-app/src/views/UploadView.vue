<script setup lang="ts">
import UploadComponent from '../components/UploadComponent.vue'
</script>

<template>
  <main>
    <h1>Here comes the upload!</h1>
    <UploadComponent class="upload-component" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
.upload-component {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
