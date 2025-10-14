// -- Objecttype API functions --

/**
 * Removes everything in the given url-string before the given keyword.
 * @param trimUntilKeyword The keyword that determines where to split the string. The keyword will remain in the result.
 * @param _url The URL that needs to be split
 * @returns The end of the string from the given keyword onward
 */
export function removeAllBefore(trimUntilKeyword: string, _url: string): string {
  return _url.substring(_url.lastIndexOf(trimUntilKeyword))
}

/**
 * Performs a fetch on the given url and returns the result as JSON if succesfull.
 * Throws errors if status other than 200-299 and content-type is other than json.
 * @param url fetch url
 * @returns Promise of type T.
 */
export async function fetchJSON<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError('Response is not in the right JSON format')
    }
    return response.json() as T
  } catch (error) {
    throw error
  }
}
