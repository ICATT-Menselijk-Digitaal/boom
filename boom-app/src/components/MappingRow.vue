<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  objectTypeName: String,
  headerNames: Array<string>,
})

const emits = defineEmits(['updateSelectedHeaderName'])

const selectedHeaderName = ref()

// Performs a simple automatic mapping based on string equality between the object type name and header names.
watch(
  () => props.objectTypeName,
  (newValue) => {
    selectedHeaderName.value =
      props.headerNames?.find((headerName) => headerName === newValue) ?? ''
    emits('updateSelectedHeaderName', props.objectTypeName, selectedHeaderName.value)
  },
  { immediate: true },
)
</script>

<template>
  <div class="wrapper">
    <label>Object type field:</label>
    <i class="green">{{ props.objectTypeName }}</i>
    <div>
      <label for="headerSelect">maps to -></label>
      <select
        @change="emits('updateSelectedHeaderName', props.objectTypeName, selectedHeaderName)"
        v-model="selectedHeaderName"
        id="headerSelect"
      >
        <option selected="true" value="">No mapping</option>
        <option v-for="name in headerNames" :key="name" :value="name">
          {{ name }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
}
label {
  margin-right: 1em;
}
</style>
