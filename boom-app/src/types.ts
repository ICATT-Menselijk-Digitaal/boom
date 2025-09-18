export type CsvOutput = {
  headers: string[]
  data: Record<string, string>[]
}

/**
 * Type to represent the JSON schema of an "overige object".
 */
export type ObjectType = {
  title: string
  type: 'object'
  properties: Record<string, { type: 'string' }>
  required?: string[]
}

export type CsvRecord = Record<string, string>
export type Mapping = Record<string, string>
