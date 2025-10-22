<script setup lang="ts">
import MappingRow from '@/components/MappingRow.vue'
import OverlayMessage from '@/components/OverlayMessage.vue'
import { fetchJSON, removeAllBefore } from '@/helpers'
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
import {
  type Mapping,
  type ObjectType,
  type ObjectTypeMetaData,
  type ObjectTypeVersionMetaData,
  type PaginateObjectTypeResponse,
} from '@/types'
import { computed, ref, watch } from 'vue'

const isLoading = ref<boolean>(false)
const errorMessage = ref<string>('')
const isObjectSelected = computed(() => {
  return selectedObjectType.value !== undefined
})
const isVersionSelected = computed(() => {
  return selectedObjectVersion.value !== undefined
})
// Fetch the list of objects types when page is loaded.
watch(
  router.currentRoute,
  async () => {
    objectTypesMetaDataList.value = await fetchObjectTypes()
  },
  { immediate: true },
)
// Fetch the verions as soon as an objecttype is selected.
watch(selectedObjectType, async () => {
  selectedObjectVersion.value = undefined
  isMappingSaved.value = false
  objectTypesVersionMetaDataList.value = await fetchObjectVersions()
})
// Create an automapping as soon as a version is selected
watch(selectedObjectVersion, () => {
  autoMapping.value = createMapping(selectedObjectVersion.value?.jsonSchema, csvData.value.headers)
})

/**
 * Create a mapping of property names to header names.
 * @param objectType ObjectType object to create a mapping on its properties or undefined.
 * @param headers string array of header names.
 * @returns A mapping of property names to header names.
 */
function createMapping(objectType: ObjectType | undefined, headers: string[]): Mapping {
  const mapping: Mapping = {}
  const propertyNames: string[] = Object.keys(objectType?.properties ?? [])
  for (const propertyName of propertyNames) {
    const headerName = headers.find(
      (headerName) => headerName.toLowerCase() === propertyName.toLowerCase(),
    )
    if (headerName) {
      mapping[propertyName] = headerName
    }
  }
  return mapping
}

/**
 * Handles the form submission
 * Creates the mapping based on the submitted form data.
 * Navigates to the preview page and updates the navigation state.
 */
function submitHandler(formEvent: Event) {
  mapping.value = setMappingFromFormData(formEvent)
  router.push('/preview')
  isMappingSaved.value = true
}

/**
 * Maps properties to selected header names supplied by the form event.
 * @param formEvent Event formEvent that carries the selected header names.
 * @returns A mapping from property to header name
 */
function setMappingFromFormData(formEvent: Event): Mapping {
  const mapping: Mapping = {}
  if (formEvent.target instanceof HTMLFormElement) {
    const formData = new FormData(formEvent.target)
    for (const [key, value] of formData) {
      if (typeof value === 'string' && value !== '') {
        mapping[key] = value as string
      }
    }
  }
  return mapping
}

/**
 * Fetches the list of ObjectTypes
 */
async function fetchObjectTypes(): Promise<ObjectTypeMetaData[]> {
  isLoading.value = true
  try {
    const response = await fetch('/objecttypes')
    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`)
    }
    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      throw new Error('Incorrect content type in response of ObjectTypes API call')
    }
    const responseContent = (await response.json()) as PaginateObjectTypeResponse
    return responseContent.results
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = `Fetching the objecttypes from the server failed with the message: ${error.message}`
    }
  } finally {
    isLoading.value = false
  }
  return []
}

/**
 * Fetch all version meta data.
 * @returns A Promise with a list of ObjectType version meta data
 */
async function fetchObjectVersions(): Promise<ObjectTypeVersionMetaData[]> {
  const versionURLs = selectedObjectType.value?.versions ?? []
  const fetchResponses = []
  // fetch the data for all versions
  for (const url of versionURLs) {
    try {
      const response = await fetchJSON<ObjectTypeVersionMetaData>(
        removeAllBefore('objecttypes', url),
      )
      fetchResponses.push(response)
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = `Fetching the objecttypes from the server failed with the message: ${error.message}`
      }
    }
  }
  return Promise.resolve(fetchResponses)
}
</script>

<template>
  <main class="flex column">
    <h1>Ok let's Map!</h1>
    <div v-if="isLoading && !errorMessage" class="flex column box">
      <OverlayMessage :text="'Loading objecttype data. Please wait...'" :useSpinner="true" />
    </div>
    <div v-if="!isLoading && errorMessage" class="flex column box">
      <h2 class="error">An error occured</h2>
      <p>{{ errorMessage }}</p>
    </div>
    <div
      v-if="!isLoading && !errorMessage && objectTypesMetaDataList.length > 0"
      class="flex column box"
    >
      <h2>Select Object Type</h2>
      <p>Select an object type from the list below that you want to use.</p>
      <div class="flex row">
        <label for="selectObjectType">Object type:</label>
        <select id="selectObjectType" v-model="selectedObjectType">
          <option
            v-for="objectType in objectTypesMetaDataList"
            :key="objectType.name"
            :value="objectType"
          >
            {{ objectType.name }}
          </option>
        </select>
        <label for="selectVersion">Version:</label>
        <select :disabled="!isObjectSelected" id="selectVersion" v-model="selectedObjectVersion">
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
    <div v-if="isVersionSelected" class="flex column box">
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
    <button v-if="isVersionSelected" type="submit" form="mapping-form">Confirm mapping</button>
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
