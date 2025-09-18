import { type CsvOutput, type CsvRecord, type Mapping, type ObjectType } from './types'

/**
 * Create a mapping of property names to header names.
 * @param objectType ObjectType object to create a mapping on its properties or undefined.
 * @param headers string array of header names.
 * @returns A mapping of property names to header names.
 */
export function createMapping(objectType: ObjectType | undefined, headers: string[]): Mapping {
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

// -- Data conversion functions --

/**
 * Convert all CSV data to objects based on the current mapping.
 * @returns A list of converted records.
 */
export function convertDataToObjects(csvData: CsvOutput, mapping: Mapping): CsvRecord[] {
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
function convertRecordToObject(record: CsvRecord, mapping: Mapping): Record<string, string> {
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
 * Throws an Error if the validation is not passed.
 * @param record CsvRecord
 * @param headerName String representing the header name of the cell to validate.
 */
function validateObject(record: CsvRecord, headerName: string) {
  // Any future validation checks can be added here.
  if (typeof record[headerName] !== 'string') {
    throw new Error(`Value for header "${headerName}" is not a string.`)
  }
}

// -- Objecttype API functions --

/**
 * A generic function to fetch data from the ObjectTypes API.
 * Returns a promised with the provided type.
 * @param url string URL to the ObjectTypes API endpoint. The URL will be rewritten to redirect to the backend endpoint.
 * @returns Promise<T> with the fetched data.
 */
export async function fetchObjectTypeData<T>(url: string): Promise<T> {
  return fetch(reconstructApiURL(url, '/objecttypes', '/objecttypes-api')).then(
    (response) => response.json() as Promise<T>,
  )
}

/**
 * Changes the given URL to redirect to the backend endpoint.
 * @param url URL to change.
 * @param replaceKeyword everything up to and including this keyword will be replaced. Example '/objecttypes'
 * @param localKeyword the local api keyword the replace in the URL. Example '/objecttypes-api'
 * @returns A URL that redirects to the backend endpoint.
 */
function reconstructApiURL(_url: string, replaceKeyword: string, localKeyword: string): string {
  return _url.replace(new RegExp(`.*(?=${replaceKeyword})`), localKeyword)
}
