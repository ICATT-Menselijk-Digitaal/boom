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

// -- API functions --

/**
 * Removes everything in the given url-string before the given keyword.
 * @param trimUntilKeyword The keyword that determines where to split the string. The keyword will remain in the result.
 * @param _url The URL that needs to be split
 * @returns The end of the string from the given keyword onward
 */
export function removeAllBefore(trimUntilKeyword:string, _url: string): string {
  return _url.substring(_url.search(trimUntilKeyword))
}
