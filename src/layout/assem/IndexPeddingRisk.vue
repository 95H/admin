<template>
    <table-page-template>
        <el-table :data='peddingRiskArr' border stripe slot='table' :height='`${tableHeight}px`'>
            <el-table-column label='序号' prop width='50' type='index'></el-table-column>
            <el-table-column label='督办事项' prop='title' :show-overflow-tooltip='true'></el-table-column>
            <el-table-column label='创建人' prop='createUserName' width='75'></el-table-column>
            <el-table-column label='创建时间' prop='createTime' width='114'>
                <template slot-scope='{row}'>{{formatter(row.createTime)}}</template>
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
    props: ['peddingRiskArr'],
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
</style>