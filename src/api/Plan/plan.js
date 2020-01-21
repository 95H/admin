import httputils from '@/api/httputils'

// 查询事件报告
export function QueryEventReport({
    postParams
}) {
    return httputils.postJson(`/duoduo-service/manage-service/manage/presentation/query`, postParams)
}
// 新增事件报告
export function AdditionalIncidentReport({
    postParams
}) {
    return httputils.postJson(`/duoduo-service/manage-service/manage/presentation/save`, postParams)
}
// 编辑事件报告
export function EditingEventReport({
    postParams
}) {
    return httputils.postJson(`/duoduo-service/manage-service/manage/presentation/update`, postParams)
}
// 删除事件报告
export function DeleteEventReport({
    postParams
}) {
    return httputils.postJson(`/duoduo-service/manage-service/manage/presentation/delete`, postParams)
}
// 下载事件报告

// 查询应急预案
export function InquiryCase({
    postParams
}) {
    return httputils.postJson(`/duoduo-service/manage-service/manage/plan/query`, postParams)
}
// 添加应急预案
export function AdditionalCases({
    postParams
}) {
    return httputils.postJson(`/duoduo-service/manage-service/manage/plan/save`, postParams)
}
// 修改应急预案
export function EditorialPlan({
    postParams
}) {
    return httputils.postJson(`/duoduo-service/manage-service/manage/plan/update`, postParams)
}
// 删除应急预案
export function DeleteCase({
    postParams
}) {
    return httputils.postJson(`/duoduo-service/manage-service/manage/plan/delete`, postParams)
}
//查询-应急预案掌握
export function queryPresen({
    postParams
}) {
    return httputils.postJson(`/server/manage/plan/master/query`, postParams)
}
//录入应急预案掌握
export function EditPresenSave({
    postParams
}) {
    return httputils.postJson(` /duoduo-service/manage-service/manage/plan/master/saveList`, postParams)
}
//查询-FM人员列表
export function personList({
    postParams
}) {
    return httputils.postJson(`/server/fm/project/person/query`, postParams)
}
// 删除上传的文件
export function deleteFile({
    postParams
}) {
    return httputils.postJson(`/image-service/common/files_delete?systemId=saas&secret=46f869eea8b31d14`, postParams)
}
// 查询人员

export function queryPerson({
    getParams
}) {
    return httputils.getJson(`/server/user/queryUserByProject`, getParams)
}
// 选择人员
export function sendPerson({
    postParams
}) {
    return httputils.postJson(`/server/wechat/sendWechatTemplateMsg`, postParams)
}
