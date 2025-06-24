# dailyWork

> about vue3&ts

日常做一些组件或者一些有趣的尝试在这个项目上；

希望路过的大佬们多多提issue；

贵在坚持！



## 日志

### 20250623：INIT

用vite初始化了一个项目，计划封装下组件的选择展示功能；

大概是左边是目录，中间组件；

安装个scss：`pnpm install sass --save-dev`；



通过`autoGetComponents.ts`中导出组件名称和组件，在 `App.vue` 中使用`component :is`的方式动态加载组件;

目前使用的 `import.meta.glob`的方式去一次性加载所有的组件，在后期组件多的情况下会造成首屏幕加载慢，后期可以考虑用些其他方式；

有关 `import.meta.glob('./components/*.vue', { eager: true })`：

- eager: true

  - 含义：立即导入所有匹配的模块（同步导入）。

  - 结果：返回的 modules 对象，value 是模块本身（即组件对象）。

  - 用途：适合你需要马上用到所有模块，比如一次性渲染、无需懒加载的场景。

- eager: false（默认值）

  - 含义：懒加载，只有在你访问到某个模块时才会去加载（异步导入）。

  - 结果：返回的 modules 对象，value 是一个函数（调用时才会真正导入模块）。

  - 用途：适合组件很多、希望按需加载，优化首屏性能。

![image](./markdownAssets/image1.png)