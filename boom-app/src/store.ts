import { ref } from 'vue'
import { type CsvOutput } from './types'

// Stored data
export const csvData = ref<CsvOutput>({
  headers: [],
  data: [],
})

// Stored mapping
export const mapping = ref<Record<string, string>>({})

// Mapping variables
export const selectedObjectTypeName = ref<string>('')
export const isMapping = ref<boolean>(true)
