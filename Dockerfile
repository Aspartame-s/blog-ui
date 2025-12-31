# --- 第一阶段：构建阶段 (Build Stage) ---
# 这一步的意义：在 Docker 内部创建一个临时的 Node.js 环境，把我们的源代码编译成浏览器能看懂的静态文件。
# 这样你就不用担心自己电脑上的 Node.js 版本太低了。

# 使用 Node.js 22 版本的轻量级镜像作为基础
FROM node:22-alpine AS build-stage

# 设置容器内部的工作目录为 /app
WORKDIR /app

# 先复制 package.json，这样如果依赖没变，Docker 会缓存这一步，加快下次构建速度
COPY package*.json ./

# 在容器内安装所有依赖
RUN npm install

# 复制项目的所有源代码到容器内
COPY . .

# 执行打包命令，生成 dist 文件夹
RUN npm run build-only


# --- 第二阶段：生产阶段 (Production Stage) ---
# 这一步的意义：构建完成后，我们不再需要 Node.js 环境了，只需要一个轻量级的 Nginx 来提供服务。
# 我们把第一阶段生成的 dist 文件夹“偷”过来，放进 Nginx 镜像里。

# 使用 Nginx 官方的轻量级镜像
FROM nginx:stable-alpine AS production-stage

# 将我们自己写的 nginx.conf 配置文件复制到 Nginx 的配置目录
# 这告诉 Nginx 应该如何处理用户的请求
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从“构建阶段”的容器里，把打包好的 /app/dist 文件夹复制到 Nginx 存放网页的目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 告诉外界，这个容器会使用 80 端口（标准的网页端口）
EXPOSE 80

# 启动 Nginx 服务，并让它在后台持续运行
CMD ["nginx", "-g", "daemon off;"]
