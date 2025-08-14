type CsvOutput = {
  headers: string[]
  data: Record<string, string>[]
}

/**
 * Type to represent the JSON schema of an "overige object".
 */
type ObjectType = {
  title: string
  type: 'object'
  properties: Record<string, { type: 'string' }>
  required?: string[]
}

export type { CsvOutput, ObjectType }
