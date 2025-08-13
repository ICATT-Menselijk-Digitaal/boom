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

function getObjectTypeByName(objectTypes: ObjectType[], name: string): ObjectType {
  return (
    objectTypes.find((objectType) => objectType.title === name) || {
      title: '',
      type: 'object',
      properties: {},
    }
  )
}
export { getObjectTypeNames, getObjectTypePropertyNames, getObjectTypeByName }
