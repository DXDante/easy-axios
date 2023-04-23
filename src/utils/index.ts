import type * as Axios from 'axios'
import type * as Base from '../typings/base'
import type * as Util from '../typings/util'

export const __isFunction = (value: unknown): boolean => typeof value === 'function'

export const __isObject = function (p: unknown): boolean {
  return !!(typeof p === 'object' && p !== null && p.constructor == Object)
}

export const __isEmptyObject = function (p: unknown): boolean {
  if (__isObject(p)) {
    for (const k in (p as object)) {
      k;
      return false
    }
    return true
  }
  return false
}

/**
 * 请求参数过滤 (只过滤值为 null、undefined、'', 且只过滤一层)
 * @param { Record<string, any> } data 请求参数
 */
export const requestParamsFilter = (data: Record<string, any>, eachCallback?: Function): void => {
  const eachCallbackIsFn = __isFunction(eachCallback)
  Object.keys(data).forEach((key: string): void => {
    if (data[key] === '' || data[key] == null) {
      delete data[key]
    }

    if (eachCallbackIsFn && data[key] !== undefined) {
      eachCallback(key, data[key])
    }
  })
}

/** 流传输创建 FormData
 * @param { Object } data
 */
export const streamingCreateFormData = <Util.IStreamingCreateFormData>(<T>({
  data,
  files = [],
  fileField = 'file',
  enableSequence = true,
  customSequence
}: Util.StreamingCreateFormDataConfig<T>): FormData => {
  const form = new FormData()

  // 添加参数
  requestParamsFilter(data, (key: string, value: string) => form.append(key, value))

  // 添加流数据
  const fileCount = files.length
  if (fileCount) {
    if (__isFunction(customSequence)) {
      customSequence(form, files)
    } else {
      const enabled = enableSequence && fileCount > 1
      files.forEach((file, index) => (form.append(`${ fileField }${enabled ? `[${ index }]` : ''}`, file)))
    }
  }

  return form
})

/**
 * 解析自定义响应头查询参数
 * @param { String } resource 解析源查询参数字符串
 * @returns { Record<string, string> }
 */
export const parseResponseHeaderQueryParameters = <Util.IParseResponseHeaderQueryParameters>((resource) => {
  const result = {}
  if (typeof resource === 'string' && resource.length) {
    resource = decodeURIComponent(resource)
    const keyValueStrings = resource.split('&')
    keyValueStrings.forEach(item => {
      const [key, value] = item.split('=')
      Reflect.set(result, key, value)
    })
  }

  return result
})

/**
 * 请求实例错误检查
 * @param axiosInstance axios 实例
 */
export const requestInstanceErrorCheck = (axiosInstance: Axios.AxiosInstance | null) => {
  if (axiosInstance === null) {
    throw new Error(`request(...) 未实例化 axios 实例, 使用 EasyAxios 实例化后需要先调用 create 创建 axaios 实例`)
  }
  return false
}

/**
 * 请求基础错误检查
 * @param { Base.IRequestConfig } config 请求配置参数
 * @returns { String }                      错误信息 (以 : 号作为分隔, 前面表示字段, 后面为错误说明)
 */
export const requestBaseErrorCheck = <T>(config: Base.IRequestConfig<T>): string => {
  if (config.interfacePath === '') {
    return 'interfacePath:接口路径(interfacePath)字段不能为空字符串'
  }
  return ''
}