import type * as Axios from 'axios'
import type * as Base from '../typings/base'
import { __isFunction } from '../utils'

/**
 * 默认请求方式 Keys
 */
export const EasyAxiosDefaultMethods = <Base.RequestConfigMethod[]>[
  'GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH',
  'get', 'post', 'put', 'delete', 'head', 'options', 'patch'
]

/**
 * 指定请求数据类型归类
 */
export const EasyAxiosRequestQueryParamsMethod = <Base.RequestConfigMethod>('GET')
export const EasyAxiosRequestDataMethods = <Base.RequestConfigMethod[]>['POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH']

/**
 * 自定义默认配置
 */
export const EasyAxiosDefaultConfig = <Base.EasyAxiosConfig>{
  enableEmptyParamsFiltering: true,
  enableLog: true,
  successFontColor: '#05af0d',
  errorFontColor: '#ff0000'
}

/**
 * 请求头 ContentType 字段配项
 */
export const EasyAxiosContentTypeOptions = <Base.ContentTypeOptions>({
  Json: 'application/json',
  FormData: 'multipart/form-data',
  FormUrl: 'application/x-www-form-urlencoded;charset=UTF-8'
})

/**
 * 下载模式响应体默认结构
 */
export const EasyAxiosDownloadResponseDefaultContent = <Base.IStreamingDownloadResponse>{
  code: 200,
  message: '下载成功'
}

/**
 * 使用默认请求配置
 * @param { any } qs                      qs 库
 * @returns { Axios.AxiosRequestConfig }
 */
export const useAxiosDefaultRequestConfig = (qs?: any): Axios.AxiosRequestConfig => {
  return {
    // 请求基础地址 (baseURL 将自动加在 url 前面, 除非 url 是一个绝对 URL)
    // baseURL: uri,
    // 请求数据格式化 (只适用于 POST、PUT、PATCH, 请求拦截器执行比这里更早)
    // transformRequest: [(data, headers) => {
    //   // 你可以对 data, headers 进行过滤, 如果你使用"查询参数"的形式, 则需要自定义 transformRequest 像如下使用
    //   // if (qs?.stringify && __isFunction(qs.stringify)) {
    //   //   return qs.stringify(data)
    //   // }
    //   return JSON.stringify(data)
    // }],
    // 响应数据 (传递给 then/catch 前对响应消息过滤, 这里 response 是字符串, 如果你不自定义则 axios 默认会进行 JSON 解析, 响应拦截器执行比这里更晚)
    // transformResponse: [(response) => response],
    // 默认请求头设置
    headers: {
      'Content-Type': EasyAxiosContentTypeOptions.Json,
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Expose-Headers': 'X-Reddit-Tracking, X-Moose'
    },
    // 请求 URL 参数格式化 (这里过滤 GET 请求参数, 将参数放置于 URL 中, 注意这里自动 encodeURIComponent 转换)
    paramsSerializer: params => {
      if (qs?.stringify && __isFunction(qs.stringify)) {
        return qs.stringify(params)
      }
      return params
    },
    // 请求超时时间
    timeout: 60000,
    // CORS 跨域设置(在请求头带自定义参数时, 会发起预检查请求, 服务器未处理则会报错, 推荐在你当前项目服务器 config 中启用代理)
    withCredentials: false,
    // 响应数据类型 ('arraybuffer', 'document', 'json', 'text', 'stream', 浏览器专属为 'blob')
    responseType: 'json',
    // // 响应编码解码方式
    // responseEncoding: 'utf8',
    // // 定义 node.js 中允许的 HTTP 响应内容的最大字节数
    // maxContentLength: 2000,
    // // 长连接配置 (默认都保持长连接)
    // httpAgent: new http.Agent({ keepAlive: true }),
    // httpsAgent: new https.Agent({ keepAlive: true })
  }
}
