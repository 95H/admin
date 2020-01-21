import httputils from "@/api/httputils";

// 13类积分类型
export function majorList({ getParams }) {
    return httputils.getJson(
        `/duoduo-service/manage-service/manage/major/list`,
        getParams
    );
}

// 等级和积分
// 等级定义查询
export function Definition({ postParams }) {
    return httputils.postJson(
        `/duoduo-service/manage-service/manage/level/def/query`,
        postParams
    );
}

// 查询项目下人员等级积分
export function ByProjectquery({ postParams }) {
    return httputils.postJson(
        `/server/manage/level/person/queryByProject`,
        postParams
    );
}

// 积分日志查询
export function IntegralLog({ postParams }) {
    return httputils.postJson(
        `/duoduo-service/manage-service/manage/point/log/query`,
        postParams
    );
}

// 金币
// 按项目查询人员金币
export function Goldcoins({ postParams }) {
    return httputils.postJson(
        `/server/manage/coin/person/queryByProject`,
        postParams
    );
}
// 成就
// 查询成就定义
export function ListAch({ getParams }) {
    return httputils.getJson(
        `/duoduo-service/manage-service/manage/achievement/def/list`,
        getParams
    );
}
// 按项目查询人员成就
export function ProjectAch({ postParams }) {
    return httputils.postJson(
        `/server/manage/achievement/person/queryByProject`,
        postParams
    );
}
