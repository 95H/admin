<template>
    <div style='height:100%'>
        <div class='top'>
            <div class='top-title'>
                <span>当前监控运行单元数</span>
                <span class='green'>{{numObj.runSize}}</span>
            </div>

            <div class='top-title'>
                <span>本月总动作数</span>
                <span class='green'>{{numObj.allActionSize}}</span>
            </div>
            <div class='top-title'>
                <span>本月已执行动作数</span>
                <span class='green'>{{numObj.executedActionSize}}</span>
            </div>
            <div class='top-title'>
                <span>本月报警条数</span>
                <span class='red'>{{numObj.alarmSize}}</span>
            </div>
        </div>
        <div class='center'>
            <div class='center-box'>
                <p class='box-left'></p>
                <p class='box-center'>
                    <span>{{year}}</span>年
                    <span>{{mouth}}</span>月
                </p>
                <p class='box-right'></p>
                <div class='center-out' @click='beforeButton'></div>
                <div class='center-outs' @click='afterButton'></div>
            </div>
        </div>
        <div class='bottom'>
            <p class='bottom-span' v-if='calculateTime'>
                以下结果，基于
                <span>{{calculateTime}}</span> 统计
            </p>
            <div class='bottom-out' style='margin-bottom: 2%;'>
                <div class='outBox'>
                    <operation-result :mouth='mouth' v-if='Object.keys(operatiObj).length>0' :operatiObj='operatiObj'></operation-result>
                </div>
                <div class='outBox'>
                    <operation-method :mouth='mouth' v-if='Object.keys(staffExecuteObj).length>0' :staffExecuteObj='staffExecuteObj'></operation-method>
                </div>
                <div class='outBox'>
                    <number-operation-orders :mouth='mouth' v-if='workorderList.length>0' :workorderList='workorderList'></number-operation-orders>
                </div>
            </div>
            <div class='bottom-out'>
                <div class='outBox'>
                    <completion-status :mouth='mouth' v-if='Object.keys(workOrderObj).length>0' :workOrderObj='workOrderObj'></completion-status>
                </div>
                <div class='outBox'>
                    <alarm-number :mouth='mouth' v-if='Object.keys(workAlarmObj).length>0' :workAlarmObj='workAlarmObj'></alarm-number>
                </div>
                <div class='outBox'>
                    <alarm-content v-if='Object.keys(alarmContentObj).length>0' :mouth='mouth' :alarmContentObj='alarmContentObj'></alarm-content>
                </div>
            </div>
        </div>
    </div>
    <!-- <alarm-time-method :mouth='mouth'></alarm-time-method> -->
</template>
<script>
var moment = require('moment')
import 'moment/locale/zh-cn'
import echarts from 'echarts'
import { mapGetters } from 'vuex'
import { queryInformation, queryStatistics } from '@/api/Run/run.js'
import OperationResult from './operationResult' //运行单元运行结果统计
import OperationMethod from './operationMethod' //运行单元执行方法统计
import NumberOperationOrders from './numberOperationOrders' //运行工单数统计
import CompletionStatus from './completionStatus' //运行工单完成情况统计
import AlarmNumber from './alarmNumber' //各类识别方法识别的报警条数统计
import AlarmTimeMethod from './alarmTimeMethod' //报警时执行方法统计
import AlarmContent from './alarmContent' //报警内容统计

export default {
    name: 'run',
    data() {
        return {
            timer: '',
            year: 0,
            mouth: 0,
            day: 0,
            hour: 0,
            numObj: {}, //顶部
            calculateTime: '', //时间
            StatisticsObj: {}, //总的数据
            workorderList: [], //对应月运行工单数统计
            operatiObj: {}, //运行单元运行结果统计
            staffExecuteObj: {}, //运行单元执行方法统计
            workOrderObj: {}, //运行工单完成情况统计
            workAlarmObj: {}, //各类识别方法识别的报警条数
            alarmContentObj: {} //报警内容统计
        }
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    components: {
        OperationResult,
        OperationMethod,
        NumberOperationOrders,
        CompletionStatus,
        AlarmNumber,
        AlarmTimeMethod,
        AlarmContent
    },
    mounted() {
        this.init()
        this.queryNum()
        this.queryDate()
    },
    methods: {
        init() {
            let now = moment(new Date())
                .add('year', 0)
                .format('YYYYMMDD HH:mm:ss')
            if (now) {
                this.year = Number(now.slice(0, 4))
                this.mouth = Number(now.slice(4, 6))
                this.day = Number(now.slice(6, 8)) + 1
                this.hour = now.slice(8, 17)
            }
        },
        formatDate(date) {
            return moment.unix(date / 1000).format('YYYY-MM-DD HH:mm:ss')
        },
        beforeButton() {
            if (this.mouth > 1) {
                this.mouth -= 1
            } else {
                this.mouth = 12
                this.year -= 1
            }
            this.queryDate()
        },
        afterButton() {
            if (this.mouth < 12) {
                this.mouth += 1
            } else if (this.mouth == 12) {
                this.mouth = 1
                this.year += 1
            }
            this.queryDate()
        },
        format(year, mouth) {
            if (mouth < 10 && mouth > 0) {
                mouth = '0' + mouth
            } else {
                mouth = mouth
            }
            let newNum = String(year) + String(mouth)
            return newNum
        },
        // 查询信息栏
        queryNum() {
            let params = {
                getParams: {
                    projectId: this.projectId
                }
            }
            queryInformation(params).then(res => {
                if (res.result == 'success') {
                    this.numObj = res.content
                }
            })
        },
        // 月运行总览统计
        queryDate() {
            this.StatisticsObj = {}
            this.workorderList = []
            this.operatiObj = {}
            this.staffExecuteObj = {}
            this.workOrderObj = {}
            this.workAlarmObj = {}
            this.alarmContentObj = {}
            this.calculateTime = ''
            let date = this.format(String(this.year), String(this.mouth))
            let params = {
                getParams: {
                    projectId: this.projectId,
                    date: date
                }
            }
            queryStatistics(params).then(res => {
                if (res.result == 'success') {
                    if (res.content) {
                        this.StatisticsObj = res.content
                        this.calculateTime = this.formatDate(this.StatisticsObj.calculateTime)
                        let newData = []
                        if (this.StatisticsObj.workorderList) {
                            this.StatisticsObj.workorderList.forEach(el => {
                                if (el.weekOfTheMonth == 0) {
                                    newData[0] = el.size
                                } else if (el.weekOfTheMonth == 1) {
                                    newData[1] = el.size
                                } else if (el.weekOfTheMonth == 2) {
                                    newData[2] = el.size
                                } else if (el.weekOfTheMonth == 3) {
                                    newData[3] = el.size
                                } else if (el.weekOfTheMonth == 4) {
                                    newData[4] = el.size
                                }
                            })
                        }
                        this.workorderList = newData
                        this.operatiObj.isNotAlarmRunSize = this.StatisticsObj.isNotAlarmRunSize
                        this.operatiObj.isAlarmRunSize = this.StatisticsObj.isAlarmRunSize
                        this.operatiObj.isNotAlarmRunSizeRate = this.StatisticsObj.isNotAlarmRunSizeRate
                        this.operatiObj.isAlarmRunSizeRate = this.StatisticsObj.isAlarmRunSizeRate
                        this.staffExecuteObj.staffExecuteRunSize = this.StatisticsObj.staffExecuteRunSize
                        this.staffExecuteObj.isBAExecuteRunSize = this.StatisticsObj.isBAExecuteRunSize
                        this.staffExecuteObj.isNotBAExecuteRunSize = this.StatisticsObj.isNotBAExecuteRunSize
                        this.staffExecuteObj.staffExecuteRunSizeRate = this.StatisticsObj.staffExecuteRunSizeRate
                        this.staffExecuteObj.isBAExecuteRunSizeRate = this.StatisticsObj.isBAExecuteRunSizeRate
                        this.staffExecuteObj.isNotBAExecuteRunSizeRate = this.StatisticsObj.isNotBAExecuteRunSizeRate
                        this.workOrderObj.finishWorkorderSize = this.StatisticsObj.finishWorkorderSize
                        this.workOrderObj.delayFinishWorkorderSize = this.StatisticsObj.delayFinishWorkorderSize
                        this.workOrderObj.restsWorkorderSize = this.StatisticsObj.restsWorkorderSize
                        this.workOrderObj.finishWorkorderSizeRate = this.StatisticsObj.finishWorkorderSizeRate
                        this.workOrderObj.delayFinishWorkorderSizeRate = this.StatisticsObj.delayFinishWorkorderSizeRate
                        this.workOrderObj.restsWorkorderSizeRate = this.StatisticsObj.restsWorkorderSizeRate
                        this.workAlarmObj.sensorAlarmSize = this.StatisticsObj.sensorAlarmSize
                        this.workAlarmObj.workorderAlarmSize = this.StatisticsObj.workorderAlarmSize
                        this.alarmContentObj.openExecptionalAlarmSize = this.StatisticsObj.openExecptionalAlarmSize
                        this.alarmContentObj.closeExecptionalAlarmSize = this.StatisticsObj.closeExecptionalAlarmSize
                        this.alarmContentObj.execptionalOpenAlarmSize = this.StatisticsObj.execptionalOpenAlarmSize
                        this.alarmContentObj.execptionalCloseAlarmSize = this.StatisticsObj.execptionalCloseAlarmSize
                        this.alarmContentObj.openExecptionalAlarmSizeRate = this.StatisticsObj.openExecptionalAlarmSizeRate
                        this.alarmContentObj.closeExecptionalAlarmSizeRate = this.StatisticsObj.closeExecptionalAlarmSizeRate
                        this.alarmContentObj.execptionalOpenAlarmSizeRate = this.StatisticsObj.execptionalOpenAlarmSizeRate
                        this.alarmContentObj.execptionalCloseAlarmSizeRate = this.StatisticsObj.execptionalCloseAlarmSizeRate
                    } else {
                        this.alarmContentObj = {
                            openExecptionalAlarmSize: 0,
                            closeExecptionalAlarmSize: 0,
                            execptionalOpenAlarmSize: 0,
                            execptionalCloseAlarmSize: 0,
                            openExecptionalAlarmSizeRate: 0,
                            closeExecptionalAlarmSizeRate: 0,
                            execptionalOpenAlarmSizeRate: 0,
                            execptionalCloseAlarmSizeRate: 0
                        }
                        this.workAlarmObj = {
                            sensorAlarmSize: 0,
                            workorderAlarmSize: 0
                        }
                        this.operatiObj = {
                            isNotAlarmRunSize: 0,
                            isAlarmRunSize: 0,
                            isNotAlarmRunSizeRate: 0,
                            isAlarmRunSizeRate: 0
                        }
                        this.staffExecuteObj = {
                            staffExecuteRunSize: 0,
                            isBAExecuteRunSize: 0,
                            isNotBAExecuteRunSize: 0,
                            staffExecuteRunSizeRate: 0,
                            isBAExecuteRunSizeRate: 0,
                            isNotBAExecuteRunSizeRate: 0
                        }
                        this.workOrderObj = {
                            finishWorkorderSize: 0,
                            delayFinishWorkorderSize: 0,
                            restsWorkorderSize: 0,
                            finishWorkorderSizeRate: 0,
                            delayFinishWorkorderSizeRate: 0,
                            restsWorkorderSizeRate: 0
                        }
                        this.workorderList = [0, 0, 0, 0]
                    }
                }
            })
        }
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
.top {
    height: 15%;
    background: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .top-title {
        display: flex;
        align-items: center;
        span:nth-of-type(1) {
            color: #000;
            margin-right: 10px;
            font-size: 16px;
        }
        span:nth-of-type(2) {
            margin-left: 10px;
            font-size: 28px;
        }
        .green {
            color: #5ad19e;
        }
        .red {
            color: #ea605a;
        }
    }
}
.center {
    height: 5%;
    background: #f2f2f2;
    display: flex;
    .center-box {
        margin: 0 auto;
        margin-top: 1%;
        display: flex;
        align-items: center;
        position: relative;
        .center-out {
            cursor: pointer;
            position: absolute;
            top: -15px;
            left: -30px;
            width: 50px;
            height: 50px;
        }
        .center-outs {
            cursor: pointer;
            position: absolute;
            top: -15px;
            right: -30px;
            width: 50px;
            height: 50px;
        }
        .box-left {
            width: 0;
            height: 0;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-right: 5px solid #000;
        }
        .box-center {
            font-size: 18px;
            margin: 0 20px;
            display: flex;
            align-items: center;
            span {
                margin-right: 10px;
            }
            span:nth-of-type(1) {
                width: 45px;
                display: inline-block;
            }
            span:nth-of-type(2) {
                margin-left: 10px;
                width: 25px;
                display: inline-block;
            }
        }
        .box-right {
            width: 0;
            height: 0;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-left: 5px solid #000;
        }
    }
}
.bottom {
    height: 70%;
    margin-top: 2%;
    position: relative;
    .bottom-span {
        position: absolute;
        right: 2%;
        top: -8%;
        span {
            display: inline-block;
            width: 150px;
            text-align: center;
        }
    }
    .bottom-out {
        display: flex;
        height: 50%;
        .outBox {
            margin: 0 1%;
            width: 100%;
            height: 100%;
            box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
            background-color: #fff;
            color: #303133;
            border-radius: 4px;
        }
    }
}
</style>