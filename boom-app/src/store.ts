import { computed, ref } from 'vue'
import { type CsvOutput, type Mapping, type ObjectType } from './types'
import { createMapping, getObjectTypeByName } from './helpers'

// Stored data
export const csvData = ref<CsvOutput>({
  headers: [],
  data: [],
})

// Stored mapping
// key: property name, value: header name
export const mapping = computed<Mapping>(() => {
  return createMapping(selectedObjectType.value, csvData.value.headers)
})

// Upload variables
export const fileName = ref<string>('')

// Mapping variables
export const selectedObjectTypeName = ref<string>('')
export const selectedObjectType = computed<ObjectType | undefined>(() => {
  return getObjectTypeByName(exampleObjects, selectedObjectTypeName.value)
})

// TEMP ObjectType example data
export const exampleObjects: ObjectType[] = [
  {
    title: 'Boom',
    type: 'object',
    properties: { name: { type: 'string' }, location: { type: 'string' } },
    required: ['name', 'location'],
  },
  {
    title: 'Smoel',
    type: 'object',
    properties: {
      firstname: { type: 'string' },
      lastname: { type: 'string' },
      address: { type: 'string' },
    },
  },
]
