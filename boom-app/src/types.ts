export type CsvOutput = {
  headers: string[]
  data: Record<string, string>[]
}

/**
 * Type to represent the JSON schema of an "overige object".
 */
export type ObjectType = {
  title: string
  uuid: string
  versionNumber: number
  type: 'object'
  properties: Record<string, { type: 'string' }>
  required?: string[]
}

export type CsvRecord = Record<string, string>
export type Mapping = Record<string, string>

export type PaginatedObjectTypeList = {
  count: number
  next?: string | null
  previous?: string | null
  results: ObjectTypeResponse[]
}
export type ObjectTypeResponse = {
  readonly url?: string
  uuid?: string
  name: string
  readonly versions?: string[]
}

export type ObjectTypeVersion = {
  readonly url?: string
  readonly version?: number
  readonly objectType?: string
  status?: 'published' | 'draft' | 'deprecated'
  jsonSchema?: unknown
  readonly createdAt?: string
  readonly modifiedAt?: string
  readonly publishedAt?: string | null
}
