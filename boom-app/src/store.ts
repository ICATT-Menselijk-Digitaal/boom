import { computed, ref } from 'vue'
import {
  type ObjectTypeMetaData,
  type CsvOutput,
  type Mapping,
  type ObjectType,
  type ObjectTypeVersionMetaData,
} from './types'

// Stored data
export const csvData = ref<CsvOutput>({
  headers: [],
  data: [],
})

// Stored mapping
// key: property name, value: header name
export const mapping = ref<Mapping>({})
export const autoMapping = ref<Mapping>({})

// Upload variables
export const fileName = ref<string>('')

// Mapping variables
export const selectedObjectType = ref<ObjectTypeMetaData>()
export const selectedObjectVersion = ref<ObjectTypeVersionMetaData>()

// Navigation variables
export const isUploaded = computed<boolean>(() => {
  return csvData.value.data.length > 0
})
export const isMappingSaved = ref<boolean>(false)

export const objectTypesList = ref<ObjectType[]>([])
export const objectTypesMetaDataList = ref<ObjectTypeMetaData[]>([])
export const objectTypesVersionMetaDataList = ref<ObjectTypeVersionMetaData[]>([])
