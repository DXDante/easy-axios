import type * as Util from '../typings/util'

/**
 * 下载流式文件
 * @param { Blob } streamData   流式文件数据
 * @param { String } fileName   文件名称
 */
export const downloadStreamFile = <Util.IDownloadStreamFile>((streamData, fileName = '下载文件') => {
  return new Promise((resolve, reject) => {
    function load(e: ProgressEvent<FileReader>) {
      // 创建下载元素
      const aElement = document.createElement('a')
      aElement.download = fileName
      aElement.target = '_blank'
      aElement.href = <string>e.target.result
    
      // 创建点击事件并派发事件
      const mouseEvent = new MouseEvent('click', { bubbles: false, cancelable: true })
      // mouseEvent.initMouseEvent('click', true, true)
      aElement.dispatchEvent(mouseEvent)
    
      readerBinding(reader)
      resolve({ state: 'success' })
    }
    
    function error(e: ProgressEvent<FileReader>) {
      readerBinding(reader)
      reject({ state: 'error', errorData: e })
    }
    
    const readerBinding = (target: FileReader, mode?: string) => {
      if (mode == 'bind') {
        target.addEventListener('load', load, false)
        target.addEventListener('error', error, false)
        return
      }
    
      target.removeEventListener('load', load, false)
      target.removeEventListener('error', error, false)
    }

    // 创建阅读器, 读取 Blob 文件流为 Base64 地址
    const reader = new FileReader()
    readerBinding(reader, 'bind')
    reader.readAsDataURL(streamData)
  })
})

export default downloadStreamFile
