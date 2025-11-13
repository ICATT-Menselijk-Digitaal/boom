<script setup lang="ts">
import SimpleSpinner from '@/components/SimpleSpinner.vue'
import router from '@/router'
import {
  csvData,
  isMappingSaved,
  isEntryDone,
  mapping,
  selectedObjectVersion,
  errors,
  entries,
} from '@/store'
import type {
  PaginatedSearchResponse,
  CsvOutput,
  CsvRecord,
  MappedRecord,
  Mapping,
  ObjectData,
  ObjectCreateResponse,
} from '@/types'
import { ref } from 'vue'

const isLoading = ref<boolean>(false)
const errorMessage = ref<string>()
const showErrorDialog = ref<boolean>(false)
const currentErrorMessage = ref<string>('')
const errorDialogResolve = ref<((value: boolean) => void) | null>(null)

/* ------------- HANDLER FUNCTIONS --------------- */

/**
 * Shows an error dialog to the user with options to continue or stop.
 * @param message The error message to display
 * @returns Promise that resolves to true if user wants to continue, false otherwise
 */
function showErrorDialogToUser(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    currentErrorMessage.value = message
    showErrorDialog.value = true
    errorDialogResolve.value = resolve
  })
}

/**
 * Handles the user's decision to continue after an error.
 */
function handleContinue() {
  showErrorDialog.value = false
  if (errorDialogResolve.value) {
    errorDialogResolve.value(true)
    errorDialogResolve.value = null
  }
}

/**
 * Handles the user's decision to stop after an error.
 */
function handleStop() {
  showErrorDialog.value = false
  if (errorDialogResolve.value) {
    errorDialogResolve.value(false)
    errorDialogResolve.value = null
  }
}

/**
 * Handles the accept button click.
 * Enters all the data into the database.
 * Changes the preview to show any errors.
 */
async function acceptHandler() {
  isLoading.value = true
  const newObjects: MappedRecord[] = convertDataToObjects(csvData.value, mapping.value)
  try {
    const searchResults: ObjectData[] = await searchObjectsByTypeVersion()
    if (searchResults) {
      await postObjects(newObjects, searchResults)
    } else {
      throw new Error('Unable to search through objects.')
    }
  } catch (error) {
    errorMessage.value = 'Entering objects into the registry failed with the following message: '
    if (error instanceof Error) {
      errorMessage.value = errorMessage.value.concat(error.message)
    }
  } finally {
    isLoading.value = false
  }
}

/**
 * Handles the return button click
 * Navigates back to the mapping page and resets states so the mapping can be changed.
 */
function returnHandler() {
  router.push('/mapping')
  isMappingSaved.value = false
  mapping.value = {}
  isEntryDone.value = false
  errors.value = []
  entries.value = []
}

/* ------------- CONVERSION FUNCTIONS --------------- */

/**
 * Convert all CSV data to objects based on the current mapping.
 * @returns A list of converted records.
 */
function convertDataToObjects(csvData: CsvOutput, mapping: Mapping): MappedRecord[] {
  const mappedRecord: CsvRecord[] = []
  for (const dataRecord of csvData.data) {
    mappedRecord.push(convertRecordToObject(dataRecord, mapping))
  }
  return mappedRecord
}

/**
 * Validates and converts a CSV record to an object based on the current mapping.
 * @param record Record<string, string> representing a CSV record.
 * @returns A mapped object from the CSV record.
 */
function convertRecordToObject(record: CsvRecord, mapping: Mapping): MappedRecord {
  const propertiesObject: MappedRecord = {}
  for (const [propertyName, headerName] of Object.entries(mapping)) {
    try {
      validateObject(record, headerName)
      propertiesObject[propertyName] = record[headerName]
    } catch (error) {
      errorMessage.value = 'Error converting record.'
      if (error instanceof Error) {
        errorMessage.value = errorMessage.value.concat(error.message)
      }
    }
  }
  return propertiesObject
}

/**
 * Function that validates a cell in a record.
 * Throws an Error if the validation is not passed.
 * @param record CsvRecord
 * @param headerName String representing the header name of the cell to validate.
 */
function validateObject(record: CsvRecord, headerName: string) {
  // Any future validation checks can be added here.
  if (!['string', 'number'].includes(typeof record[headerName])) {
    throw new Error(`Value for header "${headerName}" is not a string or number.`)
  }
}

/* ------------- OBJECT CREATION FUNCTIONS --------------- */

/**
 * Posts all objects to the objects-api.
 * Checks if object already exists before entry.
 * @param newObjects The objects to be posted
 * @param searchResults The objects that are already in the database that have the same type/version
 */
async function postObjects(newObjects: MappedRecord[], searchResults: ObjectData[]) {
  let shouldContinue = true

  for (const newObject of newObjects) {
    if (!shouldContinue) {
      break
    }

    const isDuplicate = hasObject(newObject, searchResults)
    if (!isDuplicate) {
      try {
        await postSingleObject(
          selectedObjectVersion.value?.objectType ?? '',
          selectedObjectVersion.value?.version ?? 0,
          newObject,
        )
        entries.value.push(newObject)
      } catch (error) {
        errors.value.push(newObject)

        // Determine error message
        let errorMsg = 'An error occured during entry of the following object:\n\n'
        errorMsg += `Object: ${JSON.stringify(newObject)}\n\n`
        if (error instanceof Error) {
          errorMsg += `Error message: ${error.message}`
        }

        // Show error dialog and wait for user decision
        shouldContinue = await showErrorDialogToUser(errorMsg)
      }
    }
  }
  isEntryDone.value = true
}

/**
 * Performs a POST request to enter a new object based on the given arguments.
 * @param typeUri url matching the selected type
 * @param version version matching the selected type version
 * @param properties the properties that are needed to create the new object
 * @returns A promise of the POST response
 */
function postSingleObject(typeUrl: string, version: number, properties: MappedRecord) {
  const dateNow = new Date(Date.now()).toISOString().split('T')?.at(0) ?? '2025-01-01'

  const body = {
    type: typeUrl,
    record: {
      typeVersion: version,
      data: properties,
      startAt: dateNow,
    },
  }
  return postRequest<ObjectCreateResponse>(body)
}

/* ------------- OBJECT SEARCH FUNCTIONS --------------- */

/**
 * Determines if the provided search results has any object that matches the provided mapped object.
 * All properties have to be the same for the function to return true.
 * @param mappedObject An object based on the mapping
 * @param searchResults Search results returned from the server
 */
function hasObject(mappedObject: MappedRecord, searchResults: ObjectData[]): boolean {
  for (const existingObject of searchResults) {
    let hasObject: boolean = true
    for (const [property, value] of Object.entries(existingObject.record.data)) {
      hasObject = mappedObject[property] !== undefined && value === mappedObject[property]
    }
    if (hasObject) {
      return true
    }
  }
  return false
}

/**
 * Do a POST request that searches for all objects that match the selected objecttype and version.
 */
function searchObjectsByTypeVersion(): Promise<ObjectData[]> {
  const typeUrl = selectedObjectVersion.value?.objectType ?? ''
  const version = selectedObjectVersion.value?.version ?? 0
  const body = {
    type: typeUrl,
    typeVersion: version,
  }
  return postRequest<PaginatedSearchResponse>(body, '/search').then((res) => res.results)
}

/**
 * Performs a POST request with standard headers used in all of the api POST requests.
 * @param headers Headers object
 * @param body request body as a JSON object
 */
async function postRequest<T>(body: object, urlExtension = ''): Promise<T> {
  const request: RequestInfo = new Request(`/objects${urlExtension}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  try {
    const response = await fetch(request)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError('Response is not in the right JSON format')
    }
    return response.json()
  } catch (error) {
    throw error
  }
}
</script>

<template>
  <main class="flex column">
    <!-- Error Dialog Modal -->
    <div v-if="showErrorDialog" class="modal-overlay">
      <div class="modal-content">
        <h2 class="error">An error has occured</h2>
        <p>{{ currentErrorMessage }}</p>
        <div class="modal-actions">
          <button @click="handleStop" class="btn-stop">Stop</button>
          <button @click="handleContinue" class="btn-continue">Continue</button>
        </div>
      </div>
    </div>

    <div class="flex row space-between">
      <h1>Check your mapping</h1>
      <SimpleSpinner v-if="isLoading" class="spinner" />
    </div>
    <!-- Error feedback box -->
    <div v-if="errorMessage" class="flex column">
      <div class="flex column box">
        <h2 class="error">An error occured</h2>
        <p>{{ errorMessage }}</p>
      </div>
      <button @click="returnHandler">Return</button>
    </div>
    <div v-if="!isEntryDone && !errorMessage" class="flex column">
      <!-- Result box -->
      <div class="flex column box">
        <h2>Result of your Mapping</h2>
        <p>
          Here you see the result of mapping the CSV header names to the Object-type properties:
        </p>
        <table>
          <thead>
            <tr>
              <th>Header name</th>
              <th>maps to</th>
              <th>Property name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(propertyName, headerName) in mapping" :key="headerName">
              <td>{{ headerName }}</td>
              <td>-</td>
              <td>{{ propertyName }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Preview box -->
      <div v-if="!isEntryDone && !errorMessage" class="flex column box">
        <h2>Preview of a new object</h2>
        <caption>
          Here you see a preview of how the first row of the CSV data will be inserted as a new
          object:
        </caption>
        <h3>New object</h3>
        <ul>
          <li
            v-for="(propertyValue, propertyName) in convertDataToObjects(csvData, mapping).at(0)"
            :key="propertyName"
          >
            {{ propertyName }}: {{ propertyValue }}
          </li>
        </ul>
      </div>
      <div v-if="!isEntryDone && !errorMessage" class="flex column">
        <h2>Satisfied?</h2>
        <p>
          If you are satisfied with the mapping, press <b>Accept</b> below to insert all the data as
          new objects into the database.
        </p>
      </div>
    </div>
    <div v-if="isEntryDone && !errorMessage" class="flex column box">
      <h2>Done!</h2>
      <p>{{ entries.length }} new entries have been succesfully completed!</p>
      <h2>Errors</h2>
      <p>{{ errors.length }} entries have run into an error</p>
    </div>
    <div v-if="!errorMessage" class="flex row">
      <button v-if="!isEntryDone" :disabled="isLoading" @click="acceptHandler">Accept</button>
      <button :disabled="isLoading" @click="returnHandler">Return</button>
    </div>
  </main>
</template>

<style scoped>
table {
  width: 100%;
  column-span: all;
  max-width: 600px;
}

caption {
  text-align: start;
}

th {
  font-size: large;
  text-align: start;
}
.spinner {
  width: 1.5rem;
  height: 1.5rem;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  color: black;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
  margin-top: 0;
}

.modal-content p {
  word-wrap: break-word;
  margin: 1rem 0;
  white-space: pre-line;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-stop {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-stop:hover {
  background-color: #c82333;
}

.btn-continue {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-continue:hover {
  background-color: #218838;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .modal-content {
    background-color: #2d2d2d;
    color: #f0f0f0;
  }

  .modal-content h2.error {
    color: #ff6b6b;
  }
}
</style>
