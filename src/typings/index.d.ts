import type * as AxiosType from 'axios'
import type * as QsType from 'qs'

export namespace Axios {
  export = AxiosType
}

export namespace Request {
  /************************************************* EasyAxios 类型 *************************************************/

  /** EasyAxios 实例化配置 */
  export type EasyAxiosConfig = {
    enableEmptyParamsFiltering?: boolean
    enableLog?: boolean
    successFontColor?: string
    errorFontColor?: string
  }

  export type ContentTypeOptions = {
    Json: string
    FormData: string
    FormUrl: string
  }

  /** EasyAxios 创建请求实例 */
  export interface ICreate {
    (axios: Axios.AxiosStatic, config: Axios.AxiosRequestConfig, qs?: any): IEasyAxios
  }

  /** EasyAxios 请求拦截处理器 */
  export type RequestInterceptorsHandler = (config: Axios.AxiosRequestConfig) => Axios.AxiosRequestConfig
  /** EasyAxios 请求拦截错误处理器 */
  export type RequestInterceptorsErrorHandler = (error: Axios.AxiosError) => Axios.AxiosError
  /** EasyAxios 响应拦截处理器 */
  export type ResponseInterceptorsHandler = (response: Axios.AxiosResponse) => Axios.AxiosResponse
  /** EasyAxios 响应拦截错误处理器 */
  export type ResponseInterceptorsErrorHandler = RequestInterceptorsErrorHandler

  /** EasyAxios 使用请求拦截 */
  export interface IUseRequestInterceptors {
    (beforeRequestHandler?: RequestInterceptorsHandler, errorRequestHandler?: RequestInterceptorsErrorHandler): IEasyAxios
  }

  /** EasyAxios 使用响应拦截 */
  export interface IUseResponseInterceptors {
    (responseHandler?: ResponseInterceptorsHandler, errorResponseHandler?: ResponseInterceptorsErrorHandler): IEasyAxios
  }

  /** EasyAxios 使用状态码拦截回调 */
  export interface IStatusInterceptorCallback {
    <R>(result: {
      response: Axios.AxiosResponse,
      resolve: (value: R) => void,
      reject: (reson: R) => void,
      disableToast: boolean
    }): void
  }

  /** EasyAxios 使用状态码拦截 */
  export interface IUseStatusInterceptors {
    (callback: IStatusInterceptorCallback): IEasyAxios
  }

  /** EasyAxios 使用 Loading */
  export interface IUseLoading {
    (
      startCallback: LoadingCounterCallback,
      stopCallback: LoadingCounterCallback
    ): IEasyAxios
  }

  /** EasyAxios 请求方式 */
  export type RequestConfigMethod = 'GET'|'POST'|'PUT'|'DELETE'|'HEAD'|'OPTIONS'|'PATCH'|'get'|'post'|'put'|'delete'|'head'|'options'|'patch'

  /** EasyAxios 请求器配置 */
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

  /** EasyAxios 请求器 */
  export interface IRequest {
    <T, R>(config: IRequestConfig<T>): Promise<R>
  }

  /** EasyAxios 流传输器自定义流数据序列 */
  export type StreamingConfigMode = 'Default' | 'Upload' | 'Download'
  export type StreamingConfigCustomSequence = (targetFormData: FormData, files: (File|Blob)[]) => void
  export type StreamingConfigCustomDownloadResponse = <R>(options: { headers: Axios.AxiosResponseHeaders, data: Axios.AxiosResponse }) => R

  /** EasyAxios 流传输器配置 */
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

  export interface IStreamingDownloadResponse {
    code: number
    message: string
    data: Record<string, any>
  }

  /** EasyAxios 流传输器 */
  export interface IStreaming {
    <T, R>(config: IStreamingConfig<T>): Promise<R>
  }

  /** EasyAxios 类 */
  export interface IEasyAxios {
    config: EasyAxiosConfig
    axiosInstance: Axios.AxiosInstance | null
    readonly requestInterceptorsIds: number[]
    readonly responseInterceptorsIds: number[]
    __statusInterceptor: IStatusInterceptorCallback | null
    __loadingInstance: ILoadingCounter | null
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
  }
  /************************************************* EasyAxios 类型 *************************************************/


  /************************************************* 工具类型相关 *************************************************/
  /** Loading 计数器启动或关闭 */
  export type LoadingCounterStartOrStop = () => void
  /** Loading 计数器控制回调 */
  export type LoadingCounterCallback = () => unknown

  /** Loading 计数器类 */
  export interface ILoadingCounter {
    count: number
    readonly start: LoadingCounterStartOrStop
    readonly stop: LoadingCounterStartOrStop
    startCallback: LoadingCounterCallback
    stopCallback: LoadingCounterCallback
  }

  export type StreamingCreateFormDataConfig<T> = {
    data: T
    files?: (File|Blob)[]
    fileField?: string
    enableSequence?: boolean
    customSequence?: StreamingConfigCustomSequence
  }

  export interface IStreamingCreateFormData {
    <T>(config: StreamingCreateFormDataConfig<T>): FormData
  }

  export interface IParseResponseHeaderQueryParameters {
    (resource: string): Record<string, string>
  }
  /************************************************* 工具类型相关 *************************************************/
}
