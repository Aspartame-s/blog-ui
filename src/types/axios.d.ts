import { type AxiosRequestConfig, type AxiosResponse } from 'axios'

// 针对自定义响应拦截器的类型扩展
// 这会覆盖 axios 默认的类型，使得 request.get() 等方法直接返回我们期望的数据结构
declare module 'axios' {
  export interface AxiosInstance {
    request<T = any, R = T, D = any>(config: AxiosRequestConfig<D>): Promise<R>
    get<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
    delete<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
    head<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
    options<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
    post<T = any, R = T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
    put<T = any, R = T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
    patch<T = any, R = T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
  }
}
