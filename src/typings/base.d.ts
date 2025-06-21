import type * as Axios from 'axios'
import type * as Util from './util'

/************************************************* EasyAxios 类型 *************************************************/

/**
 * @public
 * EasyAxios 实例化配置
 */
export type EasyAxiosConfig = {
  enableEmptyParamsFiltering?: boolean
  enableLog?: boolean
  successFontColor?: string
  errorFontColor?: string
}

/**
 * @public
 * 请求头配置
 */
export type ContentTypeOptions = {
  Json: string
  FormData: string
  FormUrl: string
}

/**
 * @public
 * EasyAxios 创建请求实例
 */
export interface ICreate {
  (axios: Axios.AxiosStatic, config: Axios.AxiosRequestConfig, qs?: any): EasyAxios
}

/**
 * @public
 * EasyAxios 请求拦截处理器
 */
export type RequestInterceptorsHandler = (config: Axios.AxiosRequestConfig) => Axios.AxiosRequestConfig

/**
 * @public
 * EasyAxios 请求拦截错误处理器
 */
export type RequestInterceptorsErrorHandler = (error: Axios.AxiosError) => Axios.AxiosError

/**
 * @public
 * EasyAxios 响应拦截处理器
 */
export type ResponseInterceptorsHandler = (response: Axios.AxiosResponse) => Axios.AxiosResponse

/**
 * @public
 * EasyAxios 响应拦截错误处理器
 */
export type ResponseInterceptorsErrorHandler = RequestInterceptorsErrorHandler

/**
 * @public
 * EasyAxios 使用请求拦截
 */
export interface IUseRequestInterceptors {
  (beforeRequestHandler?: RequestInterceptorsHandler, errorRequestHandler?: RequestInterceptorsErrorHandler): EasyAxios
}

/**
 * @public
 * EasyAxios 使用响应拦截
 */
export interface IUseResponseInterceptors {
  (responseHandler?: ResponseInterceptorsHandler, errorResponseHandler?: ResponseInterceptorsErrorHandler): EasyAxios
}

/**
 * @public
 * EasyAxios 使用状态码拦截回调
 */
export interface IStatusInterceptorCallback {
  <R>(result: {
    response: Axios.AxiosResponse,
    resolve: (value: R) => void,
    reject: (reson: R) => void,
    disableToast: boolean
  }): void
}

/**
 * @public
 * EasyAxios 使用状态码拦截
 */
export interface IUseStatusInterceptors {
  (callback: IStatusInterceptorCallback): EasyAxios
}

/**
 * @public
 * EasyAxios 使用 Loading
 */
export interface IUseLoading {
  (
    startCallback: Util.LoadingCounterCallback,
    stopCallback: Util.LoadingCounterCallback
  ): EasyAxios
}

/**
 * @public
 * EasyAxios 请求方式
 */
export type RequestConfigMethod = 'GET'|'POST'|'PUT'|'DELETE'|'HEAD'|'OPTIONS'|'PATCH'|'get'|'post'|'put'|'delete'|'head'|'options'|'patch'

/**
 * @public
 * EasyAxios 请求器配置
 */
export interface IRequestConfig<T> {
  method: RequestConfigMethod
  interfacePath: string
  params?: T
  data?: T
  headers?: Record<string, string>
  disableDataAutoDifferentiate?: boolean
  disableLoading?: boolean
  disableToast?: boolean
  abortGenerator?: (controller: AbortController) => void
}

/**
 * @public
 * EasyAxios 请求器
 */
export interface IRequest {
  <T, R>(config: IRequestConfig<T>): Promise<R>
}

/**
 * @public
 * EasyAxios 流传输器模式
 */
export type StreamingConfigMode = 'Default' | 'Upload' | 'Download'

/**
 * @public
 * EasyAxios 流传输器自定义流数据序列
 */
export type StreamingConfigCustomSequence = (targetFormData: FormData, files: (File|Blob)[]) => void

/**
 * @public
 * EasyAxios 流传输器自定义响应体
 */
export type StreamingConfigCustomDownloadResponse = <R>(options: { headers: Axios.AxiosResponseHeaders, data: Blob }) => R

/**
 * @public
 * EasyAxios 流传输器配置
 */
export interface IStreamingConfig<T> extends IRequestConfig<T> {
  mode?: StreamingConfigMode
  files?: (File|Blob)[]
  fileField?: string
  responseType?: string
  responseContentDisposition?: string
  customDownloadResponse?: StreamingConfigCustomDownloadResponse
  enableSequence?: boolean
  customSequence?: StreamingConfigCustomSequence
  onUploadProgress?: (event: unknown) => void
  onDownloadProgress?: (event: unknown) => void
}

/**
 * @public
 * EasyAxios Download 模式指定响应结构体
 */
export interface IStreamingDownloadResponse {
  code: number
  message: string
  data: {
    streamConfig: Record<string, string>,
    streamResult: Blob
  }
}

/**
 * @public
 * EasyAxios 流传输器
 */
export interface IStreaming {
  <T, R>(config: IStreamingConfig<T>): Promise<R | IStreamingDownloadResponse>
}

/**
 * @public
 * EasyAxios 类
 */
export declare class EasyAxios {
  config: EasyAxiosConfig
  axiosInstance: Axios.AxiosInstance | null
  readonly requestInterceptorsIds: number[]
  readonly responseInterceptorsIds: number[]
  // __statusInterceptor: IStatusInterceptorCallback | null
  // __loadingInstance: Util.LoadingCounter | null
  create: ICreate
  useRequestInterceptors: IUseRequestInterceptors
  destroyRequestInterceptors: (interceptorId: number) => void
  useResponseInterceptors: IUseResponseInterceptors
  destroyResponseInterceptors: (interceptorId: number) => void
  useStatusInterceptors: IUseStatusInterceptors
  useLoading: IUseLoading
  request: IRequest
  streaming: IStreaming
  destroy: () => void
  constructor(config?: EasyAxiosConfig)
}
