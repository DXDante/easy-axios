
import type { Request } from '../typings'

/**
 * 等待计数器
 */
export class LoadingCounter implements Request.ILoadingCounter {
  count: number = 0

  // 启动计数器
  start() {
    if (this.count++ == 0) this.startCallback()
  }

  // 停止计数器
  stop() {
    if (this.count > 0 && --this.count == 0) this.stopCallback()
  }

  startCallback: Request.LoadingCounterCallback
  stopCallback: Request.LoadingCounterCallback

  constructor(startCallback: Request.LoadingCounterCallback, stopCallback: Request.LoadingCounterCallback) {
    this.startCallback = startCallback
    this.stopCallback = stopCallback
  }
}

/**
 * 使用计数器
 * @param startCallback     启动你自定义等待动画的回调
 * @param stopCallback      停止你自定义等待动画的回调
 * @returns LoadingCounter  计数器实例
 */
export const useLoadingCounter = (
  startCallback: Request.LoadingCounterCallback,
  stopCallback: Request.LoadingCounterCallback
): LoadingCounter => {
  return new LoadingCounter(startCallback, stopCallback)
}

export default useLoadingCounter