import axios from 'axios'
import store from '@/store'
import { MessageBox } from 'element-ui'

var CancelToken = axios.CancelToken
var cancel

// 创建axios实例
const axiosservice = axios.create({
    timeout: 30000, // 请求超时时间
    retry: 4, //重新请求次数
    retryDelay: 1000, //重新请求的间隔
    credentials: true, // 接口每次请求会跨域携带cookie
    cancelToken: new CancelToken(function executor(c) {
        // executor 函数接收一个 cancel 函数作为参数
        cancel = c
    })
})

axiosservice.interceptors.request.use(
    config => {
        config.withCredentials = true // 允许携带token ,这个是解决跨域产生的相关问题
        let token = store.getters['ssoToken']
        if (token) {
            config.headers = {
                'sso-token': token
            }
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

axiosservice.interceptors.response.use(
    function(res) {
        //在这里对返回的数据进行处理
        //console.log('axios interceptors res = ', res.status, res)
        let resp = res.data
        if (resp.result === 'unauthc') {
            store.commit('logined', false)
            MessageBox.confirm('未登陆或登陆信息已失效, 是否重新登陆?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            })
                .then(resp => {
                    //console.log('--------------------------- confirm', resp)
                    //router.push('/login')
                    window.location.reload()
                })
                .catch(error => {
                    //console.log('--------------------------- cancel', error)
                    console.log('')
                })
        } else if (resp.result == 'unauthorization') {
            MessageBox.alert('无权操作', { title: '警告', type: 'error' })
        }
        //console.log('axios interceptors resp2 = ', resp.success, resp.errorCode, resp.errorMessage, res)
        return res
    },
    function(err) {
        //Do something with response error
        console.log('axios interceptors err = ', err)
        return Promise.reject(err)
    }
)

/* 下载方法 */
function downFile(blob, fileName) {
    // 非IE下载
    if ('download' in document.createElement('a')) {
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob) // 创建下载的链接
        link.download = fileName // 下载后文件名
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click() // 点击下载
        window.URL.revokeObjectURL(link.href) // 释放掉blob对象
        document.body.removeChild(link) // 下载完成移除元素
    } else {
        // IE10+下载
        window.navigator.msSaveBlob(blob, fileName)
    }
}

export default {
    //获取cookie
    getCookie(name) {
        var arr,
            reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
        if ((arr = document.cookie.match(reg))) {
            return unescape(arr[2])
        } else {
            /* 如果没有参数，那么就获取本域下的所有cookie */
            return document.cookie
        }
    },

    async getJson(url, params) {
        try {
            let response = await axiosservice({
                url,
                params,
                method: 'get'
            })
            return response.data
        } catch (err) {
            throw err
        }
    },
    async postJson(url, data) {
        try {
            let response = await axiosservice({
                url,
                data,
                method: 'post'
            })
            return response.data
        } catch (err) {
            throw err
        }
    },
    async fetchJson(url, params, data) {
        try {
            let response = await axiosservice({
                url,
                params,
                data,
                method: 'post'
            })
            return response
        } catch (err) {
            throw err
        }
    },
    async postupload(url, data) {
        try {
            let response = await axiosservice({
                url,
                data,
                method: 'post',
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return response.data
        } catch (err) {
            throw err
        }
    },
    download(url, requestData) {
        // 响应类型：arraybuffer, blob
        axiosservice
            .post(url, requestData, { responseType: 'blob' })
            .then(resp => {
                let headers = resp.headers
                let contentType = headers['content-type']

                console.log('响应头信息', headers)
                if (!resp.data) {
                    console.error('响应异常：', resp)
                    return false
                } else {
                    console.log('下载文件：', resp)
                    const blob = new Blob([resp.data], { type: contentType })

                    const contentDisposition = resp.headers['content-disposition']
                    let fileName = 'unknown'
                    if (contentDisposition) {
                        fileName = window.decodeURI(resp.headers['content-disposition'].split('=')[1])
                    }
                    console.log('文件名称：', fileName)
                    downFile(blob, fileName)
                }
            })
            .catch(function(error) {
                console.log(error)
            })
    },
    axios: axiosservice
}
