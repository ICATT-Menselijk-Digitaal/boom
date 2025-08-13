<script setup lang="ts">
const props = defineProps<{
  objectNamesList: string[]
}>()
const selectedObjectType = defineModel()
// const selectedObjectType = ref<string>('') // Selected object type
</script>

<template>
  <div class="wrapper">
    <label for="selectObjectType">Select an object-type</label>
    <select id="selectObjectType" v-model="selectedObjectType">
      <option v-for="oType in props.objectNamesList" :key="oType">
        {{ oType }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: row;
}
label {
  margin-right: 1em;
}
</style>
