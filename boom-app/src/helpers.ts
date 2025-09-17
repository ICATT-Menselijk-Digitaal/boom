import { objectTypesMetaDataList } from './store'
import {
  type CsvOutput,
  type CsvRecord,
  type Mapping,
  type ObjectType,
  type PaginatedObjectTypeList,
} from './types'

/**
 * Create a mapping of property names to header names.
 * @param objectType ObjectType object to create a mapping on its properties or undefined.
 * @param headers string array of header names.
 * @returns A mapping of property names to header names.
 */
export function createMapping(objectType: ObjectType | undefined, headers: string[]): Mapping {
  const mapping: Mapping = {}
  const propertyNames: string[] = Object.keys(objectType?.properties ?? [])
  console.log(propertyNames)
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

// -- Data conversion functions --

/**
 * Convert all CSV data to objects based on the current mapping.
 */
export function convertDataToObjects(csvData: CsvOutput, mapping: Mapping) {
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
function convertRecordToObject(record: CsvRecord, mapping: Mapping) {
  const propertiesObject: Record<string, string> = {}
  for (const [property, headerName] of Object.entries(mapping)) {
    try {
      validateObject(record, headerName)
      propertiesObject[property] = record[headerName]
    } catch (error) {
      console.error(`Error converting record: ${error}`)
    }
  }
  return propertiesObject
}

/**
 * Function that validates a cell in a record.
 * @param record CsvRecord
 * @param headerName String representing the header name of the cell to validate.
 * @returns boolean indicating if the cell value is valid.
 */
function validateObject(record: CsvRecord, headerName: string) {
  // Any future validation checks can be added here.
  if (typeof record[headerName] !== 'string') {
    throw new Error(`Value for header "${headerName}" is not a string.`)
  }
}

// -- Objecttype API functions --

/**
 * Fetches the list of ObjectTypes,
 * then the latest version of each ObjectType,
 * and pushes the JSON schema of each ObjectType to the objectTypesList variable in the store.
 */
export async function fetchObjectTypes() {
  fetchObjectTypeData<PaginatedObjectTypeList>('/objecttypes')
    .then((objectTypeList) => {
      objectTypesMetaDataList.value = objectTypeList.results
    })
    .catch((error) => console.error(`Error during fetching of the list of ObjectTypes${error}`))
}

/**
 * A generic function to fetch data from the ObjectTypes API.
 * Returns a promised with the provided type.
 * @param url string URL to the ObjectTypes API endpoint. The URL will be rewritten to redirect to the backend endpoint.
 * @returns Promise<T> with the fetched data.
 */
export async function fetchObjectTypeData<T>(url: string): Promise<T> {
  return fetch(reconstructApiURL(url)).then((response) => response.json() as Promise<T>)
}

/**
 * Changes the given URL to redirect to the backend endpoint.
 * @param url URL to change
 * @returns A URL that redirects to the backend endpoint.
 */
function reconstructApiURL(_url: string): string {
  return _url.replace(/.*(?=\/objecttypes)/, '/objecttypes-api')
}
