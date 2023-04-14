# node-vue-app

个人自学项目 后台管理系统 

Vue 全家桶 + Node.js + MongoDB

具有登录、邮箱注册、图形验证码、忘记密码、上传头像、增删改查等功能

## 技术栈

* [Vue](https://github.com/vuejs/vue)
* [Vue-Router](https://github.com/vuejs/vue-router)
* [Vuex](https://github.com/vuejs/vuex)
* [Vue-CLI](https://github.com/vuejs/vue-cli)
* [axios](https://github.com/axios/axios)
* [Express](https://github.com/expressjs/expressjs.com)
* [mongoose](https://github.com/Automattic/mongoose)

## 开发工具

* [Yarn](https://yarnpkg.com/lang/en/docs/install/)
* [VSCode](https://code.visualstudio.com/)

## Node 版本注意

使用的是 12.22.0

## 准备

```bash
git clone <git-url>
```

使用 `MongoDBCompass` 新建一个数据库为 ` backend`，并创建两个集合分别为 `profiles` 、`users`，

然后导入 `dataBase` 下的 `profiles.json` 和 `users.json`到对应集合即可

`config/key.js` 通过以下 URI 连接 `backend` 数据库: 

```bash
mongodb://localhost/backend
```

## 启动（windows）

```bash
yarn install 或 npm install
cd client
yarn install 或 npm install
```

```bash
cd ..
net start MongoDB
yarn dev 或 npm run dev
```

## 注意

可以先全局搜索 `/getRegisterCode` ，把有关验证码的代码注释掉，跳过邮箱验证。

通过 Postman 对 `http://localhost:5000/api/users/register` 发送 POST 请求，

请求设置如下，即可随意注册：

| Headers |  |  
| --- | --- | 
| Content-Type | application/x-www-form-urlencoded | 

| Body | | 
| --- | --- |
| x-www-form-urlencoded | |
| name |  |
| email |  | 
| name |  | 
| password |  | 
| identity | 管理员 |

如果要启用邮箱注册，请查看 `routes/api/code.js` ，在 `from` 后面填写自己的邮箱即可

## 测试账号
```bash
账号：123452@qq.com
密码：123452
```
