import httputils from '@/api/httputils'

// 查询项目通讯录
export function queryItems({ postParams }) {
    return httputils.postJson(`/duoduo-service/manage-service/manage/addressbook/query`, postParams)
}
// 新增项目通讯录
export function queryAdd({ postParams }) {
    return httputils.postJson(`/duoduo-service/manage-service/manage/addressbook/save`, postParams)
}
// 编辑项目通讯录
export function queryEdit({ postParams }) {
    return httputils.postJson(`/duoduo-service/manage-service/manage/addressbook/update`, postParams)
}
// 作废项目通讯录
export function queryDelete({ postParams }) {
    return httputils.postJson(`/duoduo-service/manage-service/manage/addressbook/delete`, postParams)
}