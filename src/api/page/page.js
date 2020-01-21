import httputils from "@/api/httputils";
import store from '@/store'

// 人员信息
export function queryUser({
    getParams
}) {
    return httputils.getJson(`/server/home/getUserInfo`, getParams)
}
// 协管任务
export function queryTaskList({
    postParams
}) {
    return httputils.postJson(`/server/home/getMngTaskList`, postParams)
}
// 查询督办事项
export function queryRisk({
    postParams
}) {
    return httputils.postJson(`/duoduo-service/manage-service/manage/supervise/query`, postParams)
}
// 查询风险监控
export function queryDefine({
    postParams
}) {
    let param = {
        projectId: store.state.projectId
    }
    return httputils.fetchJson(`/duoduo-service/transfer/risk/define/query`, param, postParams)
}
