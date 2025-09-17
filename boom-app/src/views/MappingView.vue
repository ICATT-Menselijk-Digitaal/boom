<script setup lang="ts">
import MappingRow from '@/components/MappingRow.vue'
import { createMapping, fetchObjectTypeData } from '@/helpers'
import router from '@/router'
import {
  mapping,
  selectedObjectType,
  csvData,
  isMappingSaved,
  objectTypesMetaDataList,
  selectedObjectVersion,
  objectTypesVersionMetaDataList,
} from '@/store'
import { type ObjectTypeVersionMetaData } from '@/types'
import { computed, watch } from 'vue'

const isObjectSelected = computed(() => {
  return selectedObjectType.value !== undefined
})
watch(selectedObjectType, async () => {
  isMappingSaved.value = false
  fetchObjectVersions()
})
watch(selectedObjectVersion, () => {
  mapping.value = createMapping(selectedObjectVersion.value?.jsonSchema, csvData.value.headers)
})

/**
 * Handles the form submission
 * Navigates to the preview page and updates the navigation state.
 */
function submitHandler() {
  router.push('/preview')
  isMappingSaved.value = true
}

async function fetchObjectVersions() {
  objectTypesVersionMetaDataList.value = await Promise.all(
    selectedObjectType.value?.versions?.map((url) =>
      fetchObjectTypeData<ObjectTypeVersionMetaData>(url),
    ) ?? [],
  )
}
</script>

<template>
  <main class="flex column">
    <h1>Ok let's Map!</h1>
    <div class="flex column box">
      <h2>Select Object Type</h2>
      <p>Select an object type from the list below that you want to use.</p>
      <div class="flex row">
        <label for="selectObjectType">Object type</label>
        <select id="selectObjectType" v-model="selectedObjectType">
          <option
            v-for="objectType in objectTypesMetaDataList"
            :key="objectType.name"
            :value="objectType"
          >
            {{ objectType.name }}
          </option>
        </select>
        <label for="selectVersion">Version</label>
        <select id="selectVersion" v-model="selectedObjectVersion">
          <option
            v-for="version in objectTypesVersionMetaDataList"
            :key="version.version"
            :value="version"
          >
            {{ version.version }}
          </option>
        </select>
      </div>
    </div>
    <div v-if="isObjectSelected" class="flex column box">
      <h2>Map properties to header names</h2>
      <p>For each object type property, select the CSV header name that matches it.</p>
      <form id="mapping-form" class="flex column" @submit.prevent="submitHandler">
        <MappingRow
          v-for="(val, key) in selectedObjectVersion?.jsonSchema?.properties"
          :key="key"
          :objectTypePropertyName="key"
          :headerNames="csvData.headers"
          :required="selectedObjectVersion?.jsonSchema?.required?.includes(key)"
          v-model="mapping[key]"
        />
      </form>
    </div>
    <button v-if="isObjectSelected" type="submit" form="mapping-form">Save mapping</button>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
button {
  align-self: flex-start;
}
</style>
