# 心理沙盘平台 Vue 版

这个目录是基于原始 [SandBox.html](file:///e:/Desktop/SandBox/SandBox.html) 新建的 Vue 站点。

目标：

- 原始 `SandBox.html` 保持不动，继续可直接打开使用
- 新站点完整承接 3D 心理沙盘功能
- 为后续的心理测评、用户管理、后台接口对接预留清晰的分层结构

## 目录结构

```text
vue-site/
  index.html                 站点入口
  package.json               前端依赖与脚本
  vite.config.js             Vite 配置
  src/
    main.js                  Vue 启动入口
    App.vue                  根组件
    core/                    平台级基础能力
      base.css               全局基础样式
    router/                  路由层
      index.js
    layouts/                 平台布局层
      MainLayout.vue
    views/                   页面路由层
      HomeView.vue
      SandboxView.vue
      AssessmentsView.vue
      UsersView.vue
    modules/                 业务模块层
      sandbox/
        assets/
          sandbox-template.html   从原始页面提取的模板
        styles/
          sandbox.css             从原始页面提取的样式
        services/
          sandbox-raw.js          原始脚本备份
          initSandboxApp.js       Vue 中的沙盘初始化入口
      assessments/           心理测评模块预留
      users/                 用户模块预留
    shared/                  共享组件/工具/常量预留
```

## 当前实现策略

当前第一版采用“整体迁移，外层解耦”的方式：

- Vue 负责站点路由、平台壳子和未来扩展结构
- `/sandbox` 页面直接承载从原始页面提取出的 HTML、CSS 和 Three.js 逻辑
- 这样可以在不改动原始页面的前提下，最快保证功能一致

## 后续推荐演进

后面建议按下面顺序继续拆分：

1. 把沙盘数据模型、人偶元数据、存储逻辑从 `initSandboxApp.js` 中继续拆到独立文件
2. 把人物栏、沙盘设置栏、底部操作栏拆成 Vue 组件
3. 把本地 `localStorage` 持久化逐步替换成后端接口
4. 新增 `api/`、`stores/`、`composables/` 目录，承接 ASP.NET + PostgreSQL

## 运行方式

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```
