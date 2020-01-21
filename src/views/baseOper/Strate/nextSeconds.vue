<template>
    <div class='next'>
        <div class='next-header' v-if='$route.query.objectId'>编辑{{$route.query.localName}}运行策略</div>
        <div class='next-header' v-else>(3/3) 设置运行策略</div>
        <p class='text-style'>
            <!-- 所选运维单元中存在多套已有策略。您可以任选一个作为基准进行编辑：空 -->
            <!-- <el-button type="text" @click="function(){num=1}">方案1</el-button> -->
        </p>
        <el-form ref='ruleForm' :model='content' :rules='rules' class='sec-content'>
            <p class='con-title'>1.选择日期</p>
            <div>
                <p>
                    <span v-if='calendarName'>当前正在使用＜{{calendarName}}＞</span>
                    <opt-button v-if='calendarName' text='点击查看' @click='look' />
                    <el-dropdown split-button size='mini' style='margin-left:60px' @click='isShowNew' @command='handleCommand'>
                        使用新工作历
                        <el-dropdown-menu slot='dropdown'>
                            <el-dropdown-item v-for='(item,index) in calendarList' :key='"f"+index' :command='`${item.id}`'>{{item.name}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </p>
                <div v-if='calendarName' v-for='(item,p) in content.operationCalendarList' :key='"p"+p'>
                    <p class='p-style' style='margin-right:100px'>{{item.name}}</p>
                    <div v-if='item.periods.length>0'>
                        <span class='ts-style'>开启时间</span>
                        <span class='ts-style'>关闭时间</span>
                    </div>
                    <p v-if='calendarName' v-for='(eve,inx) in item.periods' :key='"inx"+inx' :class='`${inx=="0"?"pad-style":""}`'>
                        <i v-if='inx > "0"' class='el-icon-delete' style='font-size:18px;' @click='delDev(p,inx)'></i>
                        <el-time-picker
                            v-model='eve.startTime'
                            :picker-options='{start: "08:00",}'
                            value-format='HHmm00'
                            format='HH:mm'
                            size='small'
                            placeholder='任意时间点'
                        ></el-time-picker>
                        <span>-</span>
                        <el-time-picker
                            v-model='eve.stopTime'
                            :picker-options='{start: "08:00",}'
                            value-format='HHmm00'
                            format='HH:mm'
                            size='small'
                            placeholder='任意时间点'
                        ></el-time-picker>
                    </p>
                    <div class='marginStyle'>
                        <el-button size='small' @click='addTime(p)'>添加新时间段</el-button>
                    </div>
                </div>
                <p class='p-style' style='margin-left:-230px;margin-top:30px;' v-if='calendarName'>
                    例外日期设置：
                    <el-button size='mini' @click='addNewDate'>添加例外日期</el-button>
                </p>
                <div v-if='calendarName' style='margin-bottom:20px;' v-for='(item,j) in content.operationDateList' :key='"j"+j'>
                    <i v-if='j > "0:"' class='el-icon-delete' style='font-size:18px;' @click='delCalendar(j)'></i>
                    <el-date-picker v-model='item.beginDate' value-format='yyyyMMdd' size='small' type='date' placeholder='选择日期'></el-date-picker>
                    <span>-</span>
                    <el-date-picker v-model='item.endDate' size='small' value-format='yyyyMMdd' type='date' placeholder='选择日期'></el-date-picker>
                    <div class='marginStyle'>
                        <span class='ts-style'>开启时间</span>
                        <span class='ts-style'>关闭时间</span>
                    </div>
                    <p v-for='(time,k) in item.periods' :key='"k"+k' :class='`${k=="0"?"pad-style":""}`'>
                        <span>
                            <i v-if='k>"0"' class='el-icon-delete' style='font-size:18px;' @click='delObj(j,k)'></i>
                        </span>
                        <el-time-picker
                            v-model='time.startTime'
                            placeholder='任意时间点'
                            value-format='HHmm00'
                            size='small'
                            style='width:180px;'
                            format='HH:mm'
                        ></el-time-picker>
                        <span>-</span>
                        <el-time-picker
                            v-model='time.stopTime'
                            placeholder='任意时间点'
                            value-format='HHmm00'
                            style='width:180px;'
                            format='HH:mm'
                            size='small'
                        ></el-time-picker>
                    </p>
                    <div class='marginStyle'>
                        <el-button size='mini' @click='addValue(j)'>添加新时间段</el-button>
                    </div>
                </div>
            </div>
            <p class='con-title'>2.工单提前发出时间</p>
            <div class='text-style'>
                <el-input-number size='mini' v-model='content.aheadTime' controls-position='right' :min='0'></el-input-number>分钟
            </div>
            <p class='con-title'>3.关联的SOP</p>
            <div>
                <p>
                    开启：
                    <el-select
                        v-model='content.startSopId'
                        filterable
                        remote
                        reserve-keyword
                        placeholder='请输入需要执行的sop关键字'
                        :remote-method='remoteMethod'
                        :loading='loading'
                        clearable
                        size='small'
                        style='width:300px;'
                    >
                        <el-option v-for='item in sopOptions' :key='item.value' :label='item.label' :value='item.value'></el-option>
                    </el-select>
                </p>
                <p>
                    关闭：
                    <el-select
                        v-model='content.stopSopId'
                        filterable
                        remote
                        reserve-keyword
                        placeholder='请输入需要执行的sop关键字'
                        :remote-method='remoteMethod'
                        :loading='loading'
                        clearable
                        size='small'
                        style='width:300px;'
                    >
                        <el-option v-for='item in sopOptions' :key='item.value' :label='item.label' :value='item.value'></el-option>
                    </el-select>
                </p>
            </div>
            <p class='con-title'>4.运行宽容时间</p>
            <div>
                <span style='display: inline-block;width: 100px;'>前</span>
                <span style='display: inline-block;width: 100px;'>后</span>
                <p>
                    <span>开启时刻：</span>
                    <el-input-number size='mini' v-model='content.foreStartTime' controls-position='right' :min='0'></el-input-number>分钟
                    <el-input-number size='mini' v-model='content.afterStartTime' controls-position='right' :min='0'></el-input-number>分钟
                </p>
                <p>
                    <span>关闭时刻：</span>
                    <el-input-number size='mini' v-model='content.foreStopTime' controls-position='right' :min='0'></el-input-number>分钟
                    <el-input-number size='mini' v-model='content.afterStopTime' controls-position='right' :min='0'></el-input-number>分钟
                </p>
            </div>
            <p class='con-title'>5.策略执行方法</p>
            <div class='text-style'>
                <el-select placeholder='请选择' v-model='content.operateType' @change='getBAList'>
                    <el-option v-for='item in systemList' :key='item.value' :label='item.label' :value='item.value'></el-option>
                </el-select>
                <div v-if='content.operateType!="1"'>
                    <p>
                        <span style='display: inline-block;padding-right:160px'>调节日期及时间</span>
                        <span style='display: inline-block;padding-right:140px;'>调节说明</span>
                        <span style='display: inline-block;'>调节SOP</span>
                    </p>
                    <div class='marginStyle' v-for='(system,i) in content.baList' :key='"i"+i' :class='`${i==0?"pad-style":""}`'>
                        <span>
                            <i v-if='i>0' class='el-icon-delete' style='font-size:18px;' @click='delSystem(i)'></i>
                        </span>
                        <span class='pad-style'>{{i+1}}.</span>
                        <el-date-picker
                            v-model='system.startTime'
                            type='datetime'
                            format='yyyy-MM-dd HH:mm'
                            value-format='yyyyMMddHHmm00'
                            size='small'
                            style='width:170px;'
                            placeholder='选择日期时间'
                        ></el-date-picker>
                        <span>-</span>
                        <el-date-picker
                            v-model='system.stopTime'
                            type='datetime'
                            size='small'
                            format='yyyy-MM-dd HH:mm'
                            value-format='yyyyMMddHHmm00'
                            style='width:170px;'
                            placeholder='选择日期时间'
                        ></el-date-picker>
                        <el-input placeholder='调节说明' v-model='system.note' size='small' style='width:200px'></el-input>
                        <span>
                            <el-select
                                v-model='system.sopId'
                                filterable
                                remote
                                reserve-keyword
                                placeholder='请输入需要执行的sop关键字'
                                :remote-method='remoteMethod'
                                :loading='loading'
                                clearable
                                size='small'
                                style='width:300px;'
                            >
                                <el-option v-for='item in sopOptions' :key='item.value' :label='item.label' :value='item.value'></el-option>
                            </el-select>
                        </span>
                    </div>
                </div>
                <el-button v-if='content.operateType!="1"' size='mini' class='marginStyle' @click='addSystem'>添加调节日期要求</el-button>
            </div>
            <p class='con-title'>6.策略制定原因</p>
            <div class='text-style'>
                <el-input type='textarea' v-model='content.comment' style='width:300px'></el-input>
                <p>
                    <el-button type='text' @click='historyDialog=true;queryReason(resonValue)'>查看历史上的原因</el-button>
                </p>
            </div>
            <p class='con-title'>7.监测方案</p>
            <div class='text-style'>
                <el-select placeholder='请选择' v-model='ant'>
                    <el-option v-for='item in modelOptions' :key='item.value' :label='item.label' :value='item.value'></el-option>
                </el-select>
                <div class='marginStyle'>
                    <el-radio-group v-model='content.sensitivity'>
                        <el-radio :label='0.05'>高敏感度（5%）</el-radio>
                        <el-radio :label='0.1'>中敏感度（10%）</el-radio>
                        <el-radio :label='0.15'>低敏感度（15%）</el-radio>
                        <el-radio :label='count/100'>
                            自定义(
                            <el-input-number size='mini' v-model='count' controls-position='right' :min='0'></el-input-number>%)
                        </el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class='mod-footer'>
                <el-button @click='quit'>放弃本次设置</el-button>
                <div>
                    <el-button v-if='!$route.query.objectId' @click='backSet'>上一步</el-button>
                    <el-button type='primary' @click='submitForm("ruleForm")'>保存并应用</el-button>
                </div>
            </div>
        </el-form>
        <el-dialog :visible.sync='centerDialogVisible' width='30%' center>
            <p class='text-title'>是否要使用新的工作历？</p>
            <!-- <p class="text-style">现策略已使用＜{{calendarName}}＞</p> -->
            <span slot='footer' class='dialog-footer'>
                <el-button @click='centerDialogVisible = false'>否</el-button>
                <el-button type='primary' v-if='nextDig' @click='createNextDialog'>是</el-button>
                <el-button type='primary' v-else @click='confirm'>是</el-button>
            </span>
        </el-dialog>
        <upload-calendar ref='dialog' @commit='commit'></upload-calendar>
        <div class='history-dig'>
            <el-dialog title='历史上的策略制定原因' :visible.sync='historyDialog' width='500px'>
                <el-select v-model='resonValue' placeholder='请选择' @change='queryReason'>
                    <el-option v-for='item in reasonOptions' :key='item.value' :label='item.label' :value='item.value'></el-option>
                </el-select>
                <el-timeline style='margin-top:20px' v-if='content.resonData && content.resonData.length>0'>
                    <el-timeline-item
                        placement='top'
                        v-for='(reson,index) in content.resonData'
                        :key='"r"+index'
                        :timestamp='`${formatDate(reson.createTime)}`'
                    >
                        <el-card>
                            <p>{{reson.comment || ''}}</p>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { queryGroup, saveStrategy, queryComment, queryHistoryStrategy, queryCalendarName, downloadCalendar, querySop } from '@/api/Strategy/strate.js'
import { SystemCodetoClass } from '../../../framework/utils/formatToClass.js'
import uploadCalendar from './uploadCalendar'
import { mapGetters } from 'vuex'
var moment = require('moment')
import 'moment/locale/zh-cn'
export default {
    components: { uploadCalendar },
    data() {
        return {
            num: 0,
            SystemCodetoClass,
            content: {
                objectIds: [],
                //工作日历中设定的时间
                operationCalendarList: [
                    {
                        dateType: '1',
                        periods: [
                            {
                                startTime: null,
                                stopTime: null
                            }
                        ]
                    }
                ],
                //例外日期设置
                operationDateList: [],
                calendarId: 1, //日历id
                aheadTime: 10, //工单提前发出
                stopSopId: null, //开启的关联sop
                startSopId: null, //关闭的关联sop
                foreStartTime: 10, //运行宽容时间
                afterStartTime: 5,
                foreStopTime: 10,
                afterStopTime: 5,
                operateType: 1, //策略执行
                //BA系统
                baList: null,
                sensitivity: 0.15,
                comment: null
            },

            systemList: [{ label: '人工执行', value: 1 }, { label: '带工作历的BA系统', value: 2 }, { label: '不带工作历的BA系统', value: 3 }],
            newId: '', //暂时存储
            calendarList: [], //日历列表
            calendarName: '',
            ant: '1',
            count: 3,
            modelOptions: [{ label: '敏感度方案', value: '1' }],
            list: [],
            loading: false,
            states: [],
            sopOptions: [],
            reasonOptions: [],
            centerDialogVisible: false,
            historyDialog: false,
            resonValue: '',
            sopSelect: '',
            nextDig: false,
            resonData: [],
            planId: '',
            objId: '',
            rules: {
                operationCalendarList: [{ type: 'array', required: true, message: '请选择日期', trigger: 'change' }],
                aheadTime: [{ required: true, message: '请选择工单提前发出时间', trigger: 'change' }],
                foreStartTime: [{ required: true, message: '请选择运行宽容时间', trigger: 'change' }],
                afterStartTime: [{ required: true, message: '请选择运行宽容时间', trigger: 'change' }],
                foreStopTime: [{ required: true, message: '请选择运行宽容时间', trigger: 'change' }],
                afterStopTime: [{ required: true, message: '请选择运行宽容时间', trigger: 'change' }],
                sensitivity: [{ required: true, message: '请选择监测方案', trigger: 'change' }]
            }
        }
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    mounted() {
        this.planId = this.$route.query.planId
        if (this.$route.query.objectId) {
            this.content.objectIds = []
            this.objId = this.$route.query.objectId
            this.content.objectIds.push(this.objId)
            this.getHistory(this.objId)
            this.reasonOptions.push({
                label: this.$route.query.localName,
                value: this.objId
            })
        } else {
            let sysArr
            let equipmentArr
            let objectIds
            if (localStorage.getItem('sysArr')) {
                sysArr = JSON.parse(localStorage.getItem('sysArr'))
            }
            if (localStorage.getItem('equipmentArr')) {
                equipmentArr = JSON.parse(localStorage.getItem('equipmentArr'))
            }
            if (sysArr && equipmentArr) {
                objectIds = sysArr.concat(equipmentArr)
            }
            if (sysArr && !equipmentArr) {
                objectIds = sysArr
            }
            if (equipmentArr && !sysArr) {
                objectIds = equipmentArr
            }
            if (objectIds && objectIds.length > 0) {
                objectIds.forEach(el => {
                    let obj = {
                        label: el.equipment.localName,
                        value: el.equipment.id
                    }
                    this.reasonOptions.push(obj)
                    this.content.objectIds.push(el.equipment.id)
                })
            }
        }
        this.resonValue = this.content.objectIds[0]
        this.queryCalendarList(1)
        this.getSopList(this.content.objectIds)
    },
    methods: {
        getHistory(objectId) {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId,
                        objectId: objectId
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
                    this.content = res.content[0].strategy
                    if (!this.content.operationDateList) {
                        this.$set(this.content, 'operationDateList', [])
                        this.$set(this.content, 'baList', [])
                    }
                    this.content.objectIds = []
                    this.content.objectIds.push(this.objId)
                    this.getNewDate()
                }
            })
        },
        getNewDate() {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId,
                        id: this.content.calendarId
                    },
                    withColumns: ['type']
                }
            }
            queryCalendarName(params).then(res => {
                if (res.content && res.content.length > 0) {
                    this.calendar = res.content[0]
                    this.calendarName = res.content[0].name
                    this.calendar.operationCalendarList = []
                    let manageCalendarTypeList = this.calendar.manageCalendarTypeList
                    let result = []
                    manageCalendarTypeList.forEach(i => {
                        this.content.operationCalendarList.forEach(j => {
                            if (i.type == j.dateType) {
                                let obj = {
                                    name: i.name,
                                    dateType: j.dateType,
                                    periods: j.periods
                                }
                                result.push(obj)
                            }
                        })
                    })
                    this.content.operationCalendarList = result

                }
            })
        },
        getBAList() {
            if (this.content.operateType != 1) {
                this.content.baList = [
                    {
                        startTime: '',
                        stopTime: '',
                        sopId: '',
                        note: ''
                    }
                ]
            }
        },
        queryCalendarName(calendarId) {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId,
                        dataType: calendarId
                    },
                    withColumns: ['type']
                }
            }
            queryCalendarName(params).then(res => {
                if (res.data && res.data.content) {
                    this.content.operationCalendarList = res.data.content
                }
            })
        },
        isShowNew() {
            if (this.calendarName) {
                this.centerDialogVisible = true
                this.nextDig = true
            } else {
                this.createNextDialog()
            }
        },
        queryReason(resonValue) {
            let params = {
                postParams: {
                    criteria: {
                        objectId: resonValue
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
                this.content.resonData = res.content
            })
        },
        //时间戳转换
        formatDate(date) {
            return moment.unix(date / 1000).format('YYYY年MM月DD日 HH:mm')
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const result = this.checked()
                    if (result != 'ok') {
                        this.$alert('请选择日期,日期不能为空', '', {
                            confirmButtonText: '确定',
                            center: true
                        })
                        return
                    }
                    this.content.projectId = this.projectId
                    let params = {
                        postParams: this.content
                    }
                    saveStrategy(params).then(res => {
                        if (res.data.result == 'success') {
                            this.$message.success('保存并应用成功')
                            this.$router.push('/baseOper/Strate/index')
                            localStorage.removeItem('sysArr')
                            localStorage.removeItem('equipmentArr')
                        } else {
                            this.$message.error(res.data.message)
                            return false
                        }
                    })
                }
            })
        },
        checked() {
            const list = this.content.operationCalendarList
            for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < list[i].periods.length; j++) {
                    if (list[i].periods[j].startTime == '' && list[i].periods[j].stopTime == '') {
                        return '请选择日期，日期不能为空'
                    }
                }
            }

            return 'ok'
        },
        createNextDialog() {
            this.centerDialogVisible = false
            this.$refs.dialog.open(null, null)
        },
        confirm() {
            this.centerDialogVisible = false
            this.content.calendarId = this.newId
            this.calendarList.forEach(el => {
                if (el.id == this.content.calendarId) {
                    this.calendarName = el.name
                }
            })
            this.getDateList()
        },
        getDateList() {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId,
                        id: this.content.calendarId
                    },
                    withColumns: ['type']
                }
            }
            queryCalendarName(params).then(res => {
                if (res.result == 'success') {
                    this.content.operationCalendarList = []
                    this.calendarName = res.content[0].name
                    let manageCalendarTypeList = res.content[0].manageCalendarTypeList
                    manageCalendarTypeList.forEach(el => {
                        let obj = {
                            dateType: el.type,
                            name: el.name,
                            periods: [
                                {
                                    startTime: null,
                                    stopTime: null
                                }
                            ]
                        }
                        this.content.operationCalendarList.push(obj)
                    })
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        backSet() {
            this.$router.push({ path: '/baseOper/Strate/nextStrate', query: { id: this.planId,steps:'-1'} })
        },
        quit() {
            this.$router.push('/baseOper/Strate/index')
            localStorage.removeItem('sysArr')
            localStorage.removeItem('equipmentArr')
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
        commit(name) {
            this.queryCalendarList(this.content.calendarId)
            this.calendarName = name
            this.getDateList()
        },
        queryCalendarList() {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId,
                        dataType: 1
                    },
                    withColumns: ['type']
                }
            }
            queryCalendarName(params).then(res => {
                this.calendarList = res.content
            })
        },
        //日历
        addTime(index) {
            this.content.operationCalendarList[index].periods.push(this.newPeriods())
        },
        delDev(index, inx) {
            this.content.operationCalendarList[index].periods.splice(inx, 1)
        },
        newPeriods() {
            return {
                startTime: null,
                stopTime: null
            }
        },
        //例外日期设置
        addNewDate() {
            this.content.operationDateList.push(this.newDate())
        },
        newDate() {
            return {
                beginDate: null,
                endDate: null,
                periods: [
                    {
                        startTime: null,
                        stopTime: null
                    }
                ]
            }
        },
        addValue(index) {
            this.content.operationDateList[`${index}`].periods.push(this.newPeriods())
        },
        delCalendar(j) {
            this.content.operationDateList.splice(j, 1)
        },
        delObj(index, inx) {
            this.content.operationDateList[`${index}`].periods.splice(inx, 1)
        },
        //添加系统
        addSystem() {
            this.content.baList.push(this.newSystem())
        },
        newSystem() {
            return {
                startTime: null,
                stopTime: null,
                sopId: null,
                note: null
            }
        },
        delSystem(index) {
            this.content.baList.splice(index, 1)
        },
        handleCommand(command) {
            this.centerDialogVisible = true
            this.nextDig = true
            this.nextDig = false
            this.newId = command
        },
        remoteMethod(query) {
            this.loading = true
            setTimeout(() => {
                this.loading = false
                this.sopOptions = this.list
            }, 200)
        },
        getSopList(objectIds) {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId,
                        objId: objectIds
                    }
                }
            }
            querySop(params).then(res => {
                if (res.data) {
                    this.states = res.data
                    this.list = this.states.map(item => {
                        return { value: item.sopId, label: item.sopName }
                    })
                    this.remoteMethod()
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.next {
    overflow-y: scroll;
    .next-header {
        font-size: 32px;
        margin-bottom: 40px;
        text-align: center;
    }
    .sec-content {
        text-align: center;
        .con-title {
            text-align: center;
            margin: 40px 20px 20px 20px;
            font-size: 24px;
        }
        .p-style {
            margin-left: -270px;
            color: #4f4f4f;
            font-weight: bold;
        }
        .ts-style {
            display: inline-block;
            width: 100px;
            padding-top: 10px;
        }
        .marginStyle {
            margin-top: 10px;
        }
    }
    .text-style {
        text-align: center;
    }
    .text-title {
        text-align: center;
        font-size: 20px;
    }
    .pad-style {
        padding-left: 22px;
    }
    .mod-footer {
        margin-top: 80px;
        display: flex;
        justify-content: space-evenly;
    }
}
</style>
<style lang="scss" >
.next {
    .history-dig {
        .el-dialog {
            height: 500px;
            overflow: scroll;
        }
    }
    .el-collapse-item {
        .el-collapse-item__content {
            padding-left: 20px;
            padding-top: 20px;
            .el-collapse-item__header {
                padding-left: 20px;
            }
        }
    }
}
</style>