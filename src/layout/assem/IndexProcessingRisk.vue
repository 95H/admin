<template>
    <table-page-template>
        <el-table :data='processingRiskArr' border stripe slot='table' :height='`${tableHeight}px`'>
            <el-table-column type='expand' width='32'>
                <template slot-scope='props'>
                    <div class='expand-text'>
                        <span>要求完成时间:{{ props.row.cutoffTime }}</span>
                        <span>创建时间:{{ formatter(props.row.createTime) }}</span>
                        <span>创建人:{{ props.row.createUserName }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label='序号' prop='id' width='50' type='index'>
                <template slot-scope='scope'>
                    <div :class='(new Date(scope.row.cutoffTime.replace(/\./g,"/")).getTime()) < (new Date().getTime())?"red":""'>{{scope.$index+1}}</div>
                </template>
            </el-table-column>
            <el-table-column label='分类' prop width='70'>
                <template slot-scope='{row}'>
                    <div v-if='(new Date(row.cutoffTime.replace(/\./g,"/")).getTime()) < (new Date().getTime())' style='color:#D83931FF'>已逾期</div>
                    <div v-else>处理中</div>
                </template>
            </el-table-column>
            <el-table-column label='任务名称' prop='title' :show-overflow-tooltip='true'>
                <template slot-scope='{row}'>
                    <div :class='(new Date(row.cutoffTime.replace(/\./g,"/")).getTime()) < (new Date().getTime())?"red":""'>{{row.title}}</div>
                </template>
            </el-table-column>
            <el-table-column label='责任人' prop='chargeUser' width='83'>
                <template slot-scope='{row}'>
                    <div :class='(new Date(row.cutoffTime.replace(/\./g,"/")).getTime()) < (new Date().getTime())?"red":""'>{{row.chargeUser}}</div>
                </template>
            </el-table-column>
        </el-table>
    </table-page-template>
</template>
<script>
var moment = require('moment')
import 'moment/locale/zh-cn'
export default {
    data() {
        return {}
    },
    props: ['processingRiskArr'],
    methods: {
        //时间戳转换
        formatter(date) {
            return moment.unix(date / 1000).format('YYYY.MM.DD')
        }
    },
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
.expand-text {
    font-size: 12px;
    display: flex;
    justify-content: space-around;
    margin-left: 20px;
    padding-right: 10px;
}
.red {
    color: #d83931ff;
}
</style>