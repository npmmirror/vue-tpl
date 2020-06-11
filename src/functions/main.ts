/** 入口挂载公共逻辑, 手工控制入口大小 */
import Vue from 'vue'
import { Store } from 'vuex'
import Router, { RouteRecord, RawLocation, RouteConfig } from 'vue-router'

import { isString } from '@/utils'
import { on, off, once, emit } from '@/utils/eventBus'
import { fit, has } from '@/functions/auth'
import { GLOBAL } from '@/enums/events'
// import { throttle } from '@/utils/performance'
import { dev } from '@/libs/vue'
import { resolveUrl } from './router'

import '@/libs/components/junior'
import '@/libs/components/senior'

/// 全局样式(使用全局皮肤 src/skin) ///
import 'element-ui/lib/theme-chalk/base.css' // element-ui字体+过渡动画
import '@/scss/base.scss?skin=' // 基础样式
import '@/libs/components/junior.scss'
import '@/libs/components/senior.scss'

/** 埋点(日志采集) */
// function collection(id: string) {
//   if (process.env.NODE_ENV === 'production') {
//     Vue.config.errorHandler = function(err, vm, info) {
//       // 采集并上传错误日志
//     }
//     const data: IObject[] = []
//     window.addEventListener(
//       'mousemove',
//       throttle((e: MouseEvent) => {
//         // 页面地址&鼠标位置 可用于统计(比如热力图)用户关注的页面及功能
//         data.push({ url: location.href, x: e.pageX, y: e.pageY })
//       }, 3000)
//     )
//     window.addEventListener('beforeunload', () => {
//       submit(data) // 上传数据
//     })
//   }
// }

function emitErrorhandler(this: Vue, err: Error, event: string) {
  this.$emit('hook:errorCaptured', err, this, 'emit:' + event)
}

function getPathById(router: Router, id: string) {
  const routes = (router as any).options.routes as RouteConfig[]
  let route
  for (route of routes) {
    if (id === route.meta.id) {
      return route.path
    }
  }
  return ''
}

function routerEnvironment(proto: any, router: Router) {
  /// 鉴权(指令就没必要了) ///
  proto.authFit = fit
  proto.authHas = has
  /// 路由相关 ///
  proto.jump = (
    location: RawLocation,
    options?: {
      id?: string
      refresh?: boolean
      replace?: boolean
      onComplete?: Function
      onAbort?: (err: Error) => void
    }
  ) => {
    options || (options = {})

    const path = options.id && getPathById(router, options.id)
    if (path || options.refresh) {
      if (isString(location)) {
        location = resolveUrl(
          path || router.currentRoute.path,
          location || '',
          options.refresh
        )
      } else {
        location.path = resolveUrl(
          path || router.currentRoute.path,
          location.path || '',
          options.refresh
        )
      }
    }

    return router[options.replace ? 'replace' : 'push'](
      location,
      options.onComplete,
      options.onAbort
    )
  }
  proto.return = (refresh?: boolean) => {
    const route = router.currentRoute
    let current: RouteRecord | RouteRecord[] = route.matched
    current = current[current.length - 1]
    const parent = current && current.parent
    if (parent) {
      const result = new RegExp(
        '(' + parent.regex.source.replace('(?:\\/(?=$))?$', ')(?:/)?'),
        'i'
      ).exec(route.fullPath)
      if (result) {
        router.push((refresh ? '/r' : '') + result[1])
      } else {
        router.resolve(parent.path).route.matched.length
          ? router.push((refresh ? '/r' : '') + parent.path)
          : router.back()
      }
    } else {
      router.push(refresh ? '/r/' : '/')
    }
  }
  proto.refresh = () => {
    router.replace('/r' + router.currentRoute.fullPath)
  }
  proto.purge = (id: string) => {
    const routes = (router as any).options.routes
    let route
    for (route of routes) {
      if (id === route.meta.id) {
        return (route.meta.reload = true)
      }
    }
  }
  /// 全局事件 ///
  on(GLOBAL.jump, proto.jump)
  on(GLOBAL.return, proto.return)
  on(GLOBAL.refresh, proto.refresh)
  on(GLOBAL.purge, proto.purge)
}

function inject(proto: any, id: string, router?: Router) {
  /// 标识 ///
  proto._$SPA = id
  /// 消息总线  ///
  proto.on = on
  proto.off = off
  proto.once = once
  proto.emit = function() {
    const args = arguments as any
    if (isString(args[0])) {
      args[0] = [args[0], emitErrorhandler]
    } else {
      args[0].push(emitErrorhandler)
    }
    emit.apply(this, args)
  }
  /// 全局事件 ///
  window.addEventListener('click', e => {
    emit(GLOBAL.click, e)
  })
  /// 路由环境 ///
  router && routerEnvironment(proto, router)
}

export default <T>(id: string, App: any, router?: Router, store?: Store<T>) => {
  inject(Vue.prototype, id, router)

  // collection(id)
  dev(Vue)

  // 防阻塞页面（defer的脚本已缓存时不会非阻塞执行bug:chromium#717979）
  // [消息总线]直接复用根实例 (vue之外也会用到)
  // const root = new Vue(App)
  // temp = Vue.prototype
  // temp.on = root.$on
  // temp.once = root.$once
  // temp.off = root.$off
  // temp.emit = root.$emit
  // setTimeout(() => { root.$mount('#app') })
  // try {
  //   await import(/* webpackChunkName: "junior" */ '@/libs/components/junior')
  //   await import(/* webpackChunkName: "senior" */ '@/libs/components/senior')
  // } catch (error) {
  //   proto.$message.error('资源加载失败, 部分功能将不可用！')
  //   console.error(error)
  // }

  if (router || store) {
    const componentOptions = App.options || App
    componentOptions.router = router
    componentOptions.store = store
  }
  setTimeout(() => new Vue(App).$mount('#app'))
}
