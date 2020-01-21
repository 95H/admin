<template>
    <div class='detail-drawer'>
        <p class='p-style'>
            {{row.obj.localName}}策略详情
            <i class='el-icon-close' style='float:right;' @click='close'></i>
        </p>
        <div class='content'>
            <div class='bill-info'>
                <p class='bill-title'>最后一次工单信息</p>
                <p>
                    工单编号：{{work.woNumber || '--'}}
                    <span
                        class='gap'
                    >工单状态：{{work.orderState==2?'抢单中':(work.orderState==4?'未开始':(work.orderState==5?'执行中':(work.orderState==6?'审核中':(work.orderState==7?'延期完成':(work.orderState==8?'按时完成':(work.orderState==9?'异常结束':(work.orderState==10?'撤销':"--")))))))}}</span>
                    <span class='gap'>执行人：{{work.personList && work.personList[0]?work.personList[0].name:'--'}}</span>
                </p>
            </div>
            <div class='bill-info'>
                <p class='bill-title'>策略变更历史</p>
                <page-table>
                    <el-table :data='historyData' stripe slot='table' border>
                        <!-- <el-table-column label="修改时间" prop="modifyTime"></el-table-column> -->
                        <el-table-column label='创建人(账号)' prop='user.username' width='150'>
                            <template slot-scope='{row}'>{{row.user.realname}}({{row.user.username}})</template>
                        </el-table-column>
                        <el-table-column label='生效时间' prop='enableTime'>
                            <template slot-scope='{row,$index}'>
                                {{formatYear(row.enableTime)|| '--'}} 至 {{formatYear(row.unableTime)|| '--'}}
                                <span v-if='$index==0' class='del-style'>
                                    <i class='el-icon-delete' @click='delHandle(row)'></i>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label='操作' width='100'>
                            <template slot-scope='scope'>
                                <el-button @click='getDetailData(scope.row)' type='text' size='small'>查看</el-button>
                                <el-button v-if='scope.$index==0' @click='editClick(scope.row,null,scope.$index)' type='text' size='small'>编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </page-table>
                <p class='gray-style pad-botttom'>此显示的策略有效期：{{formatYear(every.enableTime)|| '--'}}至 {{formatYear(every.unableTime)|| '--'}}</p>
            </div>
            <div class='bill-info'>
                <p class='bill-title'>日期设定</p>
                <p style='margin-left:-90px;'>
                    当前正在使用＜{{calendar.name}}＞工作历
                    <opt-button text='点击查看' @click='look' />
                </p>
                <div v-for='(item,i) in calendar.operationCalendarList' :key='i+"i"'>
                    <p style='margin-left:-170px;' class='pad-bottom'>{{item.name}}:</p>
                    <p>
                        <span style='padding-left:40px'>开启时间</span>
                        <span class='gap'>关闭时间</span>
                    </p>
                    <div v-if='item.periods && item.periods.length>0' v-for='(time,j) in item.periods' :key='j+"j"'>
                        <p>
                            <span style='padding-left:40px'>{{formatSeconds(time.startTime) || '--'}}</span>
                            <span class='gap' style='margin-left:20px;'>{{formatSeconds(time.stopTime) || '--'}}</span>
                        </p>
                    </div>
                </div>
                <p style='margin-left:-220px;' class='pad-bottom' v-if='content.operationDateList'>例外日期设置：</p>
                <div v-if='content.operationDateList' v-for='(eve,index) in content.operationDateList' :key='index+"inx"'>
                    <p style='margin-left:-140px;'>{{formatDay(eve.beginDate) || '--'}} 至 {{formatDay(eve.endDate) || '--'}}</p>
                    <p>
                        <span>开启时间</span>
                        <span class='gap'>关闭时间</span>
                    </p>
                    <p v-if='eve.periods && eve.periods.length>0' v-for='(time,index) in eve.periods' :key='index+"r"'>
                        <span>{{formatSeconds(time.startTime) || '--'}}</span>
                        <span class='gap'>{{formatSeconds(time.stopTime) || '--'}}</span>
                    </p>
                </div>
                <p class='bill-title'>工单提前发出时间</p>
                <p>{{content.aheadTime}}分钟</p>
                <p class='bill-title'>关联的SOP</p>
                <p style v-if='allSop && allSop["start"] && allSop["start"].sopId == content.startSopId'>
                    开启：
                    <span style='display:inline-block;width:150px;'>{{allSop['start'].sopName|| '--'}}</span>
                </p>
                <p style='margin-right:5px;' v-if='allSop && allSop["stop"] && allSop["stop"].sopId == content.stopSopId'>
                    关闭：
                    <span style='display:inline-block;width:140px;'>{{allSop['stop'].sopName || '--'}}</span>
                </p>
                <p class='bill-title'>运行宽容时间</p>
                <p>
                    <span style='margin-left:85px'>前</span>
                    <span style='margin-left:50px'>后</span>
                </p>
                <p>
                    开启时刻:
                    <span class='gap'>{{content.foreStartTime || '--'}}分钟</span>
                    <span class='gap'>{{content.afterStartTime || '--'}}分钟</span>
                </p>
                <p>
                    关闭时刻:
                    <span class='gap'>{{content.foreStopTime || '--'}}分钟</span>
                    <span class='gap'>{{content.afterStopTime || '--'}}分钟</span>
                </p>
                <p class='bill-title'>策略执行方法</p>
                <p v-if='content.operateType==1'>人工执行</p>
                <p v-if='content.operateType==2'>带工作历的BA系统</p>
                <p v-if='content.operateType==3'>不带工作历的BA系统</p>
                <p v-if='content.operateType!=1'>调节日期及时间：</p>
                <p v-if='content.operateType!=1' v-for='(item,index) in content.baList' :key='index'>
                    {{index+1}}. {{formatYear(item.startTime) }}至 {{formatYear(item.stopTime) }}
                    <span>{{item.note}}</span>
                    <span v-if='allSop && allSop[index] && item.sopId==allSop[index].sopId'>{{allSop[index].sopName}}</span>
                </p>
                <p class='bill-title'>监测方案</p>
                <p>敏感度方案</p>
                <p v-if='content.sensitivity'>敏感度：{{content.sensitivity*100}}%</p>
                <p class='bill-title'>历史策略制定原因</p>
                <el-timeline style='margin-top:20px'>
                    <el-timeline-item
                        placement='top'
                        v-for='(reson,index) in resonData'
                        :key='"r"+index'
                        :timestamp='`${formatDate(reson.createTime)}`'
                    >
                        <el-card>
                            <p>{{reson.comment}}</p>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </div>
    </div>
</template>

<script>
var echarts = require('echarts')
import {
    downloadCalendar,
    queryStrategy,
    queryHistoryStrategy,
    queryCalendarName,
    getLastWorkOrder,
    queryAllSop,
    queryComment,
    deleteStrategy
} from '@/api/Strategy/strate.js'
import { queryWorkOrder } from '@/api/Warn/warn.js'
import { mapGetters } from 'vuex'
var moment = require('moment')
import 'moment/locale/zh-cn'
export default {
    components: {},
    data() {
        return {
            //selectedDay 日历
            historyData: [],
            resonData: [],
            content: {},
            calendar: {}, //反查回来的日历信息
            work: [],
            every: {},
            allSop: {}
        }
    },
    methods: {
        close() {
            this.$emit('close')
        },
        look() {
            let params = {
                postParams: {
                    criteria: {
                        type: 'calendarReport',
                        id: this.content.calendarId
                    }
                }
            }
            downloadCalendar(params)
        },
        editClick(row, column, index) {
            this.$router.push({
                path: '/baseOper/Strate/nextSeconds',
                query: {
                    objectId: row.objectId,
                    localName: this.row.obj.localName,
                    equipmentCategory: this.row.obj.equipmentCategory
                }
            })
        },
        getSopName(sopId, key) {
            let params = {
                postParams: {
                    criteria: {
                        sopId: sopId
                    }
                }
            }
            queryAllSop(params).then(res => {
                if (res.content && res.content.length > 0) {
                    this.allSop[key] = {
                        sopId: res.content[0].sopId,
                        sopName: res.content[0].sopName
                    }
                }
            })
        },
        getCalendarName(calendarId) {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId,
                        id: calendarId
                    },
                    withColumns: ['type']
                }
            }
            queryCalendarName(params).then(res => {
                if (res.content && res.content.length > 0) {
                    this.calendar = res.content[0]
                    this.calendar.operationCalendarList = []
                    let manageCalendarTypeList = this.calendar.manageCalendarTypeList
                    manageCalendarTypeList.forEach(i => {
                        this.content.operationCalendarList.forEach(j => {
                            if (i.type == j.dateType) {
                                let obj = {
                                    name: i.name,
                                    dateType: j.dateType,
                                    periods: j.periods
                                }
                                this.calendar.operationCalendarList.push(obj)
                            }
                        })
                    })
                }
            })
        },
        queryWork() {
            let params = {
                getParams: {
                    projectId: this.projectId,
                    objectId: this.row.obj.id
                }
            }
            getLastWorkOrder(params).then(res => {
                if (res.result == 'success') {
                    this.work = res
                }
            })
        },
        getHistory() {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId,
                        objectId: this.row.obj.id
                    },
                    orders: [
                        {
                            column: 'enableTime',
                            asc: false
                        }
                    ],
                    withColumns: ['strategy']
                }
            }
            queryHistoryStrategy(params).then(res => {
                if (res.result == 'success') {
                    if (res.content && res.content.length > 0) {
                        this.content = {}
                        this.historyData = res.content
                        this.every = this.historyData[0]
                        this.content = this.historyData[0].strategy
                        this.getCalendarName(this.content.calendarId)
                        this.queryReason(this.row.obj.id)
                        this.querySop()
                    }
                }
            })
        },
        querySop() {
            if (this.content.startSopId) {
                this.getSopName(this.content.startSopId, 'start')
            }
            if (this.content.stopSopId) {
                this.getSopName(this.content.stopSopId, 'stop')
            }
            if (this.content.baList) {
                this.content.baList.forEach((el, index) => {
                    this.getSopName(el.sopId, index)
                })
            }
        },
        getDetailData(row) {
            console.log(row)
            this.content = {}
            this.every = row
            this.content = row.strategy
            this.getCalendarName(this.content.calendarId)
            this.querySop()
        },
        queryReason(objectIds) {
            let params = {
                postParams: {
                    criteria: {
                        objectId: objectIds
                    },
                    orders: [
                        {
                            column: 'createTime',
                            asc: false
                        }
                    ]
                }
            }
            queryComment(params).then(res => {
                this.resonData = res.content
            })
        },
        //删除数据
        delHandle(row) {
            let vm = this
            console.log(row)
            this.$confirm('您是否不再管理此运行单元', '删除确认', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning',
                center: true
            })
                .then(() => {
                    vm.delete(row.objectId)
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
        },
        delete(id) {
            let params = {
                postParams: {
                    objectIds: [id]
                }
            }
            deleteStrategy(params).then(res => {
                if (res.data.result == 'success') {
                    this.$emit('handleDel')
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                }
            })
        },
        formatDay(day) {
            if (day) {
                return day.slice(0, 4) + '-' + day.slice(4, 6) + '-' + day.slice(6, 8)
            }
        },
        formatYear(time) {
            if (time) {
                return (
                    time.slice(0, 4) +
                    '-' +
                    time.slice(4, 6) +
                    '-' +
                    time.slice(6, 8) +
                    ' ' +
                    time.slice(8, 10) +
                    ':' +
                    time.slice(10, 12) +
                    ':' +
                    time.slice(12, 14)
                )
            }
        },
        formatSeconds(seconds) {
            if (seconds) {
                return seconds.slice(0, 2) + ':' + seconds.slice(2, 4)
            }
        },
        //时间戳转换
        formatDate(date) {
            return moment.unix(date / 1000).format('YYYY年MM月DD日 HH:mm')
        }
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    props: ['row'],
    mounted() {
        this.queryWork()
        this.getHistory()
    }
}
</script>

<style lang="scss" scoped>
.detail-drawer {
    padding: 20px 10px;
    position: relative;
    .p-style {
        font-size: 20px;
        padding-left: 20px;
    }
    .bill-info {
        text-align: center;
    }
    .bill-title {
        text-align: center;
        margin: 20px;
        font-size: 24px;
    }
    .gray-style {
        font-size: 14px;
        color: #ccc;
    }
    .gap {
        padding-left: 30px;
    }
    .pad-bottom {
        padding-top: 10px;
    }
    .del-style {
        float: right;
        display: none;
    }
    td:hover .del-style {
        display: inline-block;
    }
}
</style>
<style lang="scss" >
.detail-drawer {
    .el-drawer__header {
        font-size: 20px;
    }
    .el-drawer .rtl {
        width: 900px !important;
    }
    .el-slider__marks-text {
        color: #1989fa;
        font-size: 12px;
    }
    .block {
        margin-top: 20px;
        .el-slider {
            display: inline-block;
            width: 185px;
        }
    }
}
</style>