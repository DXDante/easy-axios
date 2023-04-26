// import type * as AxiosType from 'axios'
// import type * as BaseType from './base'
// import type * as UtilType from './util'

// declare global {
//   namespace Axios {
//     export = AxiosType
//   }

//   namespace Base {
//     export = BaseType
//   }

//   namespace Util {
//     export = UtilType
//   }
// }

import type { EasyAxios } from './base'

export type * from './base'
export type * from './util'
export default EasyAxios