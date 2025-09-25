import { selectedObjectVersion } from './store'
import { type MappedRecord, type Mapping, type ObjectType } from './types'

/**
 * Create a mapping of property names to header names.
 * @param objectType ObjectType object to create a mapping on its properties or undefined.
 * @param headers string array of header names.
 * @returns A mapping of property names to header names.
 */
export function createMapping(objectType: ObjectType | undefined, headers: string[]): Mapping {
  const mapping: Mapping = {}
  const propertyNames: string[] = Object.keys(objectType?.properties ?? [])
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

// -- Objecttype API functions --

/**
 * A generic function to fetch data from the ObjectTypes API.
 * Returns a promised with the provided type.
 * @param url string URL to the ObjectTypes API endpoint. The URL will be rewritten to redirect to the backend endpoint.
 * @returns Promise<T> with the fetched data.
 */
export async function fetchObjectTypeData<T>(url: string): Promise<T> {
  return fetch(reconstructApiURL(url, '/objecttypes', '/objecttypes-api')).then(
    (response) => response.json() as Promise<T>,
  )
}

/**
 * Changes the given URL to redirect to the backend endpoint.
 * @param url URL to change.
 * @param replaceKeyword everything up to this keyword will be replaced. Example '/objecttypes'
 * @param localKeyword the local api keyword the replace in the URL. Example '/objecttypes-api'
 * @returns A URL that redirects to the backend endpoint.
 */
export function reconstructApiURL(
  _url: string,
  replaceKeyword: string,
  localKeyword: string,
): string {
  return _url.replace(new RegExp(`.*(?=${replaceKeyword})`), localKeyword)
}

/**
 * Search if a similar object already exists
 * @param typeUrl The url of the type as specified in the objecttype
 * @param version The version number as an integer
 * @param properties The properties specified as a Record of strings or numbers
 * @returns A Promise with the search results as a Response
 */
export function searchObject(mappedObject: MappedRecord): Promise<boolean> {
  const typeUrl = selectedObjectVersion.value?.objectType ?? ''
  const version = selectedObjectVersion.value?.version ?? 0
  const dataAttrs = Object.entries(mappedObject)
    .map(([key, value]) => `${key}__exact__${value}`)
    .toString()

  const body = {
    type: convertToInternalDockerUrl(typeUrl).toString(),
    data_attrs: dataAttrs,
    typeVersion: version,
  }
  return (
    postRequest(body, '/search')
      .then((response) => response.json())
      // .then((res) => res.results > 0) // If there are results than a similar object is found.
      .then((res) => res.results.length > 0)
  )
}

/**
 * Performs a POST request to enter a new object based on the given arguments.
 * @param typeUri url matching the selected type
 * @param version version matching the selected type version
 * @param properties the properties that are needed to create the new object
 * @returns A promise of the POST request
 */
export function createNewObject(typeUrl: string, version: number, properties: MappedRecord) {
  const dateNow = new Date(Date.now()).toISOString().split('T')?.at(0) ?? '2025-01-01'

  const body = {
    type: convertToInternalDockerUrl(typeUrl).toString(),
    record: {
      typeVersion: version,
      data: properties,
      startAt: dateNow,
    },
  }

  return postRequest(body)
}

/**
 * Performs a POST request with standard headers used in many of the API POST requests
 * @param headers Headers object
 * @param body request body as a JSON object
 */
function postRequest(body: object, urlExtension = ''): Promise<Response> {
  const headers: Headers = new Headers()
  headers.set('Content-Crs', 'EPSG:4326')
  headers.set('Content-Type', 'application/json')

  const request: RequestInfo = new Request(`/objects-api${urlExtension}`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  })
  return fetch(request)
}

/**
 * Converts a given url to the hostname of the objecttypes docker container.
 * This function is temporary to assist working with the docker test setup of the objects api.
 * @param _url The objecttypes url that needs to convert
 * @returns converted URL object
 */
function convertToInternalDockerUrl(_url: string): URL {
  const url: URL = new URL(_url)
  url.hostname = 'objecttypes-web'
  url.port = '8000'
  return url
}
