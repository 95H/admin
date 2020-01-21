<template>
    <div class='content'>
        <div class='content-left'>
            <div class='content-left-top'></div>
            <div class='content-left-center'>
                <h4>项目工程缺陷</h4>
                <p>{{count}} 项</p>
                <div class='chart-a' style='margin-bottom:20px;'>
                    <eng-defect-chart v-if='Object.keys(defectList).length>0' :defectList='defectList'></eng-defect-chart>
                </div>
                <div class='chart-a'>
                    <eng-defect-ring-chart v-if='Object.keys(defectRing).length>0' :defectRing='defectRing'></eng-defect-ring-chart>
                </div>
                <h4>本月统计</h4>
                <eng-mouth :myMouthArr='myMouthArr' :running='running'></eng-mouth>
            </div>
            <div class='content-left-bttom'></div>
        </div>
        <div class='content-right'>
            <div class='content-right-box'>
                <div class='content-right-top'>
                    <el-form :inline='true' slot='form' size='mini'>
                        <el-form-item label='录入日期：'>
                            <el-date-picker
                                v-model='entryTime'
                                type='daterange'
                                range-separator='至'
                                start-placeholder='开始日期'
                                end-placeholder='结束日期'
                                value-format='yyyyMMddHHmmss'
                                style='width:212px'
                                align='right'
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item label='项目状态：'>
                            <el-select v-model='projectState' multiple style='width:300px;' placeholder='请选择项目状态'>
                                <el-option v-for='item in statusArr' :key='item.value' :label='item.label' :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label='节点负责人：'>
                            <el-select v-model='nodeUser' placeholder='请选择负责人' clearable>
                                <system-user-list></system-user-list>
                            </el-select>
                        </el-form-item>
                        <el-form-item label='影响范围：'>
                            <el-select v-model='fluence' multiple placeholder='请选择影响范围'>
                                <el-option v-for='item in fluenceArr' :key='item.value' :label='item.label' :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label='项目提交人：'>
                            <el-select v-model='projectUser' placeholder='请选择项目提交人' clearable>
                                <system-user-list></system-user-list>
                            </el-select>
                        </el-form-item>
                        <el-form-item label='节点要求完成日期：'>
                            <el-date-picker
                                v-model='readyTime'
                                type='daterange'
                                range-separator='至'
                                start-placeholder='开始日期'
                                end-placeholder='结束日期'
                                value-format='yyyyMMddHHmmss'
                                style='width:212px'
                                align='right'
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item label='缺陷类型：'>
                            <contain-all-select :list='categoryOPtions' :value='category' :width='`380px`' @input='changeInput'></contain-all-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type='primary' @click='screen'>筛选</el-button>
                            <el-button type='primary' @click='createMatter'>新建事项</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class='content-right-bottom'>
                    <page-table :total='pageData.total' :page='pageData.page' :size='pageData.size' @pageChanged='pageChanged'>
                        <el-table :data='pageData.defectArr' border stripe slot='table' @row-click='engTableDetail'>
                            <el-table-column prop='projectCode' type='expand'>
                                <template slot-scope='{row}'>
                                    <eng-drawer-detail v-if='Object.keys(row).length > 0' :id='row.id'></eng-drawer-detail>
                                </template>
                            </el-table-column>
                            <el-table-column label='项目编号' prop='projectCode' width='120'>
                                <template slot-scope='{row}'>
                                    <div>{{row.projectCode||'--'}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label='工程缺陷项目' :show-overflow-tooltip='true' prop='title'></el-table-column>
                            <el-table-column label='录入时间' width='95' prop='createTime'>
                                <template slot-scope='{row}'>
                                    <div>{{row.createTime?formatDate(row.createTime):'--'}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label='项目提交人' width='100' prop='createUser'>
                                <template slot-scope='{row}'>
                                    <div>{{formatterCode(row.createUser,userArr1)||'--'}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label='项目状态' width='80'>
                                <template slot-scope='{row}'>{{formatterCode(row.status,statusArr)}}</template>
                            </el-table-column>
                            <el-table-column label='项目负责人' width='100' prop='chargeUser'>
                                <template slot-scope='{row}'>
                                    <div>{{formatterCode(row.chargeUser,userArr1)||'--'}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label='缺陷类型' width='110' prop='category'></el-table-column>
                            <el-table-column label='影响范围' width='80' prop='effect'>
                                <template slot-scope='{row}'>
                                    <div>{{row.effect||'--'}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label='紧急程度' width='80' prop='priority'>
                                <template slot-scope='{row}'>
                                    <div>{{row.priority||'--'}}</div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </page-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import containAllSelect from './containAllSelect'
import EngDefectChart from './engDefectChart'
import EngDefectRingChart from './engDefectRingChart'
import EngMouth from './engMouth'
import userapi from '@/api/system/user'
import { mapGetters } from 'vuex'
import { queryFlow, flowStatus, querySummaryNum, queryMonthSummaryNum } from '@/api/EngDefect/EngDefect.js'
import SystemUserList from './systemuserList'
var moment = require('moment')
import 'moment/locale/zh-cn'
import EngDrawerDetail from './engDrawerDetail'
import { formatterCode } from '@/framework/utils/formatToClass'
export default {
    data() {
        return {
            drawer: false,
            formatterCode,
            userArr1: [],
            pageData: {
                page: 1,
                size: 10,
                total: 0,
                defectArr: []
            },
            count: '',
            defectList: {}, //echart图缺陷类别
            defectRing: {}, //echart图缺陷状态
            running: '', //进行中
            myMouthArr: {}, //本月统计
            entryTime: [], //录入时间
            readyTime: [], //要求完成时间
            projectState: [], //项目状态
            fluence: [], //影响范围
            fluenceArr: [
                {
                    value: '大',
                    label: '大'
                },
                {
                    value: '中',
                    label: '中'
                },
                {
                    value: '小',
                    label: '小'
                }
            ],
            category: [],
            categoryOPtions: [
                //工程缺陷类型
                {
                    value: '设计施工缺陷',
                    label: '设计施工缺陷'
                },
                {
                    value: '设备质量缺陷',
                    label: '设备质量缺陷'
                },
                {
                    value: '运营过程缺陷',
                    label: '运营过程缺陷'
                }
            ],
            nodeUser: '', //节点负责人
            projectUser: '' //项目负责人
        }
    },
    computed: {
        ...mapGetters(['projectId', 'statusArr'])
    },
    components: {
        containAllSelect,
        EngDefectChart,
        EngDefectRingChart,
        EngMouth,
        SystemUserList,
        EngDrawerDetail
    },
    provide(){
         return {
            query:this.query
        }
    },
    mounted() {
        this.query()
        this.findUser()
        this.queryStatus()
        this.queryEchart()
        this.userArr1 = JSON.parse(sessionStorage.getItem('userArr'))
    },
    methods: {
        query() {
            this.pageData.page = 1
            this.screen()
        },
        pageChanged(page, size) {
            this.pageData.page = page
            this.pageData.size = size
            this.screen(page, size)
        },
        //时间戳转换
        formatDate(date) {
            return moment.unix(date / 1000).format('YYYY.MM.DD')
        },
        engTableDetail(row, event, column) {
            console.log(row)
            this.drawer = true
        },
        changeInput(val) {
            this.category = val
        },
        queryEchart() {
            let params = {
                getParams: {
                    projectId: this.projectId
                }
            }
            querySummaryNum(params).then(res => {
                this.defectList = res.category ? res.category : {}
                this.defectRing = res.status ? res.status : {}
                this.running = res.status ? res.status.running : ''
                this.count = res.category ? res.category.total : ''
            })
            queryMonthSummaryNum(params).then(res => {
                this.myMouthArr = res ? res : {}
            })
        },
        // 查询节点负责人和项目提交人所有人员
        findUser() {
            let params = {
                criteria: {}
            }
            userapi.list(params).then(res => {
                let listArr = [],
                    userArr = []
                listArr = res.content ? res.content : []
                if (listArr.length > 0) {
                    listArr.forEach(el => {
                        let obj = {
                            value: el.ssoId,
                            label: el.realname
                        }
                        userArr.push(obj)
                    })
                    this.$store.commit('setUserArr', userArr)
                    sessionStorage.setItem('userArr', JSON.stringify(userArr))
                }
            })
        },
        // 查询工程缺陷
        screen() {
            let criteria = {
                projectId: this.projectId,
                trackerId: 1
            }
            if (this.fluence.length > 0) {
                criteria.effect = this.fluence
            }
            if (this.category.length > 0) {
                criteria.category = this.category
            }
            if (this.projectState.length > 0) {
                criteria.status = this.projectState
            }
            let params = {
                postParams: {
                    criteria: criteria,
                    orders: [
                        {
                            column: 'updateTime',
                            asc: false
                        }
                    ],
                    withColumns: ['customAttribute'],
                    page: this.pageData.page,
                    size: this.pageData.size
                }
            }
            if (this.projectUser) {
                criteria.createUser = this.projectUser
            }
            // 要求完成时间 节点负责人
            if (this.readyTime && this.readyTime.length > 0 && this.nodeUser) {
                criteria.child = {
                    askFinishTime: {
                        $gte: this.readyTime[0],
                        $lte: this.readyTime[1]
                    },
                    chargeUser: this.nodeUser
                }
            } else if (this.readyTime && this.readyTime.length > 0) {
                criteria.child = {
                    askFinishTime: {
                        $gte: this.readyTime[0],
                        $lte: this.readyTime[1]
                    }
                }
            } else if (this.nodeUser) {
                criteria.child = {
                    chargeUser: this.nodeUser
                }
            }
            if (this.entryTime && this.entryTime.length > 0) {
                criteria.createTime = {
                    $gte: this.entryTime[0],
                    $lte: this.entryTime[1]
                }
            }
            queryFlow(params).then(res => {
                this.pageData.defectArr = res.content ? res.content : []
                this.pageData.total = res.count ? res.count : 0
            })
        },
        // 新建事项
        createMatter() {
            this.$router.push({
                path: '/EngDefect/engCreateAndEdit',
                query: {
                    type: 'add'
                }
            })
        },
        //查询状态
        queryStatus() {
            let params = {
                postParams: {
                    criteria: {
                        id: 1
                    }
                }
            }
            flowStatus(params).then(res => {
                let arr = [],
                    status = []
                arr = res.content ? res.content[0].statuses : []
                if (arr.length > 0) {
                    arr.forEach(el => {
                        var obj = {
                            value: el.id,
                            label: el.name
                        }
                        status.push(obj)
                    })
                    this.$store.commit('setStatusArr', status)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.content {
    width: 100%;
    height: 100%;
    display: flex;

    .content-left {
        background: #fff;
        width: 300px;
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0 10px;
        margin: 0 auto;
        text-align: center;
        .content-left-top {
            width: 100%;
            height: 1px;
        }
        .content-left-center {
            width: 100%;
            flex: 1;
            overflow: auto;
            .chart-a {
                padding: 0 10px;
                height: 200px;
            }
        }
        .content-left-bottom {
            width: 100%;
            height: 1px;
        }
    }
    .content-right {
        background: #fff;
        flex: 1;
        margin-left: 5px;
        padding: 0 10px;
        .content-right-box {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: auto;
            .content-right-top {
                margin-top: 10px;
            }
            .content-right-bottom {
                flex: 1;
                overflow: auto;
            }
        }
    }
}
</style>
<style lang="scss">
.content {
    .data-table-pagination {
        position: absolute;
        bottom: 10px;
        right: 15px;
    }
}
</style>