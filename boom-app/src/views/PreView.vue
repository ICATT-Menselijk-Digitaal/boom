<script setup lang="ts">
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

/* ------------- HANDLER FUNCTIONS --------------- */

/**
 * Handles the accept button click.
 * Enters all the data into the database.
 * Changes the preview to show any errors.
 */
async function acceptHandler() {
  const newObjects: MappedRecord[] = convertDataToObjects(csvData.value, mapping.value)
  const searchResults: ObjectData[] | undefined = await searchObjectsByTypeVersion()

  if (searchResults) {
    postObjects(newObjects, searchResults)
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
      console.error(`Error converting record: ${error}`)
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
function postObjects(newObjects: MappedRecord[], searchResults: ObjectData[]) {
  for (const newObject of newObjects) {
    const isDuplicate = hasObject(newObject, searchResults)
    if (!isDuplicate) {
      postSingleObject(
        selectedObjectVersion.value?.objectType ?? '',
        selectedObjectVersion.value?.version ?? 0,
        newObject,
      )
        .then(() => entries.value.push(newObject))
        .catch(() => {
          errors.value.push(newObject)
        })
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
    type: convertToInternalDockerUrl(typeUrl).toString(),
    record: {
      typeVersion: version,
      data: properties,
      startAt: dateNow,
    },
  }
  return postRequest<ObjectCreateResponse>(body).then((res) => res.uuid)
}

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
function searchObjectsByTypeVersion(): Promise<ObjectData[] | undefined> {
  const typeUrl = selectedObjectVersion.value?.objectType ?? ''
  const version = selectedObjectVersion.value?.version ?? 0
  const body = {
    type: convertToInternalDockerUrl(typeUrl).toString(),
    typeVersion: version,
  }
  return postRequest<PaginatedSearchResponse>(body, '/search')
    .then((res) => res.results)
    .catch(() => undefined)
}

/**
 * Performs a POST request with standard headers used in all of the api POST requests used.
 * @param headers Headers object
 * @param body request body as a JSON object
 */
async function postRequest<T>(body: object, urlExtension = ''): Promise<T> {
  const headers: Headers = new Headers()
  headers.set('Content-Crs', 'EPSG:4326')
  headers.set('Content-Type', 'application/json')

  const request: RequestInfo = new Request(`/objects-api${urlExtension}`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  })
  return fetch(request).then((response) => {
    if (!response.ok) {
      return Promise.reject(new Error(`Error occured in the POST request ${response.statusText}`))
    }
    return response.json()
  })
}

/**
 * Converts a given url to the hostname of the objecttypes docker container.
 * This function is temporary to assist working with the docker test setup of the objects api.
 * @param _url The objecttypes url that needs to convert
 * @returns converted URL object
 */
function convertToInternalDockerUrl(_url: string): URL {
  const url: URL = new URL(_url)
  url.hostname = process.env.OBJECTTYPES_CONTAINER_URL
  url.port = process.env.OBJECTTYPES_CONTAINER_PORT
  return url
}
</script>

<template>
  <main class="flex column">
    <h1>Now let's preview!</h1>
    <div class="flex column box">
      <div class="flex column">
        <h2>Result of Mapping</h2>
        <p>
          Here you see the result of mapping the Object-type properties to the CSV header names:
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
      <h2>Entry preview</h2>

      <table>
        <caption>
          Here you see a preview of the mapping using the first row of the CSV data:
        </caption>
        <thead>
          <tr>
            <th
              v-for="(_, propertyName) in convertDataToObjects(csvData, mapping).at(0)"
              :key="propertyName"
            >
              {{ propertyName }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="value in convertDataToObjects(csvData, mapping).at(0)" :key="value">
              {{ value }}
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Satisfied?</h2>
      <p>
        If you are satisfied with the mapping, press accept to enter all the new objects into the
        database.
      </p>
    </div>
    <div v-if="isEntryDone" class="flex column box">
      <h2>Done!</h2>
      <p>{{ entries.length }} new entries have been succesfully completed!</p>
      <h2>Errors</h2>
      <p>{{ errors.length }} entries have run into an error</p>
    </div>
    <div class="flex row">
      <button v-if="!isEntryDone" @click="acceptHandler">Accept</button>
      <button @click="returnHandler">Return</button>
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
</style>
