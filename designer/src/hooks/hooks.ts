import { shallowRef } from 'vue'
export type FetchMethodType = 'get' | 'post' | 'delete' | 'push'
export type ResponseType = 'text' | 'json' | 'formData' | 'arrayBuffer' | 'blob'
export interface ConfigType {
  type: ResponseType,
  method: FetchMethodType
}
export function useFetch(url: string) {
  const data = shallowRef({})
  const config: ConfigType = {
    type: 'text',
    method: 'get',
  }
  const execute = () => {
    return new Promise(resolve => {
      fetch(url).then(async response => {
        const res = await response[config.type]()
        data.value = res;
        resolve(response);
      })
    })
  }
  const shell: any = {
    data,
    get: setMethod('get'),
    json: setType('json'),
  }
  function setMethod(method: FetchMethodType) {
    config.method = method
    return () => shell
  }
  function setType(type: ResponseType) {
    config.type = type;
    return () => shell
  }
  setTimeout(execute, 0);
  return shell;
}
