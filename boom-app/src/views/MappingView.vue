<script setup lang="ts">
import MappingRow from '@/components/MappingRow.vue'
import { createMapping, fetchObjectTypeData, fetchObjectTypes } from '@/helpers'
import router from '@/router'
import {
  selectedObjectType,
  csvData,
  isMappingSaved,
  objectTypesMetaDataList,
  selectedObjectVersion,
  objectTypesVersionMetaDataList,
  autoMapping,
  mapping,
} from '@/store'
import { type ObjectTypeVersionMetaData } from '@/types'
import { computed, watch } from 'vue'

fetchObjectTypes()

const isObjectSelected = computed(() => {
  return selectedObjectType.value !== undefined
})
watch(selectedObjectType, async () => {
  selectedObjectVersion.value = undefined
  isMappingSaved.value = false
  fetchObjectVersions()
})
watch(selectedObjectVersion, () => {
  autoMapping.value = createMapping(selectedObjectVersion.value?.jsonSchema, csvData.value.headers)
})

/**
 * Handles the form submission
 * Creates the mapping based on the submitted form data.
 * Navigates to the preview page and updates the navigation state.
 */
function submitHandler(formEvent: Event) {
  setMappingFromFormData(formEvent)
  router.push('/preview')
  isMappingSaved.value = true
}

/**
 * Maps properties to selected header names supplied by the form event.
 * @param formEvent Event formEvent that carries the selected header names.
 */
function setMappingFromFormData(formEvent: Event) {
  mapping.value = {}
  const formData = new FormData(formEvent.target as HTMLFormElement)
  for (const [key, value] of formData) {
    if (typeof value === 'string' && value !== '') {
      mapping.value[key] = value as string
    }
  }
}

/**
 * Fetch all version meta data.
 */
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
          v-model="autoMapping[key]"
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
