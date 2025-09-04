import { type ObjectType } from './types'

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
export function createMapping(
  objectType: ObjectType | undefined,
  headers: string[],
): Record<string, string> {
  const mapping: Record<string, string> = {}
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
