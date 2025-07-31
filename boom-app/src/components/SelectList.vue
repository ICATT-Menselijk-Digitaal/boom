<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  data: string[] | null
  title?: string | null
  mapping: Map<string, string>
}>()
const emit = defineEmits<{ (e: 'selectionChange', value: string): void }>()
const selectedItemName = ref<string>('')

function selectOption(selectedValue: string) {
  selectedItemName.value = selectedItemName.value === selectedValue ? '' : selectedValue
  emit('selectionChange', selectedItemName.value)
}
</script>
<template>
  <div class="wrapper">
    <h2>{{ title }}</h2>
    <ul>
      <li
        v-for="(itemName, index) in data"
        :key="index"
        :class="{ selected: selectedItemName === itemName }"
        :style="{
          backgroundColor: '',
        }"
        @click="selectOption(itemName)"
      >
        {{ itemName }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  margin: 0 1em;
  flex-grow: 1;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
ul li {
  padding: 10px 16px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}
ul li.selected {
  background: #d0ebff;
  font-weight: bold;
}
ul li:hover {
  background: #f1f3f5;
}
</style>
