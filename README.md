# easy-tools-axios
一个基于 axios 库封装的轻松搞定请求、文件流传输的 HTTP 请求工具


## 目录
- [前言](#前言)
- [特点](#特点)
- [安装](#安装)
- [示例](#示例)
- [文档](#文档)
- [请求示例](#请求示例)
- [注意事项](#注意事项)


## 前言
欢迎使用 easy-tools 系列工具之 axios\
特别感谢 [axios](https://github.com/axios/axios) 库, 近乎完美的封装浏览器、node.js 中的 HTTP 请求库, 本项目初衷是想让前端与后端交互过程中简化对于请求相关的各种处理, 所以以 axios 为基础进行二次开发, 整理请求、流传输统一的接口使用规范、全局的一些默认处理\
感谢 [qs](https://github.com/ljharb/qs) 库, 本项目中默认在序列化一些数据时可以使用到该库, 或者你也可以自定义序列


## 特点
- 轻松的定制化项目请求服务, 拦截请求、响应, 输出日志
- 自动转换上传、下载文件流
- 自动控制请求 Loading
- 请求、响应支持 TS 指定类型


## 安装
使用 npm:
```bash
$ npm install easy-tools-axios -S
```

使用 pnpm:
```bash
$ pnpm add easy-tools-axios -S
```

使用 yarn:
```bash
$ yarn add easy-tools-axios -S
```


## 示例
新建你的请求服务模块, 例如: request/index.ts, 或者 .js

```ts
import axios from 'axios'
import qs from 'qs'
import EasyAxios from 'easy-tools-axios'

/** 实例化时需要注意的是, 必须先调 create, 否则将会抛出错误提示, 因为在 create 中将会创建 axaios 实例, 后续的操作基于这个实例 */
const easyAxios = new EasyAxios(/** EasyAxios 配置项 */)
  .create(axios, { baseURL: '/api' /** 其他的 axios 配置, 如果你自定义了必须实现相应的行为 */ }, qs)
  .useRequestInterceptors(
    config => {
      // 请求相关数据, 你可以处理 config 中 headers、data 相关数据, 例如在这里传递 Token 自定义响应头
      return config
    },
    error => {
      // 请求错误的拦截, 做你想做的
      return error
    }
  )
  .useResponseInterceptors(
    response => {
      // 响应相关数据, 你可以在这里全局存储响应头的 Token 字段 (response.headers['authorization'])
      return response
    },
    error => {
      // 响应错误的拦截, 做你想做的
      return error
    }
  )
  .useStatusInterceptors(({ responce, disableToast, resolve, reject }) => {
    // 服务器端私有状态码的拦截, 控制你的响应使用以不同的 Promise 回调、全局的错误提示等等 (这里主要是你业务级的处理)
    resolve(responce.data)
  })
  .useLoading(
    () => {
      // 控制你的 Loading 开启
    },
    () => {
      // 控制你的 Loading 关闭
    }
  );

// 为了简便的使用函数, 你可以使用绑定上下文到导出函数
export const request = easyAxios.request.bind(easyAxios)
export const streaming = easyAxios.streaming.bind(easyAxios)
export default easyAxios
```


## 文档

◆ **new EasyAxios({ ... })    实例化 EasyAxios, 参数为 Object, 属性字段见下表**
  |  参数  |  类型  |  必填  |  说明  |
  |:----------------------------|:--------|:------|:-----------------------------------------------------------------------------|
  |enableEmptyParamsFiltering	  |Boolean	|否     |是否启用空参数过滤 (默认值: true), 自动剔除请求时顶级数据参数值为 null、undefined、'' 的值|
  |enableLog    	              |Boolean	|否     |是否启用日志输出 (默认值: true), 无论在请求/响应成功、失败时候都会输出信息, 方便开发者调试|
  |successFontColor    	        |String	  |否     |请求/响应成功日志字体颜色 (默认值: '#05af0d')|
  |errorFontColor    	          |String	  |否     |请求/响应失败日志字体颜色 (默认值: '#ff0000')|


◆ **instance.config    创建实例时传递的参数, 见实例化**


◆ **instance.axiosInstance    axios 的实例**


◆ **instance.requestInterceptorsIds    使用请求拦截器返回的 axios 拦截器标识 ID 集**


◆ **instance.responseInterceptorsIds    使用响应拦截器返回的 axios 拦截器标识 ID 集**


◆ **instance.__statusInterceptor    状态码拦截器, 你不应该直接对其进行操作**


◆ **instance.__loadingInstance    Loading 实例, 你不应该直接对其进行操作**


◆ **instance.create(...)    创建 axios 实例, 参数顺序依下表顺序**
  |  参数  |  类型  |  必填  |  说明  |
  |:-------|:-------------------|:--------|:-----------------------------------------------------------------------------------|
  |axios	 |AxiosStatic	        |是	      |axios 静态对象, 应该从该库中导入使用|
  |config  |AxiosRequestConfig	|是	      |axios 配置对象 (默认值: {}), 作为全局的请求器你至少要传递 baseURL 选项, 你可以在一个专门配置请求的模块里导出, 配置选项请查阅 axios 文档|
  |qs    	 |any	                |否       |qs 库 (如果你传入了, 当请求为'GET'时, 将在默认请求配置 paramsSerializer 选项中将调用 request 接口时的 data 数据自动转换到 GET 请求的询参数|


◆ **instance.useRequestInterceptors(...)    使用请求拦截器, 参数顺序依下表顺序**
  |  参数  |  类型  |  必填  |  说明  |
  |:----------------------|:--------|:------|:---------------------------------------------------------------------------------|
  |beforeRequestHandler	  |Function	|否     |请求前处理器 (接收 config 参数, 你可以处理 headers、data 相关数据, 例如自定义响应头的 Token)|
  |errorRequestHandler    |Function	|否     |请求错误处理器 (接收 error 参数, 处理请求前置的任何错误, 这取决于你)|


◆ **instance.destroyRequestInterceptors(...)    销毁请求拦截器, 参数顺序依下表顺序**
  |  参数  |  类型  |  必填  |  说明  |
  |:---------------|:---------|:--------|:-------------------------------------------------------------------------------------|
  |interceptorId	 |Number    |是       |请求拦截器 ID, 从实例的属性 requestInterceptorsIds 字段获取|


◆ **instance.useResponseInterceptors(...)    使用响应拦截器, 参数顺序依下表顺序**
  |  参数  |  类型  |  必填  |  说明  |
  |:----------------------|:--------|:------|:---------------------------------------------------------------------------------|
  |responseHandler	      |Function	|否     |响应处理器 (接收 response 参数, 你可以处理 headers、data 等数据)|
  |errorResponseHandler   |Function	|否     |响应错误处理器 (接收 error 参数, 处理响应的任何错误, 这取决于你)|


◆ **instance.destroyResponseInterceptors(...)    销毁响应拦截器, 参数顺序依下表顺序**
  |  参数  |  类型  |  必填  |  说明  |
  |:---------------|:---------|:--------|:-------------------------------------------------------------------------------------|
  |interceptorId	 |Number    |是       |响应拦截器 ID, 从实例的属性 responseInterceptorsIds 字段获取|


◆ **instance.useStatusInterceptors(...)    使用状态码拦截器, 参数顺序依下表顺序**
  |  参数  |  类型  |  必填  |  说明  |
  |:---------|:---------|:--------|:-------------------------------------------------------------------------------------------|
  |callback	 |Function  |是       |状态码拦截器回调 (接收一个 Object 参数, 包含属性 response, resolve, reject, disableToast 四个参数, 经过处理后你应该使用 resolve/reject 返回你处理后的数据, 状态码拦截器的独立出去是为了'业务级的请求处理' 与 XHR 的处理单独管理)|


◆ **instance.useLoading(...)    使用 Loading 计数器, 参数顺序依下表顺序(自动根据使用请求次数控制 Loading 时间点)**
  |  参数  |  类型  |  必填  |  说明  |
  |:---------------|:---------|:--------|:-------------------------------------------------------------------------------------|
  |startCallback	 |Function  |是       |启动 Loading 回调|
  |stopCallback	   |Function  |是       |关闭 Loading 回调|


◆ **instance.request({ ... })    请求器, 参数为 Object, 属性字段见下表**
搭配 TS 使用, 可以指定函数泛型参数 T: 请求参数数据类型, R: 响应数据数据类型
  |  参数  |  类型  |  必填  |  说明  |
  |:-----------------------------|:------------|:--------|:-------------------------------------------------------------------------------------------|
  |method	                       |String       |是       |请求方式 (包含 'GET'、'POST'、'PUT'、'DELETE'、'HEAD'、'OPTIONS'、'PATCH')|
  |interfacePath	               |String       |是       |请求接口地址的路径, 一般在实例化时需要设置基础 URL, 这里将与其进行拼接, 如果你在这里传递完整地址, 将以这个地址优先|
  |params	                       |Object       |否       |请求 URL 查询参数 (默认值: {}), 如果是用 GET 请求见以下 data 参数说明|
  |data	                         |Object       |否       |请求体参数 (默认值: {}), 注意本项目默认的请求配置优先以 data 参数为主, 主要是便于统一, 如果使用 GET 时, 内部自动将 data 参数转换到 params 中以生成 URL 查询参数, 紧只有 GET 时才会有此操作, 其他方式的请求单独管理|
  |headers	                     |Object       |否       |请求头参数 (默认值: {}), 添加你自定义的任何请求头, 优先级最高|
  |disableDataAutoDifferentiate	 |Boolean      |否       |禁用 data 字段数据自动判别 (默认值: false), 这里就是控制以上 data 在使用 GET 时的处理|
  |disableLoading	               |Boolean      |否       |禁用 Loading 功能 (默认值: false), 禁用后该轮请求将不再使用 Loading|
  |disableToast	                 |Boolean      |否       |禁用消息提示 (默认: false), 这个提示功能需要你在拦截器中自定义实现, 这里只是搜集参数|
  |abortGenerator	               |Function     |否       |生成终止请求器, 该函数会在准备发起请求前回调这个函数, 将 abortController(终止控制器) 回传|


◆ **instance.streaming({ ... })    流传输, 参数为 Object, 属性字段见下表**
搭配 TS 使用, 可以指定函数泛型参数 T: 请求参数数据类型, R: 响应数据数据类型
  |  参数  |  类型  |  必填  |  说明  |
  |:-----------------------------|:------------|:--------|:-------------------------------------------------------------------------------------------|
  |method	                       |String       |是       |请求方式 (包含 'GET'、'POST'、'PUT'、'DELETE'、'HEAD'、'OPTIONS'、'PATCH')|
  |interfacePath	               |String       |是       |请求接口地址的路径, 一般在实例化时需要设置基础 URL, 这里将与其进行拼接, 如果你在这里传递完整地址, 将以这个地址优先|
  |mode	                         |String       |否       |指定模式 (默认为 'Default' 将不处理请求前置与后置任务, 如使用了请求、响应拦截器你可以在此阶段做任何你想处理的操作, 本接口已经独立了上传、下载两个模式, 'Upload' 模式将自动将 files 和 data 合并转换为 formData 形式并更改请求头为 form 表单形式, 'Download' 模式将强制使用 blob 为响应体类型, 且不会走你定义的拦截器, 默认的响应类型为 { code: number, data: { streamConfig: Record<string, string>, streamResult: Blob }, message: string }, 这需要你指定响应内容类型为这个类型, 这可能有点强制性, 但你可以使用 customDownloadResponse 选项来自定义过滤最终响应的数据类型结构|
  |params	                       |Object       |否       |请求 URL 查询参数 (默认值: {}), 如果是用 GET 请求见以下 data 参数说明|
  |data	                         |Object       |否       |请求体参数 (默认值: {}), 注意本项目默认的请求配置优先以 data 参数为主, 主要是便于统一, 如果使用 GET 时, 内部自动将 data 参数转换到 params 中以生成 URL 查询参数, 紧只有 GET 时才会有此操作, 其他方式的请求单独管理|
  |headers	                     |Object       |否       |请求头参数 (默认值: {}), 添加你自定义的任何请求头, 优先级最高|
  |files	                       |Array        |否       |需上传的流数据 (默认值: []), 支持 File | Blob 的类型|
  |fileField	                   |String       |否       |需上传流数据的字段名称 (默认值: 'file')|
  |responseType	                 |String       |否       |响应体类型 (默认值: 'json', 注意当 mode 为 'Download' 时自动将该值设为 'blob', 因为是浏览器专属流响应类型)|
  |responseContentDisposition	   |String       |否       |响应头自定义的响应说明 (默认值: 'content-disposition'), 比如下载文件时的文件名配置, 后端一般默认为 URL 查询参数, 这里将自动解析为对象形式并返回指定的数据结构|
  |customDownloadResponse	       |Function     |否       |自定义过滤下载响应数据结构, 最终返回你指定泛型的数据, 该函数处理优先级高于默认行为, 见 mode 选项解释 (需自行处理 headers、data 参数)|
  |enableSequence	               |Boolean      |否       |启用多文件上传时自动序列文件字段名称 (默认值: true), 多文件如 file[0] 格式, 单文件则为 file|
  |customSequence	               |Function     |否       |自定义序列上传文件字段名称, 参数为 (form, files), 你只需要处理 files 到 form 即可, 其他数据字段已经处理进 form 对象了|
  |disableDataAutoDifferentiate	 |Boolean      |否       |禁用 data 字段数据自动判别 (默认值: false), 这里就是控制以上 data 在使用 GET 时的处理|
  |disableLoading	               |Boolean      |否       |禁用 Loading 功能 (默认值: false), 禁用后该轮请求将不再使用 Loading|
  |disableToast	                 |Boolean      |否       |禁用消息提示 (默认: false), 这个提示功能需要你在拦截器中自定义实现, 这里只是搜集参数|
  |abortGenerator	               |Function     |否       |生成终止请求器, 该函数会在准备发起请求前回调这个函数, 将 abortController(终止控制器) 回传|
  |onUploadProgress	             |Function     |否       |上传文件流时进度|
  |onDownloadProgress	           |Function     |否       |下载文件流时进度|


## 请求示例
```ts
import { request, streaming } from 'request'

// 假使这是定义在某个模块的全局的响应体结构接口
interface IResponse<T> {
  code: number
  data: T
  message: string
}

// GET 伪代码示例片段
request<IGetQRCodeRequestParams, IResponse<IGetQRCodeResponceData>>({
  method: 'GET',
  interfacePath: '/api/getQRcode',
  data: { organizationId: 0 }
})

// POST 伪代码示例片段
request<IGetPageListRequestParams, IResponse<IGetPageListResponceData>>({
  method: 'POST',
  interfacePath: '/api/getPageList',
  data: { page: 1 }
})

// Upload 伪代码示例片段
streaming<IUploadFormRequestParams, IResponse<IUploadFormResponceData>>({
  method: 'POST',
  interfacePath: '/api/uploadForm',
  mode: 'Upload',
  data: { name: 'Dante' },
  files: [/** 这里放置 Blob|File 对象, 其他参数根据需求指定参数 */]
})

// Download 伪代码示例片段
streaming<IDownloadFileRequestParams, IResponse<IDownloadFileResponceData>>({
  method: 'POST',
  interfacePath: '/api/downloadFile',
  mode: 'Download',
  data: { name: 'Dante' },
  // TODO: 定义后端定义的流数据相关数据的字段
  // responseContentDisposition: 'content-disposition',
  // TODO: 你也可以自定义响应结构体, 返回你最终的数据即可
  // customDownloadResponse: ({ headers, data }) => {
  //   return { customOptions, customStream: data }
  // }
}).then(({ data: { streamConfig, streamResult } }) => {
  // TODO: 这将返回默认的结构体
  // streamConfig 一般为下载文件流时后端反的流相关参数
  // streamResult 文件流接收的字段
})
```


## 注意事项
在 TS 中使用时如果有某些错误提示, 可以检查如下 tsconfig 配置, 可以参考 [tsconfig 中文配置文档](https://www.typescriptlang.org/zh/tsconfig)
```json
{
  "compilerOptions": {
    "moduleResolution": "Node",
    "strict": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noUnusedParameters": true,
    "noUnusedLocals": true,
    "allowJs": true
  }
}
```