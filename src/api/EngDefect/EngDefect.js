import httputils from "@/api/httputils";
// 查询工程缺陷对象
export function queryObject({
    getParams
}) {
    return httputils.getJson(
        `/duoduo-service/object-service/object/data/getSimpleInfo`,
        getParams
    );
}
// 查询工程缺陷
export function queryFlow({
    postParams
}) {
    return httputils.postJson(
        `/duoduo-service/workflow/work/query`,
        postParams
    );
}
//删除
export function delFlow({
    postParams
}) {
    return httputils.postJson(
        `/duoduo-service/workflow/work/delete`,
        postParams
    );
}
// 工程缺陷状态
export function flowStatus({
    postParams
}) {
    return httputils.postJson(
        `/duoduo-service/workflow/tracker/query`,
        postParams
    );
}
//新增项目缺陷
export function createWork({
    postParams
}) {
    return httputils.postJson(
        `/duoduo-service/workflow/work/create`,
        postParams
    );
}
//编辑
export function updateWork({
    postParams
}) {
    return httputils.postJson(
        `/duoduo-service/workflow/work/update`,
        postParams
    );
}
//修改记录
export function updateRecord({
    postParams
}) {
    return httputils.postJson(
        `/server/defect/queryChangeRecord`,
        postParams
    );
}
//权限
export function queryImmutableAttribute({
    postParams
}) {
    return httputils.postJson(
        `/duoduo-service/workflow/permission/queryMutableAttribute`,
        postParams
    );
}
//同意立项的权限
export function queryRouter({
    postParams
}) {
    return httputils.postJson(
        `/duoduo-service/workflow/permission/queryRouter`,
        postParams
    );
}
//项目编号的获取
export function queryObjectNum({
    getParams
}) {
    return httputils.getJson(
        ` /server/defect/getSerialNumber`,
        getParams
    );
}
// echarts
export function querySummaryNum({
    getParams
}) {
    return httputils.getJson(
        ` /server/defect/getSummary`,
        getParams
    );
}
export function queryMonthSummaryNum({
    getParams
}) {
    return httputils.getJson(
        ` /server/defect/getMonthSummary`,
        getParams
    );
}
