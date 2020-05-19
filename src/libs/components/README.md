# 注册全局组件

## 目的

1. 只注册基础必须的全局组件, 减少部署文件包大小
2. 管理入口大小(视情况调整), 加快首屏呈现速度(减少输入 url 后白屏等待时间)

## 注意事项

1. 没必要全局异步注册(通过`hoc.getAsync/ChooserAsyncFunctional`先占坑), 得(首屏速度)不偿失(cpu/内存资源消耗)
2. **避免全局样式污染**