// 获取响应式CSS Module对象(Vue)
import Vue from 'vue'
import SKIN, { on } from './skin'

/** 获取响应式CSS Module对象(根据皮肤改变)
 * @param {IObject<IObject<string>>} dic 字典，比如: {dark:{wrapper:'asd2'}}
 *
 * @returns {IObject<string>} 响应式CSS Module对象
 */
function getCSSModule(dic: IObject<IObject<string>>) {
  const obj = Vue.observable({ ...dic[SKIN.value] })
  on(skin => {
    Object.assign(obj, dic[skin])
  })
  return obj
}

export default getCSSModule
