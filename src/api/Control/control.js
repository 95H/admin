import httputils from '@/api/httputils'

// 查询风控阈值设置
export function getRiskList({ postParams }) {
    return httputils.postJson(`/server/transfer/risk/define/query`, postParams)
}
// 保存风控阈值设置
export function updateRiskList({ postParams }) {
    return httputils.postJson(`/server/transfer/risk/define/update`, postParams)
}
