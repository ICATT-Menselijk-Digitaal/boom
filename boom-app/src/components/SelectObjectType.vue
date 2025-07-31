<script setup lang="ts">
import { ref } from 'vue'

defineEmits(['selectionChange'])
const props = defineProps<{
  objectList: string[]
}>()
const selectedObjectType = ref<string>('') // Selected object type
</script>

<template>
  <div class="wrapper">
    <h2>Select Object Type</h2>
    <label for="selectObjectType">Select an object-type</label>
    <select
      id="selectObjectType"
      v-model="selectedObjectType"
      :change="$emit('selectionChange', selectedObjectType)"
    >
      <option v-for="oType in props.objectList" :key="oType">
        {{ oType }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
}
.object-display-box {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-height: 10em;
}
</style>
