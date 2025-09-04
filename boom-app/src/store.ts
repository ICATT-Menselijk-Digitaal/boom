import { computed, ref } from 'vue'
import { type CsvOutput, type ObjectType } from './types'
import { getObjectTypeByName } from './helpers'

// Stored data
export const csvData = ref<CsvOutput>({
  headers: [],
  data: [],
})

// Stored mapping
// key: property name, value: header name
export const mapping = ref<Record<string, string>>({})

// Upload variables
export const fileName = ref<string>('')

// Mapping variables
export const selectedObjectTypeName = ref<string>('')
export const selectedObjectType = computed<ObjectType | undefined>(() => {
  return getObjectTypeByName(exampleObjects, selectedObjectTypeName.value)
})

// Navigation state variables
const navState = ref<number>(0) // 0=start, 1=upload, 2=mapping, 3=preview
export const computedNavState = computed<number>({
  get() {
    return navState.value
  },
  set(newValue) {
    if (newValue > navState.value) {
      navState.value = newValue
    }
  },
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
