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
export interface ILoadingCounter {
  count: number
  readonly start: LoadingCounterStartOrStop
  readonly stop: LoadingCounterStartOrStop
  startCallback: LoadingCounterCallback
  stopCallback: LoadingCounterCallback
}

/**
 * @public
 * Loading 计数器类
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
 * 解析自定义响应头查询参数
 */
export interface IParseResponseHeaderQueryParameters {
  (resource: string): Record<string, string>
}