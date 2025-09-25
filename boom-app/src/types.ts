export type CsvOutput = {
  headers: string[]
  data: CsvRecord[]
}

/**
 * Type to represent the JSON schema of an "overige object".
 */
export type ObjectType = {
  title: string
  uuid: string
  versionNumber: number
  type: 'object'
  properties: Record<string, string | number>
  required?: string[]
}

export type CsvRecord = Record<string, string | number>
export type MappedRecord = Record<string, string | number>
export type Mapping = Record<string, string>

// -- ObjectTypes types --

export type PaginatedObjectTypeList = {
  count: number
  next?: string | null
  previous?: string | null
  results: ObjectTypeMetaData[]
}

export type ObjectTypeMetaData = {
  readonly url?: string
  uuid?: string
  name: string
  readonly versions?: string[]
}

export type ObjectTypeVersionMetaData = {
  readonly url?: string
  readonly version?: number
  readonly objectType?: string
  status?: 'published' | 'draft' | 'deprecated'
  jsonSchema?: ObjectType
  readonly createdAt?: string
  readonly modifiedAt?: string
  readonly publishedAt?: string | null
}

// -- Object types --
export type Object = {
  type: string
  record: {
    typeVersion: number
    data: Object
    startAt: string
  }
}
