# @easy-tools/axios
一个基于 axios 库封装的轻松搞定请求、文件流传输的 HTTP 请求工具


## 目录
- [前言](#前言)
- [特点](#特点)
- [安装](#安装)
- [示例](#示例)
- [文档](#文档)


## 前言
特别感谢 [axios](https://github.com/axios/axios) 库, 近乎完美的封装浏览器、node.js 中的 HTTP 请求库, 本项目初衷是想让前端与后端交互过程中简化对于请求相关的各种处理


## 特点
- 轻松的定制化项目请求服务, 拦截请求、响应, 输出日志
- 自动转换上传、下载文件流
- 自动控制请求 Loading
- 请求、响应支持 TS 指定类型


## 安装
使用 npm:
```bash
$ npm install @easy-tools/axios -S
```

使用 pnpm:
```bash
$ pnpm add @easy-tools/axios -S
```

使用 yarn:
```bash
$ yarn add @easy-tools/axios -S
```


## 示例
新建你的请求服务模块, 例如: request/index.js

```js
import axios from 'axios'
import qs from 'qs'
import EasyAxios from '@easy-tools/axios'

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
  |:---------|:---------|:--------|:-------------------------------------------------------------------------------------------|
  |startCallback	 |Function  |是       |启动 Loading 回调|
  |stopCallback	   |Function  |是       |关闭 Loading 回调|


◆ **instance.request({ ... })    请求器, 参数为 Object, 属性字段见下表**
  |  参数  |  类型  |  必填  |  说明  |
  |:-----------------------------|:----------------------|:--------|:-------------------------------------------------------------------------------------------|
  |method	                       |RequestConfigMethod    |是       |请求方式 (包含 'GET'、'POST'、'PUT'、'DELETE'、'HEAD'、'OPTIONS'、'PATCH')|
  |interfacePath	               |String                 |是       |请求接口地址的路径, 一般在实例化时需要设置基础 URL, 这里将与其进行拼接, 如果你在这里传递完整地址, 将以这个地址优先|
  |params	                       |Function               |是       |关闭 Loading 回调|
  |data	                         |Function               |是       |关闭 Loading 回调|
  |headers	                     |Function               |是       |关闭 Loading 回调|
  |disableDataAutoDifferentiate	 |Function               |是       |关闭 Loading 回调|
  |disableLoading	               |Function               |是       |关闭 Loading 回调|
  |disableToast	                 |Function               |是       |关闭 Loading 回调|
  |abortGenerator	               |Function               |是       |关闭 Loading 回调|