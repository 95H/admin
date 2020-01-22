<template>
    <div class='container'>
        <div class='layout-left'>
            <div class='layout-left-top'>
                <div class='layout-left-top-photo'>
                    <div class='layout-left-top-photo-box'>
                        <img
                            alt
                            :src='`http://api.sagacloud.cn/dp-auxiliary/image-service/common/file_get?systemId=dataPlatform&key=${pageObj.headPortrait}`'
                        />
                    </div>
                    <div class='layout-left-top-name'>
                        <span>{{pageObj.name}}</span>
                    </div>
                </div>
                <div class='layout-left-top-day'>
                    <p>累积已协管项目：</p>
                    <p>
                        <span>{{pageObj.projectDay}}</span>天
                    </p>
                    <p>累积已完成协管任务：</p>
                    <p>
                        <span>{{pageObj.completionItem}}</span>
                        项
                        <span>{{(pageObj.completionRate)*100}}%</span>完成率
                    </p>
                </div>
            </div>
            <div class='layout-left-bottom'>
                <index-addree></index-addree>
            </div>
        </div>
        <div class='layout-right-out'>
            <div class='layout-right-in'>
                <div class='layout-center'>
                    <div class='layout-center-top layout-center-p' :style='`height:${heightTable}px`'>
                        <div class='my-p'>
                            <span></span>
                            <span>我的协管任务</span>
                        </div>
                        <index-my-task :myTaskArr='myTaskArr'></index-my-task>
                    </div>
                    <div class='layout-center-center layout-center-p' :style='`height:${heightTable}px`'>
                        <div class='my-p'>
                            <span></span>
                            <span>他人负责未完成的协管任务</span>
                        </div>
                        <index-others-task :othersTaskArr='othersTaskArr'></index-others-task>
                    </div>
                    <div class='layout-center-bottom layout-center-p'>
                        <div class='my-p'>
                            <span></span>
                            <span>今日已完成的协管任务</span>
                        </div>
                        <index-today-task :todayTaskArr='todayTaskArr'></index-today-task>
                    </div>
                    <div class='layout-center-null'></div>
                </div>
                <div class='layout-right'>
                    <div class='layout-right-in'>
                        <div class='layout-right-top layout-right-p' :style='`height:${heightTable}px`'>
                            <div class='my-p'>
                                <span></span>
                                <span>待处理的督办事项</span>
                            </div>
                            <index-pedding-risk :peddingRiskArr='peddingRiskArr'></index-pedding-risk>
                        </div>
                        <div class='layout-right-center layout-right-p' :style='`height:${heightTable}px`'>
                            <div class='my-p'>
                                <span></span>
                                <span>处理中的督办事项</span>
                            </div>
                            <index-processing-risk :processingRiskArr='processingRiskArr'></index-processing-risk>
                        </div>
                        <div class='layout-right-bottom layout-right-p'>
                            <div class='my-p'>
                                <span></span>
                                <span>风险监控</span>
                            </div>
                            <index-risk-monitoring :riskMonitoringArr='riskMonitoringArr'></index-risk-monitoring>
                        </div>
                        <div class='layout-right-null'></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
var moment = require('moment')
import 'moment/locale/zh-cn'
import { mapGetters } from 'vuex'
import store from '@/store'
import IndexAddree from './assem/IndexAddress'
import IndexMyTask from './assem/IndexMyTask'
import IndexOthersTask from './assem/IndexOthersTask'
import IndexPeddingRisk from './assem/IndexPeddingRisk'
import IndexProcessingRisk from './assem/IndexProcessingRisk'
import IndexRiskMonitoring from './assem/IndexRiskMonitoring'
import IndexTodayTask from './assem/IndexTodayTask'
import { queryUser, queryTaskList, queryRisk, queryDefine } from '@/api/page/page.js'
export default {
    data() {
        return {
            pageObj: {
                projectDay: '', //累积已协管项目
                completionRate: '', //完成率
                completionItem: '', //完成项
                name: '',
                headPortrait: ''
            },
            myTaskArr: [], //我的协管任务
            myTaskArrObj: [],
            othersTaskArr: [], //他人负责未完成的协管任务
            todayTaskArr: [], //今日已完成的协管任务
            peddingRiskArr: [], //待处理的督办事项
            processingRiskArr: [], //处理中的督办事项
            riskMonitoringArr: [] //风险监控
        }
    },
    components: {
        IndexAddree,
        IndexMyTask,
        IndexOthersTask,
        IndexPeddingRisk,
        IndexProcessingRisk,
        IndexRiskMonitoring,
        IndexTodayTask
    },
    computed: {
        ...mapGetters(['projectId']),
        heightTable() {
            if (window.screen.height >= '1080') {
                return 250
            } else {
                return 160
            }
        }
    },
    methods: {
        // 累计协管项目
        init() {
            let params = {
                getParams: {
                    projectId: this.projectId,
                    personId: store.state.layout.userInfo.fmPersonId
                }
            }
            if (store.state.layout.userInfo.fmPersonId) {
                queryUser(params).then(res => {
                    if (res.result == 'success') {
                        this.pageObj = res.content
                        this.pageObj.projectDay = res.content.mngTotalDay
                        this.pageObj.completionRate = res.content.finishRate
                        this.pageObj.completionItem = res.content.mngTotalFinishEvent
                        this.pageObj.name = res.content.name
                        this.pageObj.headPortrait = res.content.headPortrait
                    }
                })
            } else {
                return
            }
        },
        // 我的协管任务 他人负责未完成的协管任务
        myCooperatingTask() {
            this.myTaskArr = []
            this.othersTaskArr = []
            let params = {
                postParams: {
                    orderField: 'ask_end_time',
                    orderby: 'asc',
                    state: ['0', '2', '5', '6'],
                    projectId: this.projectId
                }
            }
            queryTaskList(params).then(res => {
                this.myTaskArrObj = res.content ? res.content : []
                if (this.myTaskArrObj) {
                    this.myTaskArrObj.forEach(el => {
                        let obj1 = {},
                            obj2 = {}
                        if (el.principalPersonId == store.state.layout.userInfo.fmPersonId) {
                            let obj1 = {
                                taskId: el.taskId,
                                askEndTime: el.askEndTime,
                                finishTime: el.finishTime,
                                name: el.name,
                                overdueState: el.overdueState,
                                principalPersonId: el.principalPersonId,
                                principalPersonName: el.principalPersonName,
                                state: el.state,
                                taskId: el.taskId
                            }
                            this.myTaskArr.push(obj1)
                        } else {
                            let obj2 = {
                                taskId: el.taskId,
                                askEndTime: el.askEndTime,
                                finishTime: el.finishTime,
                                name: el.name,
                                overdueState: el.overdueState,
                                principalPersonId: el.principalPersonId,
                                principalPersonName: el.principalPersonName,
                                state: el.state,
                                taskId: el.taskId
                            }
                            this.othersTaskArr.push(obj2)
                        }
                    })
                }
            })
        },
        // 今日已完成的协管任务
        todayReadyTaskList() {
            this.todayTaskArr = []
            let params = {
                postParams: {
                    orderField: 'ask_end_time',
                    orderby: 'asc',
                    state: ['1'],
                    projectId: this.projectId,
                    finishTime: moment().format('YYYYMMDD')
                }
            }
            queryTaskList(params).then(res => {
                this.todayTaskArr = res.content ? res.content : []
            })
        },
        // 待处理督办事项
        PendingSupervisionMatters() {
            this.peddingRiskArr = []
            let params = {
                postParams: {
                    criteria: {
                        status: '1',
                        projectId: this.projectId
                    },
                    orders: [
                        {
                            column: 'cutoffTime',
                            asc: true
                        }
                    ]
                }
            }
            queryRisk(params).then(res => {
                this.peddingRiskArr = res.content ? res.content : []
            })
        },
        // 处理中督办事项
        HandlingSupervisionMatters() {
            this.processingRiskArr = []
            let params = {
                postParams: {
                    criteria: {
                        status: '2',
                        projectId: this.projectId
                    },
                    orders: [
                        {
                            column: 'cutoffTime',
                            asc: true
                        }
                    ]
                }
            }
            queryRisk(params).then(res => {
                this.processingRiskArr = res.content ? res.content : []
            })
        },
        // 查询风险监控
        riskMonitoring() {
            this.riskMonitoringArr = []
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId,
                        c4: {
                            $null: false
                        }
                    },
                    orders: [
                        {
                            column: 'value',
                            asc: false
                        }
                    ]
                }
            }
            queryDefine(params).then(res => {
                let arr = [],
                    arr1 = []
                arr = res.data.content ? res.data.content : []
                if (arr) {
                    arr.forEach(el => {
                        let obj = {
                            explain: el.c4str,
                            value: el.value,
                            upperLimit: el.upperLimit
                        }
                        arr1.push(obj)
                    })
                }
                this.riskMonitoringArr = arr1.slice(0, 10)
            })
        }
    },
    mounted() {
        this.init()
        this.myCooperatingTask()
        this.todayReadyTaskList()
        this.PendingSupervisionMatters()
        this.HandlingSupervisionMatters()
        this.riskMonitoring()
    }
}
</script>
<style lang="scss" scoped>
.container {
    display: flex;
    overflow: hidden;
    .layout-left {
        width: 280px;
        display: flex;
        flex-direction: column;
        height: 100%;
        .layout-left-top {
            background: #fff;
            height: 160px;
            display: flex;
            justify-content: space-between;
            .layout-left-top-photo {
                margin: auto auto;
                .layout-left-top-photo-box {
                    width: 90px;
                    height: 90px;
                    border-radius: 90px;
                    border: 1px solid rgba(65, 158, 255, 1);
                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 90px;
                    }
                }
                .layout-left-top-name {
                    width: 80%;
                    margin: 10px;
                    height: 25px;
                    background: rgba(65, 158, 255, 1);
                    border-radius: 19px;
                    color: rgba(255, 255, 255, 1);
                    line-height: 25px;
                    span {
                        display: inline-block;
                        width: 100%;
                        text-align: center;
                    }
                }
            }
            .layout-left-top-day {
                width: 58%;
                margin: auto auto;
                p {
                    margin: 15px 0;
                }
                p:nth-of-type(2) {
                    text-align: right;
                    margin-right: 10%;

                    span {
                        display: inline-block;
                        width: 50px;
                        text-align: center;
                    }
                }
                p:nth-of-type(3) {
                    min-width: 140px;
                }
                p:nth-of-type(4) {
                    display: flex;
                    justify-content: space-around;
                }
            }
        }
        .layout-left-bottom {
            flex: 1;
            background: #fff;
            margin-top: 10px;
            margin-bottom: 1px;
        }
    }
    .layout-right-out {
        margin-left: 10px;
        flex: 1;
        .layout-right-in {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            .layout-center {
                width: 55%;
                margin-right: 10px;
                height: 100%;
                display: flex;
                flex-direction: column;
                .layout-center-top {
                    // height: 250px;
                    padding: 5px 10px;
                    background: #fff;
                }
                .layout-center-center {
                    background: #fff;
                    margin: 10px 0;
                    padding: 5px 10px;
                    // height: 250px;
                }
                .layout-center-bottom {
                    background: #fff;
                    padding: 5px 10px;
                    flex: 1;
                }
                .layout-center-p {
                    .my-p {
                        margin-bottom: 5px;
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                        span {
                            display: block;
                        }
                        span:first-child {
                            width: 3px;
                            height: 14px;
                            background: rgba(65, 158, 255, 1);
                            margin-right: 8px;
                        }
                        span:last-child {
                            color: rgba(31, 35, 41, 1);
                            height: 31px;
                            line-height: 31px;
                            font-size: 16px;
                        }
                    }
                }
                .layout-center-null {
                    height: 1px;
                }
            }
            .layout-right {
                flex: 1;
                height: 100%;
                .layout-right-in {
                    display: flex;
                    flex-direction: column;
                    .layout-right-top {
                        background: #fff;
                        padding: 5px 10px;
                        // height: 200px;
                    }
                    .layout-right-center {
                        padding: 5px 10px;
                        background: #fff;
                        margin: 10px 0;
                        // height: 200px;
                    }
                    .layout-right-bottom {
                        padding: 5px 10px;
                        background: #fff;
                        flex: 1;
                    }
                    .layout-right-p {
                        .my-p {
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;
                            margin-bottom: 5px;
                            span {
                                display: block;
                            }
                            span:first-child {
                                width: 3px;
                                height: 14px;
                                background: rgba(65, 158, 255, 1);
                                margin-right: 8px;
                            }
                            span:last-child {
                                color: rgba(31, 35, 41, 1);
                                height: 31px;
                                line-height: 31px;
                                font-size: 16px;
                            }
                        }
                    }
                    .layout-right-null {
                        height: 1px;
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
.container {
    .el-table {
        font-size: 12px;
    }
    .el-table td,
    .el-table th {
        padding: 4px 0;
    }
    .el-row {
        height: 100%;
        .el-col {
            height: 100%;
        }
    }
}
.layout-center {
    .query-form {
        display: none;
    }
}
.layout-right {
    .query-form {
        display: none;
    }
}
</style>