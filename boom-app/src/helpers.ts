import { csvData, mapping } from './store'
import { type CsvRecord, type Mapping, type ObjectType } from './types'

/**
 * Get the titles of object types from an array of ObjectType objects.
 * @param objectTypes Array of ObjectType objects.
 * @returns string array of object type names.
 */
export function getObjectTypeNames(objectTypes: ObjectType[]): string[] {
  return objectTypes.map((objectType) => objectType.title)
}

/**
 * Get key-names of all properties of an ObjectType object.
 * @param objectType ObjectType object or undefined.
 * @returns string array of property names.
 */
export function getObjectTypePropertyNames(objectType: ObjectType | undefined): string[] {
  return Object.keys(objectType?.properties || {})
}

/**
 * Get an ObjectType by its name from a list of ObjectTypes.
 * @param objectTypes Array of ObjectType objects.
 * @param name Object type name to search for.
 * @returns ObjectType object with the specified name, or undefined if not found.
 */
export function getObjectTypeByName(
  objectTypes: ObjectType[],
  name: string,
): ObjectType | undefined {
  return objectTypes.find((objectType) => objectType.title === name)
}

/**
 * Create a mapping of property names to header names.
 * @param objectType ObjectType object to create a mapping on its properties or undefined.
 * @param headers string array of header names.
 * @returns A mapping of property names to header names.
 */
export function createMapping(objectType: ObjectType | undefined, headers: string[]): Mapping {
  const mapping: Mapping = {}
  const propertyNames: string[] = getObjectTypePropertyNames(objectType)
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
export function convertDataToObjects() {
  const results: CsvRecord[] = []
  for (const row of csvData.value.data) {
    results.push(convertRecordToObject(row))
  }
  return results
}

/**
 * Validates and converts a CSV record to an object based on the current mapping.
 * @param record Record<string, string> representing a CSV record.
 * @returns A mapped object from the CSV record.
 */
function convertRecordToObject(record: CsvRecord) {
  const propertiesObject: Record<string, string> = {}
  for (const [property, headerName] of Object.entries(mapping.value)) {
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
