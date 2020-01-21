<template>
    <div class="plan-table">
        <table-page-template>
            <el-table :data="tableData" border stripe slot="table">
                <el-table-column label="个人信息" align="center">
                    <el-table-column label="姓名" prop="person.name" sortable></el-table-column>
                    <el-table-column label="岗位" prop="person.position.name" sortable></el-table-column>
                </el-table-column>
                <el-table-column label="笔试" align="center">
                    <el-table-column label="是否通过" prop="master.writtenState">
                        <template slot-scope="{row}">
                            <span :class="row.master.writtenState==1?'success':(row.master.writtenState==2?'fail':'nomal')">{{row.master.writtenState==1? "通过" :(row.master.writtenState ==2?"未通过":(row.master.writtenState ==3?"未参加考试":""))}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="考试日期" prop="master.writtenExamTime">
                        <template slot-scope="{row}">{{formatDate(row.master.writtenExamTime)}}</template>
                    </el-table-column>
                    <el-table-column label="下次考试日期" prop="writtenList[0].nextTime">
                        <template slot-scope="{row}">{{formatDate(row.master.writtenNextTime)}}</template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="实操考试" align="center">
                    <el-table-column label="是否通过" prop="master.operationState">
                        <template slot-scope="{row}">
                            <span :class="row.master.operationState==1?'success':(row.master.operationState==2?'fail':'nomal')">{{row.master.operationState ==1? "通过" :(row.master.operationState ==2?"未通过":(row.master.operationState ==3?"未参加考试":""))}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="考试日期" prop="master.operationExamTime">
                        <template slot-scope="{row}">{{formatDate(row.master.operationExamTime)}}</template>
                    </el-table-column>
                    <el-table-column label="下次考试日期" prop="master.operationNextTime">
                        <template slot-scope="{row}">{{formatDate(row.master.operationNextTime)}}</template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="应急演练" align="center">
                    <el-table-column label="是否通过" prop="emergencyList[0].state">
                        <template slot-scope="{row}">
                            <span :class="row.master.emergencyState==1?'success':(row.master.emergencyState==2?'fail':'nomal')">{{row.master.emergencyState==1? "通过" :(row.master.emergencyState ==2?"未通过":(row.master.emergencyState ==3?"未参加考试":""))}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="考试日期" prop="master.emergencyExamTime">
                        <template slot-scope="{row}">{{formatDate(row.master.emergencyExamTime)}}</template>
                    </el-table-column>
                    <el-table-column label="下次考试日期" prop="master.emergencyNextTime">
                        <template slot-scope="{row}">{{formatDate(row.master.emergencyNextTime)}}</template>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </table-page-template>
    </div>
</template>
<script>
var moment = require('moment')
import 'moment/locale/zh-cn'
export default {
    props: ['tableData'],
    deta() {
        return {}
    },
    methods: {
        formatDate(date) {
            if (date) {
                return moment.unix(date / 1000).format('YYYY-MM-DD')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.plan-table {
    margin-top: 15px;
    .fail {
        color: red;
    }
    .nomal {
        color: #606266;
    }
    .success {
        color: #4bcd9e;
    }
}
</style>
<style lang="scss">
.plan-table {
    .query-form {
        display: none;
    }
}
</style>


