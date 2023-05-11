import type * as Base from './base'

/************************************************* 工具类型相关 *************************************************/

/**
 * @public
 * Loading 计数器启动或关闭
 */
export type LoadingCounterStartOrStop = () => void

/**
 * @public
 * Loading 计数器控制回调
 */
export type LoadingCounterCallback = () => unknown

/**
 * @public
 * Loading 计数器类
 */
export class LoadingCounter {
  count: number
  readonly start: LoadingCounterStartOrStop
  readonly stop: LoadingCounterStartOrStop
  startCallback: LoadingCounterCallback
  stopCallback: LoadingCounterCallback
  constructor(startCallback: LoadingCounterCallback, stopCallback: LoadingCounterCallback)
}

/**
 * @public
 * Loading 使用计数器
 */
export interface IUseLoadingCounter {
  (startCallback: LoadingCounterCallback, stopCallback: LoadingCounterCallback): LoadingCounter
}

/**
 * @public
 * Loading 使用计数器接口声明
 */
export declare const useLoadingCounter: IUseLoadingCounter

/**
 * @public
 * 流传输创建 FormData 配置
 */
export type StreamingCreateFormDataConfig<T> = {
  data: T
  files?: (File|Blob)[]
  fileField?: string
  enableSequence?: boolean
  customSequence?: Base.StreamingConfigCustomSequence
}

/**
 * @public
 * 流传输创建 FormData
 */
export interface IStreamingCreateFormData {
  <T>(config: StreamingCreateFormDataConfig<T>): FormData
}

/**
 * @public
 * 下载文件返回
 */
export interface IDownloadStreamFileResult {
  state: 'success' | 'error'
  errorData?: unknown
}

/**
 * @public
 * 下载文件
 */
export interface IDownloadStreamFile {
  (streamData: File|Blob, fileName: string): Promise<IDownloadStreamFileResult>
}

/**
 * @public
 * 下载文件接口声明
 */
export declare const downloadStreamFile: IDownloadStreamFile

/**
 * @public
 * 解析自定义响应头查询参数
 */
export interface IParseResponseHeaderQueryParameters {
  (resource: string): Record<string, string>
}
