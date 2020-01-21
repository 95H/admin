import httputils from '@/api/httputils'

// 查询设备位置图片
export function SearchEquipmentPosition({
    postParams
}) {
    return httputils.postJson(`/server/object/position/queryEquipManetPosition`, postParams)
}
export function SearchEquipmentImage({
    postParams
}) {
    return httputils.postJson(`/duoduo-service/object-service/object/equipment/query`, postParams)
}
export function querySystemManetPosition({
    postParams
}) {
    return httputils.postJson(`/server/object/position/querySystemManetPosition`, postParams)
}
// 查询空间位置图片
export function SearchSpacePosition({
    postParams
}) {
    return httputils.postJson(`/server/object/position/querySpacePosition`, postParams)
}

// 查询设备总数
export function SearchEquipmentTotal({
    postParams
}) {
    return httputils.postJson(`/server/object/position/queryEquipmentTotal`, postParams)
}

// 查询空间总数
export function SearchSpaceTotal({
    postParams
}) {
    return httputils.postJson(`/server/object/position/querySpaceTotal`, postParams)
}

// 查询建筑
export function queryArchitecture({
    postParams
}) {
    return httputils.postJson(`/duoduo-service/object-service/object/building/query`, postParams)
}

// 查询楼层
export function queryFloor({
    postParams
}) {
    return httputils.postJson(`/duoduo-service/object-service/object/floor/query`, postParams)
}

// 查询空间
export function querySpace({
    postParams
}) {
    return httputils.postJson(`/duoduo-service/object-service/object/space/query`, postParams)
}

// 查询设备类
export function queryCategory({
    postParams
}) {
    return httputils.postJson(`/duoduo-service/object-service/object/dict/equipment_all`, postParams)
}
// 查询空间功能类型
export function querySpatial({
    getParams
}) {
    return httputils.getJson(`/duoduo-service/object-service/object/dict/space`, getParams)
}
// 
// 图片上传 formData
export function upload({
    postParams
}) {
    return httputils.postupload(`/server/upload`, postParams)
}
// 修改设备位置
export function manualUpload({
    postParams
}) {
    return httputils.postupload(`/server/object/position/updateEquipmentPositionImg`, postParams)
}
// 修改空间位置
export function manSpacelUpload({
    postParams
}) {
    return httputils.postupload(`/server/object/position/updateSpacePositionImg`, postParams)
}
