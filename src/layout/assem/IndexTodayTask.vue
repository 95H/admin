<template>
    <table-page-template class='table-height'>
        <el-table :data='todayTaskArr' border stripe slot='table' :height='`${tableHeight}px`'>
            <el-table-column prop='taskId' label='序号' width='50' type='index'>
                <template slot-scope='scope'>
                    <div :class='scope.row.overdueState==0?"red":""'>{{scope.$index+1}}</div>
                </template>
            </el-table-column>
            <el-table-column prop='name' label='任务名称' :show-overflow-tooltip='true'>
                <template slot-scope='{row}'>
                    <div :class='row.overdueState==0?"red":""'>{{row.name}}</div>
                </template>
            </el-table-column>
            <el-table-column prop='principalPersonIdName' label='负责人' width='70'>
                <template slot-scope='{row}'>
                    <div :class='row.overdueState==0?"red":""'>{{row.principalPersonIdName}}</div>
                </template>
            </el-table-column>
            <el-table-column prop label='要求完成时间' width='95'>
                <template
                    slot-scope='{row}'
                    :class='row.overdueState==0?"red":""'
                >{{`${row.askEndTime.substr(0,4)}.${row.askEndTime.substr(4,2)}.${row.askEndTime.substr(6,2)}`}}</template>
            </el-table-column>
            <el-table-column prop label='实际完成时间' width='95'>
                <template slot-scope='{row}'>
                    <div
                        :class='row.overdueState==0?"red":""'
                    >{{`${row.finishTime.substr(0,4)}.${row.finishTime.substr(4,2)}.${row.finishTime.substr(6,2)}`}}</div>
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
    props: ['todayTaskArr'],
    methods: {},
    mounted() {},
    computed: {
        tableHeight() {
            if (window.screen.height >= '1080') {
                return 235
            } else {
                return 135
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