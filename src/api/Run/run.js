import httputils from '@/api/httputils'

// 查询信息栏
export function queryInformation({
    getParams
}) {
    return httputils.getJson(`/server/manage/run/pandect/queryInfo`, getParams)
}
// 查询月运行总览统计
export function queryStatistics({
    getParams
}) {
    return httputils.getJson(`/server/manage/run/pandect/queryDetailByDate`, getParams)
}
