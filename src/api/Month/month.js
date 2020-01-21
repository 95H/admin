import httputils from "@/api/httputils";

// 月报查询
export function queryMonthReport({ postParams }) {
    return httputils.postJson(
        `/duoduo-service/manage-service/manage/monthreport/query`,
        postParams
    );
}
//新增,编辑月报
export function saveMonthReport({ postParams }) {
    return httputils.postJson(
        `/duoduo-service/manage-service/manage/monthreport/save`,
        postParams
    );
}
//删除月报
export function deleteMonthReport({ postParams }) {
    return httputils.postJson(
        `/duoduo-service/manage-service/manage/monthreport/delete`,
        postParams
    );
}