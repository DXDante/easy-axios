import type * as Axios from 'axios'
import type * as Base from '../typings/base'
import type * as Util from '../typings/util'
import {
  EasyAxiosDefaultConfig,
  useAxiosDefaultRequestConfig,
  EasyAxiosRequestQueryParamsMethod,
  EasyAxiosContentTypeOptions,
  EasyAxiosDownloadResponseDefaultContent
} from '../config'
import { useLoadingCounter, LoadingCounter } from '../core/loading-counter'
import {
  __isFunction,
  requestParamsFilter,
  requestInstanceErrorCheck,
  requestBaseErrorCheck,
  streamingCreateFormData,
  parseResponseHeaderQueryParameters
} from '../utils'

export class EasyAxios implements Base.EasyAxios {
  // EasyAxios 一些配置(启用查询参数过滤、启用请求日志等等)
  config: Base.EasyAxiosConfig
  // axaios 的实例
  axiosInstance: Axios.AxiosInstance = null
  // 请求拦截器标识
  readonly requestInterceptorsIds: number[] = []
  // 响应拦截器标识
  readonly responseInterceptorsIds: number[] = []
  // 状态码拦截器
  private __statusInterceptor: Base.IStatusInterceptorCallback = null
  // Loading 计数控制器实例
  private __loadingInstance: Util.LoadingCounter = null

  /**
   * 创建 axios 实例
   * (本工具默认请求体、响应体数据都是以 JSON 为主, 如果你需自定义见 axios 文档[https://axios-http.com/zh/docs/intro],
   * 配置项至少得包含 baseURL 字段作为基 URL, 否则你也可以在实例化后通过实例的 request 方法指定接口全路径,
   * 而在 transformRequest 中默认将不启用格式化请求体参数, 请求体数据默认为 JSON 格式,
   * 你可以使用 qs.stringify(data) 库的工具进行过滤转换成查询参数的形式, 或者你自己手动处理)
   * @param { Axios.AxiosStatic } axios                 axios 静态对象
   * @param { Axios.AxiosRequestConfig } config         axios 配置对象(默认空对象)
   * @param { any } qs?                                 qs 库 (如果你传入了将在默认请求配置 paramsSerializer 选项
   *                                                    当调用 request 时的传递的 data 数据自动转换到 GET 请求的查询参数
   * @returns { EasyAxios }                             当前 EasyAxios 实例
   */
  create(
    axios: Axios.AxiosStatic,
    config: Axios.AxiosRequestConfig = {},
    qs?: any
  ): Base.EasyAxios {
    this.axiosInstance = axios.create(Object.assign({}, useAxiosDefaultRequestConfig(qs), config))
    return this
  }

  /**
   * 使用请求拦截器
   * @param { Base.RequestInterceptorsHandler } beforeRequestHandler       请求前处理器 (通过 config 参数你可以处理 headers、data 相关数据)
   * @param { Base.RequestInterceptorsErrorHandler } errorRequestHandler   请求错误处理器
   * @returns { EasyAxios }                                                当前 EasyAxios 实例
   */
  useRequestInterceptors(
    beforeRequestHandler?: Base.RequestInterceptorsHandler,
    errorRequestHandler?: Base.RequestInterceptorsErrorHandler
  ): Base.EasyAxios {
    requestInstanceErrorCheck(this.axiosInstance)
    const interceptorId = this.axiosInstance.interceptors.request.use(
      config => {
        // { headers, data }
        if (__isFunction(beforeRequestHandler)) {
          config = <Axios.InternalAxiosRequestConfig<unknown>>(beforeRequestHandler(config) || config)
        }
  
        if (this.config.enableEmptyParamsFiltering && config.data) {
          requestParamsFilter(config.data)
        }
  
        if (this.config.enableLog) {
          const { url, params, data, ...otherOptions } = config
          console.groupCollapsed(`%crequest - success  ${ url }`, `color:${ this.config.successFontColor }`)
          console.log('params ', params)
          console.log('data ', data)
          console.log('otherOptions ', { url, ...otherOptions })
          console.groupEnd()
        }
  
        return config
      },
      error => {
        if (__isFunction(errorRequestHandler)) {
          error = errorRequestHandler(error) || error
        }
  
        if (this.config.enableLog) {
          console.groupCollapsed(`%crequest - error  ${ error?.url }`, `color:${ this.config.errorFontColor }`)
          console.error(error)
          console.groupEnd()
        }
  
        return Promise.reject(error)
      }
    )
    this.requestInterceptorsIds.push(interceptorId)

    return this
  }
  
  /**
   * 销毁请求拦截器
   * @param { Number } interceptorId 拦截器 ID 标识
   * @returns { void }
   */
  destroyRequestInterceptors(interceptorId: number): void {
    requestInstanceErrorCheck(this.axiosInstance)
    const removeIndex = this.requestInterceptorsIds.findIndex(id => id === interceptorId)
    if (removeIndex == -1) { return }
    this.axiosInstance.interceptors.request.eject(interceptorId)
    this.requestInterceptorsIds.splice(removeIndex, 1)
  }
  
  /**
   * 使用响应拦截器
   * @param { Base.ResponseInterceptorsHandler } responseHandler             响应处理器 (可处理 headers、data 等数据)
   * @param { Base.ResponseInterceptorsErrorHandler } errorResponseHandler   响应错误处理器
   * @returns { EasyAxios }                                                  当前 EasyAxios 实例
   */
  useResponseInterceptors(
    responseHandler?: Base.ResponseInterceptorsHandler,
    errorResponseHandler?: Base.ResponseInterceptorsErrorHandler
  ): Base.EasyAxios {
    requestInstanceErrorCheck(this.axiosInstance)
    const interceptorId = this.axiosInstance.interceptors.response.use(
      response => {
        // 使用者可以在这里存储响应头 Token (response.headers['authorization'])
        if (__isFunction(responseHandler)) {
          response = responseHandler(response) || response
        }

        if (this.config.enableLog) {
          const { data, headers, ...otherOptions } = response
          console.groupCollapsed(`%cresponse - success  ${ response.config.url }`, `color:${ this.config.successFontColor }`)
          console.log('data ', data)
          console.log('headers ', headers)
          console.log('otherOptions ', otherOptions)
          console.groupEnd()
        }
  
        return response
      },
      error => {
        if (__isFunction(errorResponseHandler)) {
          error = errorResponseHandler(error) || error
        }

        if (this.config.enableLog) {
          const { response, ...otherAxiosError } = error
          console.groupCollapsed(`%cresponse - error  ${ error.config.url }`, `color:${ this.config.errorFontColor }`)
          console.error('response ', response)
          console.error('otherAxiosError ', otherAxiosError)
          console.groupEnd()
        }
  
        return Promise.reject(error)
      }
    )
    this.responseInterceptorsIds.push(interceptorId)
    
    return this
  }

  /**
   * 销毁响应拦截器
   * @param { Number } interceptorId 拦截器 ID 标识
   * @returns { void }
   */
  destroyResponseInterceptors(interceptorId: number): void {
    requestInstanceErrorCheck(this.axiosInstance)
    const removeIndex = this.responseInterceptorsIds.findIndex(id => id === interceptorId)
    if (removeIndex == -1) { return }
    this.axiosInstance.interceptors.response.eject(interceptorId)
    this.responseInterceptorsIds.splice(removeIndex, 1)
  }

  /**
   * 使用状态码拦截器
   * @param { Base.IStatusInterceptorCallback } callback                   状态码拦截器回调 (型参包含 response, resolve, reject, disableToast)
   * @returns { EasyAxios }                                                当前 EasyAxios 实例
   */
  useStatusInterceptors(callback: Base.IStatusInterceptorCallback): Base.EasyAxios {
    this.__statusInterceptor = callback
    return this
  }

  /**
   * 使用 Loading 计数器
   * @param { Util.LoadingCounterCallback } startCallback                  启动 Loading 回调
   * @param { Util.LoadingCounterCallback } stopCallback                   关闭 Loading 回调
   * @returns { EasyAxios }                                                当前 EasyAxios 实例
   */
  useLoading(
    startCallback: Util.LoadingCounterCallback,
    stopCallback: Util.LoadingCounterCallback
  ): Base.EasyAxios {
    this.__loadingInstance = useLoadingCounter(startCallback, stopCallback)
    return this
  }

  /**
   * 请求器
   * @description 
   * @param { Base.IRequestConfig<T> } config                               请求配置
   * @param { Base.RequestConfigMethod } config.method                      请求方式
   * @param { String } config.interfacePath                                 请求接口路径
   * @param { T } config.params                                             ?请求 URL 查询参数 (默认空对象)
   * @param { T } config.data                                               ?请求体参数 (默认空对象)
   * @param { Record<string, string> } config.headers                       ?请求头参数 (默认空对象)
   * @param { Boolean } config.disableDataAutoDifferentiate                 ?禁用 data 字段数据自动判别 (默认 false)
   * @param { Boolean } config.disableLoading                               ?禁用 Loading 功能 (默认 false)
   * @param { Boolean } config.disableToast                                 ?禁用消息提示 (默认 false)
   * @param { (controller: AbortController): void } config.abortGenerator   ?生成终止请求器
   * @returns { Promise<R> }
   */
  request<T, R = unknown>(config: Base.IRequestConfig<T>): Promise<R> {
    requestInstanceErrorCheck(this.axiosInstance)
    const [errorField, errorInfo] = requestBaseErrorCheck<T>(config).split(':')
    if (errorField !== '') {
      throw new Error(`request(...) ${ errorField } 字段错误, ${ errorInfo }`)
    }

    let { method } = config
    const {
      interfacePath,
      params = {},
      data = {},
      headers = {},
      disableDataAutoDifferentiate = false,
      disableLoading = false,
      disableToast = false,
      abortGenerator
    } = config

    method = <Base.RequestConfigMethod>(method.toUpperCase())

    if (!disableLoading && this.__loadingInstance instanceof LoadingCounter) {
      this.__loadingInstance.start()
    }
    
    return new Promise((resolve, reject) => {
      const requestOptions = <Axios.AxiosRequestConfig>({
        method,
        url: interfacePath,
        headers: Object.assign({}, headers),
        params: (!disableDataAutoDifferentiate && method === EasyAxiosRequestQueryParamsMethod ? data : params),
        data: (!disableDataAutoDifferentiate && method === EasyAxiosRequestQueryParamsMethod ? {} : data)
      })

      // 创建终止请求标识
      if (__isFunction(abortGenerator)) {
        const abortController = new AbortController()
        requestOptions.signal = abortController.signal
        abortGenerator(abortController)
      }

      this.axiosInstance.request(requestOptions)
        .then(response => {
          if (__isFunction(this.__statusInterceptor)) {
            return this.__statusInterceptor<R>({ response, disableToast, resolve, reject })
          }

          resolve(<R>response.data)
        })
        .catch(error => {
          // // !(error instanceof Cancel)
          // if (!disableToast) {
          //   const tip = error.isAxiosError && error.message.match('timeout') ? '访问超时' : '服务器内部错误'
          //   // message({ type: 'error', message: tip })
          // }
          
          reject(error?.response)
        })
        .finally(() => {
          if (!disableLoading && this.__loadingInstance instanceof LoadingCounter) {
            this.__loadingInstance.stop()
          }
        })
    })
  }

  /**
   * 流传输
   * @param { Base.IStreamingConfig<T> } config                             请求配置
   * @param { Base.RequestConfigMethod } config.method                      请求方式
   * @param { String } config.interfacePath                                 请求接口路径
   * @param { Base.StreamingConfigMode } config.mode                        ?指定模式 (默认为 'Default' 将不处理请求前置与后置任务, 如使用了请求、响应拦截器
   * 你也可以在此阶段做任何你想处理的操作, 本接口已经独立了上传、下载两个模式
   * 'Upload' 模式将自动将 files 和 data 合并转换为 formData 形式并更改请求头为 form 表单形式
   * 'Download' 模式将强制使用 blob 为响应体类型, 且不会走你定义的拦截器, 默认的响应类型为 { code: number, data: { streamConfig: Record<string, string>, streamResult: Blob }, message: string },
   * 这需要你指定响应内容类型为这个类型, 这可能有点强制性, 但你可以使用 customDownloadResponse 选项来自定义过滤最终响应的数据类型结构
   * @param { T } config.params                                             ?请求 URL 查询参数 (默认空对象)
   * @param { T } config.data                                               ?请求体参数 (默认空对象)
   * @param { Record<string, string> } config.headers                       ?请求头参数 (默认空对象)
   * @param { (File | Blob)[] } config.files                                ?需上传的流数据 (默认空数组, 支持 File | Blob 的类型)
   * @param { String } config.fileField                                     ?需上传流数据的字段名称 (默认 'file')
   * @param { String } config.responseType                                  ?响应体类型 (默认 'json',
   * 注意当 mode 为 'Download' 时自动将该值设为 'blob', 因为是浏览器专属流响应类型)
   * @param { String } config.responseContentDisposition                    ?响应头自定义的响应说明, 比如下载文件时的文件名配置 (默认 'content-disposition',
   * 后端一般默认为 URL 查询参数, 这里将自动解析为对象形式并返回指定的数据结构)
   * @param { Base.StreamingConfigCustomDownloadResponse } config.customDownloadResponse ?自定义过滤下载响应数据结构, 最终返回你指定泛型的数据,
   * 该函数处理优先级高于默认行为, 见 mode 选项解释 (需自行处理 headers、data 参数)
   * @param { Boolean } config.enableSequence                               ?启用多文件上传时自动序列文件字段名称, 多文件如 file[0] 格式, 单文件则为 file (默认 true)
   * @param { Function } config.customSequence                              ?自定义序列上传文件字段名称, 参数为 (form, files),
   * 你只需要处理 files 到 form 即可, 其他数据字段已经处理进 form 对象了
   * @param { Boolean } config.disableDataAutoDifferentiate                 ?禁用 data 字段数据自动判别 (默认 false)
   * @param { Boolean } config.disableLoading                               ?禁用 Loading 功能 (默认 false)
   * @param { Boolean } config.disableToast                                 ?禁用消息提示 (默认 false)
   * @param { (controller: AbortController): void } config.abortGenerator   ?生成终止请求器
   * @param { (event: unknown): void } config.onUploadProgress              ?上传文件流时进度
   * @param { (event: unknown): void } config.onDownloadProgress            ?下载文件流时进度
   * @returns { Promise<R> }
   */
  streaming<T, R = unknown>(config: Base.IStreamingConfig<T>): Promise<R | Base.IStreamingDownloadResponse> {
    requestInstanceErrorCheck(this.axiosInstance)
    const [errorField, errorInfo] = requestBaseErrorCheck<T>(config).split(':')
    if (errorField !== '') {
      throw new Error(`request(...) ${ errorField } 字段错误, ${ errorInfo }`)
    }

    let {
      method,
      data = {},
      headers = {},
      responseType = 'json'
    } = config
    const {
      interfacePath,
      mode = 'Default',
      params = {},
      files = [],
      fileField = 'file',
      responseContentDisposition = 'content-disposition',
      customDownloadResponse,
      enableSequence = true,
      customSequence,
      disableDataAutoDifferentiate = false,
      disableLoading = false,
      disableToast = false,
      abortGenerator,
      onUploadProgress,
      onDownloadProgress
    } = config

    method = <Base.RequestConfigMethod>(method.toUpperCase())

    // 上传模式, 使用 FormData 作为请求体数据, 主要用于文件上传
    if (mode === 'Upload') {
      data = streamingCreateFormData({ data, files, fileField, enableSequence, customSequence })
      headers = Object.assign({}, { 'Content-Type': EasyAxiosContentTypeOptions.FormData }, headers)
    }
    // 下载模式, 将 responseType 指定为浏览器专属流模式 'blob'
    else if (mode === 'Download' && responseType !== 'blob') {
      responseType = 'blob'
    }

    if (!disableLoading && this.__loadingInstance instanceof LoadingCounter) {
      this.__loadingInstance.start()
    }

    return new Promise((resolve, reject) => {
      const requestOptions = <Axios.AxiosRequestConfig>({
        method,
        url: interfacePath,
        headers: Object.assign({}, headers),
        params: (!disableDataAutoDifferentiate && method === EasyAxiosRequestQueryParamsMethod ? data : params),
        data: (!disableDataAutoDifferentiate && method === EasyAxiosRequestQueryParamsMethod ? undefined : data),
        responseType,
        onUploadProgress,
        onDownloadProgress
      })

      // 创建终止请求标识
      if (__isFunction(abortGenerator)) {
        const abortController = new AbortController()
        requestOptions.signal = abortController.signal
        abortGenerator(abortController)
      }

      this.axiosInstance.request(requestOptions)
        .then(response => {
          // Download 模式下对流数据的处理
          if (mode === 'Download') {
            const { headers, data } = response

            // 1) 优先使用自定义响应体构建
            if(__isFunction(customDownloadResponse)) {
              return resolve(<R>customDownloadResponse(<{ headers: Axios.AxiosResponseHeaders, data: Blob }>({ headers, data })))
            }

            // 2) 默认响应体构建
            const streamConfig = parseResponseHeaderQueryParameters(headers[responseContentDisposition])
            return resolve(<Base.IStreamingDownloadResponse>{
              ...EasyAxiosDownloadResponseDefaultContent,
              data: { streamConfig, streamResult: data }
            })
          }

          if (__isFunction(this.__statusInterceptor)) {
            return this.__statusInterceptor<R>({ response, disableToast, resolve, reject })
          }

          resolve(<R>response.data)
        })
        .catch(error => {
          reject(error?.response)
        })
        .finally(() => {
          if (!disableLoading && this.__loadingInstance instanceof LoadingCounter) {
            this.__loadingInstance.stop()
          }
        })
    })
  }

  destroy() {}

  /**
   * @param { Base.EasyAxiosConfig } config                 配置项, 包含以下字段 (开启日志输出时, 必须要调用拦截器的使用)
   * @param { Boolean } config.enableEmptyParamsFiltering   是否启用空参数过滤
   * @param { Boolean } config.enableLog                    是否启用日志输出
   * @param { String } config.successFontColor              请求成功日志字体颜色
   * @param { String } config.errorFontColor                请求失败日志字体颜色
   */
  constructor(config: Base.EasyAxiosConfig = {}) {
    this.config = Object.assign({}, EasyAxiosDefaultConfig, config)
  }
}