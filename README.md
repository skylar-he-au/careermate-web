# CareerMate

CareerMate 是一个连接真实后端 API 的求职管理前端。用户可以注册、登录、浏览职位、维护申请记录，并分页查看和下载自己上传的简历。

## 主要功能

- Axios API Client：统一后端地址、超时、JWT 请求拦截和 `401` 处理
- Redux Toolkit：集中保存认证状态、Resume 列表和分页状态
- 后端注册与登录，不提供本地演示账号
- 受保护路由和登录后返回原页面
- My resumes：按用户查询、分页、设置 page size、获取临时下载链接
- 职位筛选与本地申请追踪器
- 响应式 Dashboard 和移动端导航
- 登录、路由保护、职位追踪、Resume 分页等核心流程测试

## 配置与运行

先复制环境变量示例：

```bash
cp .env.example .env.development.local
```

确保 `REACT_APP_BASE_API` 与后端使用的地址和端口一致，然后运行：

```bash
npm install
npm start
```

当前开发配置会在 <http://localhost:3008> 打开前端，并连接 <http://localhost:3000> 的后端。

开发环境暂时启用了 `REACT_APP_USE_MOCK_RESUMES=true`，因此 My resumes 会显示 10 条标有 Sample 的数据。选择 page size `5` 时会出现第 `1`、`2` 页。看完效果后将它改成 `false`，页面就会恢复查询真实后端数据。

登录和 Resume 功能使用以下后端接口：

- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `GET /v1/resumes?page=1&limit=10`
- `GET /v1/resumes/:id/download`

## 登录状态与安全

浏览器只在 `careermate.auth` 中保存当前用户资料和 JWT。Axios 请求拦截器会把 JWT 放进 `Authorization: Bearer ...`。Resume 的所有权由后端根据 JWT 判断，前端不会传入或自行决定 user ID。后端返回 `401` 时，前端会清除失效登录并回到登录页。

申请追踪器仍是前端练习功能，按用户 ID 保存在浏览器 `localStorage`，并未写入后端数据库。

## 验证

```bash
npm test -- --watchAll=false
npm run build
```

## 回退版本

本次接入 Redux、Axios 和 Resume API 之前的完整版本保存在：

- 提交：`e832907`
- 分支：`backup/pre-redux-resume-e832907`

查看备份而不改动当前分支：

```bash
git switch --detach backup/pre-redux-resume-e832907
```

返回当前开发分支：

```bash
git switch test
```
