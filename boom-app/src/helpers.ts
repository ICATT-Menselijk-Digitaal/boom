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
