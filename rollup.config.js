import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
// import packageConfig from './package.json'

export default commandLineArgs => {
	return [
    // UMD for browser-friendly build
    {
      external: ['axios', 'qs'],
      input: 'src/index.ts',
      output: {
        name: 'EasyAxios',
        file: 'dist/index.min.js', // packageConfig.browser
        format: 'umd'
      },
      plugins: [
        resolve(), // 查找和打包 node_modules 中的第三方模块
        commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
        typescript(), // 解析 TypeScript
        babel({ babelHelpers: 'bundled' }),
        terser()
      ]
    },
    // CommonJS for Node and ES module for bundlers build
    {
      external: ['axios', 'qs'],
      input: 'src/index.ts',
      output: [
        {
          file: 'dist/index.cjs', // packageConfig.main,
          format: 'cjs',
          sourcemap: true
        },
        {
          file: 'dist/index.mjs', // packageConfig.module
          format: 'es',
          sourcemap: true
        }
      ],
      plugins: [
        typescript()
      ]
    }
  ]
}