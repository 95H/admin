<template>
    <table-page-template>
        <el-table :data='myTaskArr' border stripe slot='table' :height='`${tableHeight}px`'>
            <el-table-column label='序号' width='50' type='index'>
                <template slot-scope='scope'>
                    <div :class='scope.row.overdueState==0?"red":""'>{{scope.$index+1}}</div>
                </template>
            </el-table-column>
            <el-table-column label='任务名称' :show-overflow-tooltip='true'>
                <template slot-scope='{row}'>
                    <div :class='row.overdueState==0?"red":""'>{{row.name}}</div>
                </template>
            </el-table-column>
            <el-table-column prop='askEndTime' label='要求完成时间' width='95'>
                <template slot-scope='{row}'>
                    <div
                        :class='row.overdueState==0?"red":""'
                    >{{`${row.askEndTime.substr(0,4)}.${row.askEndTime.substr(4,2)}.${row.askEndTime.substr(6,2)}`}}</div>
                </template>
            </el-table-column>
        </el-table>
    </table-page-template>
</template>
<script>
export default {
    data() {
        return {}
    },
    props: ['myTaskArr'],
    methods: {},
    mounted() {},
    computed: {
        tableHeight() {
            if (window.screen.height >= '1080') {
                return 210
            } else {
                return 120
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.red {
    color: #d83931ff;
}
</style>