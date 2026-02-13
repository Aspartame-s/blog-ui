// /Users/chengjiahui/blog/blog-ui/src/api/request.ts

import axios from 'axios';
import { ElMessage } from 'element-plus';

// 1. 创建 axios 实例
const request = axios.create({
    // !!! 关键：将 baseURL 修改为你服务器的公网 IP 和端口
    // baseURL: 'http://localhost:3000/api',
    baseURL: 'http://101.133.132.31:3000/api',
    timeout: 5000 // 请求超时时间
});

// 2. 请求拦截器
request.interceptors.request.use(
    config => {
        // 在发送请求前做些什么
        const token = localStorage.getItem('blog-token'); // 从 localStorage 获取 token
        if (token) {
            // 如果 token 存在，则每个请求都带上 token
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // 对请求错误做些什么
        console.log(error);
        return Promise.reject(error);
    }
);

// 3. 响应拦截器 (可选，但建议添加)
request.interceptors.response.use(
    response => {
        const res = response.data;
        // 如果 code 不是 200，则表示业务失败
        if (res.code !== 200) {
            ElMessage({
                message: res.msg || 'Error',
                type: 'error',
                duration: 5 * 1000
            });
            // 可以根据不同的 code 做不同的处理，例如 token 过期
            // if (res.code === 401) { ... }
            return Promise.reject(new Error(res.msg || 'Error'));
        } else {
            // 业务成功，直接返回核心数据 data
            return res;
        }
    },
    error => {
        // 处理 HTTP 网络错误
        console.log('err' + error);
        ElMessage({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);

export default request;