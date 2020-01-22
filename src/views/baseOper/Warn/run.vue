<template>
    <div class='run'>
        <el-button type='info' style='margin-left:10px;' icon='el-icon-arrow-left' @click='back'>返回</el-button>
        <div class='run-content'>
            <div class='content-left'>
                <div class='left-top'>
                    <el-form>
                        <el-form-item label='专业/系统/设备类:'>
                            <el-cascader
                                :options='$store.state.categoryArr.equipmentAll'
                                v-model='devValue'
                                :show-all-levels='false'
                                placeholder='全部专业系统设备类'
                                :props='configObj'
                                @change='getData'
                                clearable
                            ></el-cascader>
                        </el-form-item>
                        <el-form-item label='计划组：'>
                            <el-select v-model='groupId' placeholder @change='getData' clearable>
                                <el-option v-for='item in planOptions' :key='item.value' :label='item.label' :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div class='left-bottom'>
                    <el-table
                        v-if='resultData.length>0'
                        :data='resultData'
                        @row-click='handleNodeClick'
                        style='width: 100%;'
                        row-key='id'
                        border
                        :tree-props='{children: "children", hasChildren: "hasChildren"}'
                    >
                        <el-table-column prop='label'>
                            <template slot-scope='{row}' v-if='row.label'>
                                <span class='span-style' :class='row.children==0?"pad-style":""'>{{row.label.split(',')[0]}}</span>
                                <span>{{row.label.split(',')[1]}}</span>
                                <span v-if='row.alarmCount > 0'>
                                    <i class='iconfont icon-warning' style='color:red'></i>
                                </span>
                                <span v-else-if='(row.children && row.alarmCount==0 && row.subAlarmCount > 0)'>
                                    <i class='iconfont icon-warning1'></i>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class='content-right'>
                <p class='p-style'>
                    {{objectLocalName}}
                    <el-date-picker
                        style='float:right;margin-right:20px;'
                        v-model='date1'
                        format='yyyy-MM-dd'
                        value-format='yyyyMMdd'
                        type='date'
                        size='small'
                        placeholder='选择日期'
                        :picker-options='pickerOptions'
                        @change='changeTime'
                    ></el-date-picker>
                </p>
                <div>
                    <p class='text-style' v-if='statusData.length==0'>
                        <i class='iconfont icon-duigou' style='color:green'></i> 运行正常
                    </p>
                    <p class='text-style' v-else v-for='(item,index) in statusData' :key='index+"a"'>
                        <i class='iconfont icon-warning' style='color:red'></i>
                        {{item.description}}
                        <span>{{formatTime(item.createTime) || "--"}}</span>
                    </p>
                    <div class='pad-style'>
                        <p class='title-style'>1.设备计划运行时刻与实际运行时刻</p>
                        <slider :list='list' :width='`${sliderWidth}`'></slider>
                        <slider :list='list1' :width='`${sliderWidth}`'></slider>
                    </div>
                    <div class='pad-style'>
                        <p class='title-style'>2.实际运行曲线</p>
                        <div id='pCharts' style='width:100%;height:300px'></div>
                    </div>
                    <div class='pad-style'>
                        <p class='title-style'>3.运行工单信息</p>
                        <el-table :data='work' style='width: 100%'>
                            <el-table-column prop='woNumber' label='工单编号' width='300'></el-table-column>
                            <el-table-column prop='orderState' label='工单状态'>
                                <template
                                    slot-scope='{row}'
                                >{{row.orderState==2?'抢单中':(row.orderState==4?'未开始':(row.orderState==5?'执行中':(row.orderState==6?'审核中':(row.orderState==7?'延期完成':(row.orderState==8?'按时完成':(row.orderState==9?'异常结束':(row.orderState==10?'撤销':"--")))))))}}</template>
                            </el-table-column>
                            <el-table-column prop='personList[0].name' label='执行人'></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
var echarts = require('echarts')
import drawerWarn from './drawerWarn'
import slider from './slider'
import { GetEquipmentList, queryGroup, queryRunTime, queryRealRunTime } from '@/api/Strategy/strate.js'
import { SystemCodetoClass } from '../../../framework/utils/formatToClass.js'
import { queryWarn, queryWorkOrder, hisdataQueryPeriodData, queryCount } from '@/api/Warn/warn.js'
import { mapGetters } from 'vuex'
var moment = require('moment')
import 'moment/locale/zh-cn'
export default {
    components: { drawerWarn, slider },
    data() {
        return {
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },
            devValue: [],
            SystemCodetoClass,
            configObj: {
                label: 'name',
                value: 'id',
                checkStrictly: true
            },
            groupId: '',
            date1: new Date(),
            planOptions: [], //计划组
            resultData: [], //树
            tableData: [], //工单
            detailData: {
                type: '传感器',
                title: '1#风机盘管',
                status: ['开启异常', '异常开启', '关闭异常', '异常关闭'],
                time: ['2017-10-24 09:00:00']
            },
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            list: [],
            list1: [],
            planData: [],
            raelData: [],
            objectId: '', //设备id
            objectLocalName: '', //设备本地名称
            dataX: [],
            dataY: [],
            work: [],
            statusData: [],
            countData: [] //报警图标数量
        }
    },
    computed: {
        ...mapGetters(['projectId']),
        sliderWidth() {
            if (document.body.clientWidth <= '1366') {
                return 420
            } else {
                return 800
            }
        }
    },
    mounted() {
        this.date1 = this.createdTimeFormat(this.date1)
        this.queryPlanGoup()
        this.getData()
    },
    methods: {
        changeTime() {
            this.getWarnInfo()
            this.getPlanTime()
            this.getRealTime()
            this.getWorkOrder()
            this.getPeriods()
        },
        getData() {
            let criteria = {
                projectId: this.projectId
            }
            if (this.groupId) {
                criteria.groupId = this.groupId
            }
            if (this.devValue.length > 0) {
                switch (this.devValue.length) {
                    case 1:
                        criteria.majorCategory = this.devValue[0]
                        this.loading = true
                        break
                    case 2:
                        criteria.majorCategory = this.devValue[0]
                        criteria.systemCategory = this.devValue[1]
                        this.loading = true
                        break
                    case 3:
                        criteria.majorCategory = this.devValue[0]
                        criteria.systemCategory = this.devValue[1]
                        criteria.equipmentCategory = this.devValue[2]
                        this.loading = true
                        break
                }
            }
            let params = {
                postParams: {
                    criteria: criteria
                }
            }
            this.resultData = []
            GetEquipmentList(params).then(res => {
                //第一级是专业 majorCategory 第二级是系统和系统实例 systemCategory system 第三级是设备和设备实例 equipmentCategory localName
                if (res.content && res.content.length > 0) {
                    this.resultData = res.content
                    this.objectId = res.content[0].obj.id
                    this.objectLocalName = res.content[0].obj.localName
                    let objectIds = []
                    this.resultData.forEach(el => {
                        if (el.system) {
                            objectIds.push(el.system.id)
                        }
                        objectIds.push(el.obj.id)
                    })
                    this.getCountInfo(objectIds)
                }
            })
        },
        //树图报警图标显示
        getCountInfo(objectIds) {
            let params = {
                criteria: {
                    projectId: this.projectId,
                    objectId: objectIds,
                    typeCode: ['10001', '10002', '10003', '10004'],
                    module: ['1', '2'],
                    createTime: {
                        $gte: this.date1 + '000000',
                        $lt: moment.unix((new Date(this.formatDay(this.date1)).getTime() + 24 * 3600 * 1000) / 1000).format('YYYYMMDDhhmmss')
                    }
                }
            }
            queryCount(params).then(res => {
                console.log(res)
                if (res.result == 'success') {
                    this.countData = res.content
                    this.resultData.forEach(i => {
                        const item = this.countData.find(j => j.id === i.obj.id)
                        i.obj.alarmCount = (item && item.alarmCount) || 0
                        if (i.system) {
                            const item = this.countData.find(j => j.id === i.system.id)
                            i.system.alarmCount = (item && item.alarmCount) || 0
                            i.system.subAlarmCount = (item && item.subAlarmCount) || 0
                        }
                    })
                }

                console.log('resultData---->', JSON.parse(JSON.stringify(this.resultData)))

                this.resultData = this.formatTree(this.resultData)
                console.log(this.resultData)
                this.getWarnInfo()
                this.getPlanTime()
                this.getRealTime()
                this.getWorkOrder()
                this.getPeriods()
            })
        },
        getWarnInfo() {
            let params = {
                criteria: {
                    projectId: this.projectId,
                    objectId: this.objectId,
                    typeCode: ['10001', '10002', '10003', '10004'],
                    module: ['1', '2'],
                    createTime: {
                        $gte: this.date1 + '000000',
                        $lt: moment.unix((new Date(this.formatDay(this.date1)).getTime() + 24 * 3600 * 1000) / 1000).format('YYYYMMDDhhmmss')
                    }
                }
            }
            queryWarn(params).then(res => {
                console.log(res)
                this.statusData = res.content ? res.content : []
            })
        },
        formatTree(content) {
            let obj = {}
            let vm = this
            content.forEach(item => {
                if (item.system) {
                    const childrenItem = {
                        label: vm.SystemCodetoClass(vm.$store.state.categoryArr.equipmentAll, item.obj.equipmentCategory) + ',' + item.obj.localName,
                        id: item.obj.id,
                        alarmCount: item.obj.alarmCount,
                        equipmentCategory: item.obj.equipmentCategory
                        // parentId: item.system.id
                    }
                    if (obj[item.system.id]) {
                        obj[item.system.id].children.push(childrenItem)
                    } else {
                        obj[item.system.id] = {
                            label:
                                vm.SystemCodetoClass(vm.$store.state.categoryArr.equipmentAll, item.system.systemCategory) +
                                ',' +
                                item.system.localName,
                            id: item.system.id,
                            alarmCount: item.system.alarmCount,
                            subAlarmCount: item.system.subAlarmCount,
                            systemCategory: item.system.systemCategory,
                            children: [childrenItem]
                        }
                    }
                } else {
                    obj[item.obj.id] = {
                        label: vm.SystemCodetoClass(vm.$store.state.categoryArr.equipmentAll, item.obj.systemCategory) + ',' + item.obj.localName,
                        equipmentCategory: item.obj.equipmentCategory,
                        id: item.obj.id,
                        alarmCount: item.obj.alarmCount,
                        children: []
                    }
                }
            })
            return Object.values(obj)
        },
        getPlanTime() {
            let params = {
                postParams: {
                    criteria: {
                        id: [this.objectId],
                        date: this.date1
                    }
                }
            }
            queryRunTime(params).then(res => {
                this.planData = []
                if (res.content && res.content[0].activities) {
                    res.content[0].activities.forEach(el => {
                        this.planData.push({
                            activityTime1: el.activityTime.slice(8, 14),
                            activityType: el.activityType
                        })
                    })
                }
                this.list = this.handleSegment(this.planData)
            })
        },
        getRealTime() {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId,
                        objectId: this.objectId,
                        date: this.date1
                    }
                }
            }
            queryRealRunTime(params).then(res => {
                this.raelData = []
                if (res.content && res.content.length > 0) {
                    res.content.forEach(el => {
                        this.raelData.push({
                            activityTime1: el.activityTime.slice(8, 14),
                            activityType: el.activityType
                        })
                    })
                }
                this.list1 = this.handleSegment(this.raelData)
            })
        },
        handleNodeClick(data) {
            console.log(data)
            this.objectId = data.id
            this.objectLocalName = data.label.split(',')[1]
            this.getWarnInfo()
            this.getPlanTime()
            this.getRealTime()
            this.getWorkOrder()
            this.getPeriods()
        },
        back() {
            this.$router.push('/baseOper/Warn/index')
        },
        //查询工单状态表格
        getWorkOrder() {
            let params = {
                criteria: {
                    projectId: this.projectId,
                    objectId: this.objectId,
                    scheduleTime: {
                        $gte: this.date1 + '000000',
                        $lt: moment.unix((new Date(this.formatDay(this.date1)).getTime() + 24 * 3600 * 1000) / 1000).format('YYYYMMDDhhmmss')
                    },
                    orderId: {
                        $null: false
                    }
                },
                orders: [
                    {
                        column: 'scheduleTime',
                        asc: false
                    }
                ]
            }
            queryWorkOrder(params).then(res => {
                console.log(res)
                if (res.result == 'success') {
                    this.work = res.content
                }
            })
        },
        //点能耗数据
        getPeriods() {
            let params = {
                projectId: this.projectId,
                objectId: this.objectId,
                // objectId:"Eq441900000580da892fad3811e9a1bd4f910b760287",
                period: '15min',
                startTime: this.date1 + '000000',
                // startTime:"20191107000000",
                // endTime:"20191108120500"
                endTime: moment.unix((new Date(this.formatDay(this.date1)).getTime() + 24 * 3600 * 1000) / 1000).format('YYYYMMDD000000')
            }
            hisdataQueryPeriodData(params).then(res => {
                let seriesData = []
                this.dataX = []
                this.dataY = []
                res.data.shift()
                seriesData = res.data
                seriesData.forEach(el => {
                    this.dataX.push(this.formatTime(el[0]))
                    if (el[1] == '-9999') {
                        el[1] = null
                    }
                    this.dataY.push(el[1])
                })
                this.drawIt()
            })
        },
        drawIt() {
            let myCharts = echarts.init(document.getElementById('pCharts'))
            var option = {
                tooltip: {
                    trigger: 'axis',
                     formatter:function(params){
                        return params[0].name.slice(0,16) + '<br/>' + parseFloat(params[0].data).toFixed(2) +'KW'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: this.dataX,
                    axisLabel: {
                        formatter: function(value) {
                            return value
                                .split(' ')[1]
                                .toString()
                                .slice(0, 5)
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}KW'
                    }
                },
                series: [
                    {
                        data: this.dataY,
                        type: 'line'
                    }
                ]
            }
            myCharts.setOption(option)
        },
        handleSegment(list) {
            // 防止后端不排序
            const _list = JSON.parse(JSON.stringify(list)).sort((i, j) => Number(i.activityTime1) - Number(j.activityTime1))
            let result = []
            let pointer = 0 // 指针，每检测到一个停止，指针+1
            _list.forEach(i => {
                if (!Boolean(result[pointer])) {
                    result[pointer] = []
                }
                result[pointer].push(i)
                if (i.activityType === 2) {
                    pointer++
                }
            })
            return result
        },
        queryPlanGoup() {
            let criteria = {
                projectId: this.projectId
            }
            if (this.devValue.length > 0) {
                switch (this.devValue.length) {
                    case 1:
                        criteria.majorCategory = this.devValue[0]
                        this.loading = true
                        break
                    case 2:
                        criteria.majorCategory = this.devValue[0]
                        criteria.systemCategory = this.devValue[1]
                        this.loading = true
                        break
                    case 3:
                        criteria.majorCategory = this.devValue[0]
                        criteria.systemCategory = this.devValue[1]
                        criteria.equipmentCategory = this.devValue[2]
                        this.loading = true
                        break
                }
            }
            let params = {
                postParams: {
                    criteria: criteria
                }
            }
            queryGroup(params).then(res => {
                let content = res.data.content
                if (content && content.length > 0) {
                    content.forEach(el => {
                        let obj = {
                            value: el.id,
                            label: el.name
                        }
                        this.planOptions.push(obj)
                    })
                }
            })
        },
        formatTime(time) {
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
        },
        formatDay(day) {
            return day.slice(0, 4) + '-' + day.slice(4, 6) + '-' + day.slice(6, 8)
        },
        createdTimeFormat(timestamp) {
            let date = timestamp
            let Y = date.getFullYear()
            let M = date.getMonth() + 1
            M = M < 10 ? '0' + M : M
            let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
            return Y + '' + M + '' + D
        }
    }
}
</script>

<style lang="scss" scoped>
.run {
    .run-content {
        margin: 10px;
        display: flex;
        .content-left {
            padding: 10px;
            float: left;
            width: 500px;
            background: #fff;
            .left-top {
                border-bottom: 1px solid #ccc;
                margin-bottom: 10px;
            }
            .left-bottom {
                max-height: 700px;
                overflow-y: auto;
                .span-style {
                    display: inline-block;
                    background: #ccc;
                    width: 174px;
                    height: 40px;
                    text-align: center;
                    line-height: 40px;
                    border-radius: 6px;
                    margin-right: 10px;
                }
                .pad-style {
                    margin-left: 25px;
                }
            }
        }
        .content-right {
            margin-left: 10px;
            flex: 1;
            padding: 10px;
            background: #fff;
            overflow-y: auto;
            .p-style {
                // font-size: 18px;
                font-weight: bold;
                color: #cecece;
            }
            .text-style {
                text-align: center;
                padding-top: 20px;
            }
            .title-style {
                font-size: 16px;
                padding-top: 20px;
            }
            .block {
                padding: 0 20px;
            }
            .pad-style {
                padding-left: 20px;
            }
        }
    }
}
</style>
<style lang="scss" >
.run {
    .el-form-item__label {
        width: 130px !important;
    }
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
    .el-tree-node__content {
        height: 50px !important;
    }
    th {
        display: none;
    }
}
</style>