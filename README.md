# CareerMate

CareerMate 是一个可独立运行的求职管理前端 MVP。用户可以注册或使用演示账号登录、浏览职位、把职位加入申请追踪器、更新申请状态，并维护个人资料。

## 主要功能

- 本地注册、登录、退出和受保护路由
- 响应式 Dashboard 和求职数据概览
- 按关键词、地点、技能和办公方式筛选职位
- 申请追踪器：Applied、Interview、Offer 等状态
- 可编辑个人资料
- 数据按用户保存在浏览器 `localStorage`
- 表单校验、路由保护和核心用户流程测试

## 本地运行

```bash
npm install
npm start
```

打开 <http://localhost:3000>。

演示账号：

- Email: `test@test.com`
- Password: `123456`

## 验证

```bash
npm test -- --watchAll=false
npm run build
```

## 数据与安全说明

这是一个没有后端的演示项目。注册账号、申请记录和登录会话仅保存在当前浏览器中；本地注册密码也仅用于演示登录流程。真实产品应使用后端 API、密码哈希、安全 Cookie、服务端鉴权和数据库，不能直接采用这里的浏览器存储方案。

## 回退到补全前的版本

补全前的原始工作区已保存为提交 `a62f69c`，并由分支 `backup/pre-codex-completion-a62f69c` 指向。查看旧版本而不改动当前分支：

```bash
git switch --detach backup/pre-codex-completion-a62f69c
```

返回当前开发分支：

```bash
git switch test
```
