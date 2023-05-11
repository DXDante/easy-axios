import type * as Util from '../typings/util'

/**
 * 等待计数器
 */
export class LoadingCounter implements Util.LoadingCounter {
  count: number = 0

  // 启动计数器
  start() {
    if (this.count++ == 0) this.startCallback()
  }

  // 停止计数器
  stop() {
    if (this.count > 0 && --this.count == 0) this.stopCallback()
  }

  startCallback: Util.LoadingCounterCallback
  stopCallback: Util.LoadingCounterCallback

  constructor(startCallback: Util.LoadingCounterCallback, stopCallback: Util.LoadingCounterCallback) {
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
export const useLoadingCounter = <Util.IUseLoadingCounter>((startCallback, stopCallback) => {
  return new LoadingCounter(startCallback, stopCallback)
})

export default useLoadingCounter