import { App, inject } from 'vue'
import axios, { AxiosRequestConfig, AxiosInstance } from 'axios'
import { HttpKey } from './keys'
import interceptors from './interceptors'

export interface Http extends AxiosInstance {
  setAuthorization(authorization: string): void
  install(app: App): void
}

/**
 * 在api请求时注入时间戳
 * @param config
 */
function injectionTimestamp(config: AxiosRequestConfig) {
  const timestamp = new Date().getTime()
  const { params = {} } = config
  Object.assign(params, {
    timestamp
  })
}

export interface CreateHttpOptions {
  // interceptors: Interceptors;
  baseURL?: string
}

export function useHttp(): Http {
  const http = inject(HttpKey) || axios
  return http as Http
}
export function createHttp({
  // interceptors,
  baseURL
}: CreateHttpOptions): Http {
  const instance = axios.create({
    baseURL: baseURL || ''
  }) as Http

  instance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      // 在 interceptors.js 关闭时间戳注入
      // export const isTimestampDisabled = false;
      if (!interceptors.isTimestampDisabled) {
        injectionTimestamp(config)
      }
      if (interceptors.httpRequestSuccess) {
        return interceptors.httpRequestSuccess(config)
      }
      return config
    },
    error => {
      if (interceptors.httpRequestFailure) {
        return interceptors.httpRequestFailure(error)
      }
      return Promise.reject(error)
    }
  )
  instance.interceptors.response.use(
    response => {
      if (interceptors.httpResponseSuccess) {
        return interceptors.httpResponseSuccess(response.data)
      }
      return response.data
    },
    error => {
      if (interceptors.httpResponseFailure) {
        return interceptors.httpResponseFailure(error)
      }
      return Promise.reject(error)
    }
  )
  instance.setAuthorization = (authorization: string) => {
    instance.defaults.headers.common['Authorization'] = authorization
  }
  instance.install = (app: App) => {
    app.config.globalProperties.$http = instance
    app.provide(HttpKey, instance)
  }
  return instance
}

export { HttpKey }
