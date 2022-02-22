export function request(url: RequestInfo, options?: RequestInit) {
  return fetch(url, options).then(response => response.json())
}