<script setup lang="ts">
const props = defineProps<{
  objectTypePropertyName: string
  headerNames: string[]
  required?: boolean
}>()

const emits = defineEmits(['updateSelectedHeaderName'])

const selectedHeaderName = defineModel<string>({
  default: '',
  type: String,
})
</script>

<template>
  <div class="flex wrapper">
    <label :for="props.objectTypePropertyName"
      >Object type property
      <i class="green">{{ props.objectTypePropertyName }}</i>
      maps to: <i>{{ required ? '(required)' : '' }}</i>
    </label>
    <select
      @change="emits('updateSelectedHeaderName', props.objectTypePropertyName, selectedHeaderName)"
      v-model="selectedHeaderName"
      :id="props.objectTypePropertyName"
      :required="props.required || false"
    >
      <option selected :disabled="props.required" value=""></option>
      <option v-for="name in headerNames" :key="name" :value="name">
        {{ name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.wrapper {
  flex-grow: 1;
  justify-content: space-between;
}
</style>
