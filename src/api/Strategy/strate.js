import httputils from '@/api/httputils'
import store from '@/store'

// 查询
export function queryStrategy({ postParams }) {
    return httputils.postJson(`/server/manage/strategy/query`, postParams)
}
//保存
export function saveStrategy({ postParams}) {
    let data = {userId:store.state.layout.userInfo.userId}
    return httputils.fetchJson(`/server/manage/strategy/save`,data, postParams)
}
//运行组保存
export function saveGroup({ postParams}) {
    let data = {userId:store.state.layout.userInfo.userId}
    return httputils.fetchJson(`/server/manage/strategy/group/save`,data, postParams)
}
export function queryGroup({ postParams}) {
    let data = {userId:store.state.layout.userInfo.userId}
    return httputils.fetchJson(`/server/manage/strategy/group/query`,data, postParams)
}
export function updateGroup({ postParams}) {
    let data = {userId:store.state.layout.userInfo.userId}
    return httputils.fetchJson(`/server/manage/strategy/group/update`,data, postParams)
}
export function delGroup({ postParams}) {
    let data = {userId:store.state.layout.userInfo.userId}
    return httputils.fetchJson(`/server/manage/strategy/group/delete`,data, postParams)
}
//策略制定原因查询
export function queryComment({ postParams }) {
    return httputils.postJson(`/server/manage/strategy/comment/query`, postParams)
}
//创建工作历
export function uploadCalendar(param, postParams) {
    let criteria = { param: { projectId: param.projectId, name: param.name ,dataType:1} }
    return httputils.fetchJson(`/server/common/upload?type=calendarReportSave`, criteria, postParams)
}
//查询工作历
export function queryCalendarName({ postParams}) {
    return httputils.postJson(`/duoduo-service/manage-service/manage/calendar/query`,postParams)
}
export function updateCalendar({ postParams }) {
    return httputils.postJson(`/duoduo-service/manage-service/manage/calendar/update`, postParams)
}
export function downloadCalendar({ postParams }) {
    return httputils.download(`/server/common/postDownload`, postParams)
}
//查询设备
export function queryEquipment({ postParams }) {
    return httputils.postJson(`/duoduo-service/object-service/object/equipment/query`, postParams)
}
//查询系统
export function querySystem({ postParams }) {
    return httputils.postJson(`/duoduo-service/object-service/object/system/query`, postParams)
}
//
export function GetEquipmentList({ postParams }) {
    return httputils.postJson(`/server/manage/strategy/getEquipList`, postParams)
}
//设备的计划运行时间
export function queryRunTime({ postParams }) {
    return httputils.postJson(`/server/manage/strategy/queryRunTime`, postParams)
}
//设备的实际运行时间
export function queryRealRunTime({ postParams }) {
    return httputils.postJson(`/server/manage/strategy/queryRealRunTime`, postParams)
}
//查询sop列表
export function querySop({ postParams }) {
    return httputils.postJson(`/server/manage/strategy/querySop`, postParams)
}
//查询所有sop
export function queryAllSop({ postParams }) {
    return httputils.postJson(`/duoduo-service/fm-service/sop/query`, postParams)
}
//查询最后一次运行工单
export function getLastWorkOrder({ getParams }) {
    return httputils.getJson(`/server/manage/strategy/history/getLastWorkOrder`, getParams)
}
//查询策略历史
export function queryHistoryStrategy({ postParams }) {
    return httputils.postJson(`/server/manage/strategy/history/query`, postParams)
}
//删除
export function deleteStrategy({ postParams}) {
    let data = {userId:store.state.layout.userInfo.userId}
    return httputils.fetchJson(`/server/manage/strategy/delete`,data, postParams)
}