<script setup lang="ts">
const props = defineProps<{
  objectTypeName: string
  headerNames: string[]
}>()

const emits = defineEmits(['updateSelectedHeaderName'])

const selectedHeaderName = defineModel<string>({
  default: '',
  type: String,
})
</script>

<template>
  <div class="flex wrapper">
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
  flex-grow: 1;
  justify-content: space-between;
}
</style>
