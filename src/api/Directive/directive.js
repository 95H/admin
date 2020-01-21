import httputils from '@/api/httputils'

// 指定甄选
// 查询
export function findQuery({ postParams }) {
    return httputils.postJson(`/server/transfer/chiller/command/query`, postParams)
}

// 修改
export function updateQuery({ postParams }) {
    return httputils.postJson(`/server/transfer/chiller/command/update`, postParams)
}

