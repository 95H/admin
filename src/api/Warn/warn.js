import httputils from '@/api/httputils'
export function queryWarn(postParams) {
    return httputils.postJson('/server/manage/strategy/alarm/query', postParams)
}
export function queryWorkOrder(postParams) {
    return httputils.postJson('/server/manage/strategy/alarm/queryWorkOrder', postParams)
}
export function hisdataQueryPeriodData(postParams) {
    return httputils.postJson('/server/manage/strategy/alarm/hisdataQueryPeriodData', postParams)
}
export function queryCount(postParams) {
    return httputils.postJson(' /server/manage/strategy/alarm/queryCount', postParams)
}
export function queryDailyCount(postParams) {
    return httputils.postJson('/server/manage/strategy/alarm/queryDailyCount', postParams)
}
