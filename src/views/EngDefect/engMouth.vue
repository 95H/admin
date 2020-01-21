<template>
    <div>
        <div class='content-statistics'>
            <p>
                <span>{{myMouthArr.createCount||0}}</span>
                <span>本月上线</span>
            </p>
            <p>
                <span>{{myMouthArr.approveCount||0}}</span>
                <span>本月立项</span>
            </p>
        </div>
        <div class='content-statistics'>
            <p>
                <span>{{myMouthArr.finishCount||0}}</span>
                <span>本月完成</span>
            </p>
            <p>
                <span>{{myMouthArr.terminateCount||0}}</span>
                <span>本月终止</span>
            </p>
        </div>
        <div class='content-statistics'>
            <p>
                <span>{{running}}</span>
                <span>进行中</span>
            </p>
            <p>
                <span>{{myMouthArr.overdueCount||0}}</span>
                <span>已逾期</span>
            </p>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {}
    },
    props: ['myMouthArr', 'running']
}
</script>
<style lang="scss" scoped>
.content-statistics {
    padding: 0 20px;
    display: flex;
    justify-content: space-around;
    p {
        span {
            display: block;
        }
    }
}
</style>