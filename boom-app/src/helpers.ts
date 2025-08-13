import type { ObjectType } from './types'

/**
 * Get the titles of object types from an array of ObjectType objects.
 * @param objectTypes Array of ObjectType objects
 * @returns string array of object type names
 */
function getObjectTypeNames(objectTypes: ObjectType[]): string[] {
  return objectTypes.map((objectType) => objectType.title)
}

/**
 * Get the property key-names of an ObjectType object.
 * @param objectType ObjectType object
 * @returns string array of property names
 */
function getObjectTypePropertyNames(objectType: ObjectType): string[] {
  return Object.keys(objectType.properties)
}

/**
 * Get an ObjectType from a list of ObjectTypes by its name.
 * @param objectTypes Array of ObjectType objects
 * @param name object type name to search for
 * @returns ObjectType object with the specified name, or a default empty ObjectType if not found
 */
function getObjectTypeByName(objectTypes: ObjectType[], name: string): ObjectType {
  return (
    objectTypes.find((objectType) => objectType.title === name) || {
      title: '',
      type: 'object',
      properties: {},
    }
  )
}

/**
 * Create a mapping of property names to header names based on an ObjectType and a list of headers.
 * @param objectType ObjectType object to create a mapping on its properties
 * @param headers string array of header names
 * @returns A mapping of property names to header names
 */
function createMapping(objectType: ObjectType, headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {}
  const propertyNames: string[] = getObjectTypePropertyNames(objectType)
  for (const propertyName of propertyNames) {
    const headerName = headers.find(
      (headerName) => headerName.toLowerCase() === propertyName.toLowerCase(),
    )
    mapping[propertyName] = headerName || ''
  }
  return mapping
}

export { getObjectTypeNames, getObjectTypePropertyNames, getObjectTypeByName, createMapping }
