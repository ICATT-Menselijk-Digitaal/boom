<script setup lang="ts">
const props = defineProps<{
  objectNamesList: string[]
}>()
const selectedObjectType = defineModel()
</script>

<template>
  <div class="wrapper">
    <label for="selectObjectType">Object type</label>
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
