/*
 * @Description: 模块申明
 * @Author: 毛瑞
 * @Date: 2019-07-09 16:19:51
 */

declare module '*.module.scss' {
  /** parsed class names with css-loader option, indexing by class selector names (must camelCase) in scss
   */
  const content: {
    [className: string]: string
  }
  export default content
}
declare module '*.scss' {
  /** scss 导出 (:export{})
   */
  const content: {
    [className: string]: string
  }
  export default content
}
declare module '*.css' {
  /** 一个空对象
   */
  const content: object
  export default content
}

declare module '*.png' {
  /** 图片路径或base64字符串
   */
  const content: string
  export = content
}
declare module '*.gif' {
  /** 图片路径或base64字符串
   */
  const content: string
  export = content
}
declare module '*.jpg' {
  /** 图片路径或base64字符串
   */
  const content: string
  export = content
}
declare module '*.jpeg' {
  /** 图片路径或base64字符串
   */
  const content: string
  export = content
}
declare module '*.svg' {
  /** 文件路径
   */
  const content: string
  export = content
}

declare module '*.json' {
  /** 得到json表达的对象/数组【混入到代码中】
   */
  const content: object | any[]
  export default content
}
// 需要配置loader,否则会 eval(内容)
// declare module '*.text' {
//   /** 文件内容
//    */
//   const content: string
//   export = content
// }
// declare module '*.txt' {
//   /** 文件内容
//    */
//   const content: string
//   export = content
// }

declare module 'element-ui/lib/*' {
  /* eslint-disable import/no-duplicates */
  import Vue, { PluginFunction, PluginObject } from 'vue'

  const plugin: PluginObject<Vue> | PluginFunction<Vue>
  export default plugin
}
declare module 'zrender/lib/*'
declare module 'zdog/js/*'
declare module 'luma.gl'
declare module 'math.gl'
declare module '@luma.gl/addons'

/// vue 单文件组件，放最后 ///
declare module '*' {
  import Vue from 'vue'
  export default Vue
}
