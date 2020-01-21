import httputils from "@/api/httputils";

// 保存有效期
export function saveValidity({ postParams }) {
    return httputils.postJson(
        `/duoduo-service/fm-service/sop/saveDuration`,
        postParams
    );
}
// 查询
export function queryValidity({ postParams }) {
    return httputils.postJson(
        `/duoduo-service/fm-service/sop/query`,
        postParams
    );
}
// 查询没有设定有效期的sop数量
export function queryValidityNull({ postParams }) {
    return httputils.postJson(
        `/duoduo-service/fm-service/sop/query`,
        postParams
    );
}
