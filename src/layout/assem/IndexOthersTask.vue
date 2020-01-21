<template>
    <table-page-template>
        <el-table :data='othersTaskArr' border stripe slot='table' :height='`${tableHeight}px`'>
            <el-table-column label='序号' width='50' type='index'>
                <template slot-scope='scope'>
                    <div :class='scope.row.overdueState==0?"red":""'>{{scope.$index+1}}</div>
                </template>
            </el-table-column>
            <el-table-column prop='askEndTime' label='任务名称' :show-overflow-tooltip='true'>
                <template slot-scope='{row}'>
                    <div :class='row.overdueState==0?"red":""'>{{row.name}}</div>
                </template>
            </el-table-column>
            <el-table-column prop label='负责人' width='70'>
                <template slot-scope='{row}'>
                    <div :class='row.overdueState==0?"red":""'>{{row.principalPersonName}}</div>
                </template>
            </el-table-column>
            <el-table-column prop='askEndTime' label='要求完成时间' width='105'>
                <template slot-scope='{row}'>
                    <div
                        :class='row.overdueState==0?"red":""'
                    >{{`${row.askEndTime.substr(0,4)}.${row.askEndTime.substr(4,2)}.${row.askEndTime.substr(6,2)}`}}</div>
                </template>
            </el-table-column>
            <el-table-column prop='state' label='任务状态' width='80'>
                <template slot-scope='{row}'>
                    <div v-if='row.overdueState==0' style='color:#D83931FF'>已逾期</div>
                    <div v-if='row.overdueState==1&&row.state==0'>未提交</div>
                    <div v-if='row.overdueState==1&&row.state==2'>已驳回</div>
                    <div v-if='row.overdueState==1&&row.state==5'>审核中</div>
                    <div v-if='row.overdueState==1&&row.state==6'>不同意</div>
                    <div v-if='row.overdueState==1&&row.state==1'>已完成</div>
                    <div v-if='row.overdueState==1&&row.state==3'>已终止</div>
                    <div v-if='row.overdueState==1&&row.state==4'>已完成</div>
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
    props: ['othersTaskArr'],
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