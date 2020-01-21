<template>
    <div :style='contentStyleObj'>
        <table-page-template>
            <el-form :inline='true' slot='form' size='mini'>
                <el-form-item>
                    <el-date-picker
                        v-model='searchData.dateValue'
                        type='daterange'
                        :picker-options='pickerOptions'
                        range-separator='至'
                        start-placeholder='开始日期'
                        end-placeholder='结束日期'
                        value-format='yyyyMMdd'
                        align='right'
                        @change='getData'
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-select v-model='searchData.pushValue' placeholder='请选择' @change='getData' clearable>
                        <el-option v-for='item in PushOptions' :key='item.value' :label='item.label' :value='item.value'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' @click='query' size='mini'>刷新</el-button>
                </el-form-item>
            </el-form>
        </table-page-template>
        <div>
            <page-table :total='pageData.total' :page='pageData.page' :size='pageData.size' @pageChanged='pageChanged'>
                <el-table :data='pageData.tableData' border stripe slot='table'>
                    <el-table-column prop label='日期' align='center' min-width='120'>
                        <template slot-scope='{row}'>{{`${row.date.substr(0,4)}-${row.date.substr(4,2)}-${row.date.substr(6,2)}`}}</template>
                    </el-table-column>
                    <el-table-column prop='time' label='执行时间' align='center' min-width='120'>
                        <template slot-scope='{row}'>{{timeStr(row.time)}}</template>
                    </el-table-column>
                    <el-table-column prop label='冷水机组' align='center'>
                        <el-table-column prop label='开启台数（台）' min-width='120' align='center'>
                            <template slot-scope='{row}'>{{row.chillerNumSetL+'大'+row.chillerNumSetS+'小'}}</template>
                        </el-table-column>
                        <el-table-column prop='chillWaterOutTempSet' label='出水温度（℃）' min-width='120' align='right'></el-table-column>
                        <el-table-column prop='meanTindoor' label='室内温度（℃）' min-width='120' align='right'>
                            <template slot-scope='{row}'>{{decimal(row.meanTindoor)}}</template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop label='冷冻水泵' align='center'>
                        <el-table-column prop label='开启台数（台）' min-width='120' align='center'>
                            <template slot-scope='{row}'>{{row.coolPumpNumSetL+'大'+row.coolPumpNumSetS+'小'}}</template>
                        </el-table-column>
                        <el-table-column prop='coolPumpFreqSet' label='频率（Hz）' min-width='100' align='right'></el-table-column>
                        <el-table-column prop='chEvTDeltaFb' label='进出水温差（℃）' min-width='140' align='right'>
                            <template slot-scope='{row}'>{{decimal(row.chEvTDeltaFb)}}</template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop label='冷却水泵' align='center'>
                        <el-table-column prop label='开启台数（台）' min-width='120' align='center'>
                            <template slot-scope='{row}'>{{row.chillPumpNumSetL+'大'+row.chillPumpNumSetS+'小'}}</template>
                        </el-table-column>
                        <el-table-column prop='chillPumpFreqSet' label='频率（Hz）' min-width='100' align='right'></el-table-column>
                        <el-table-column prop='chCdTDeltaFb' label='进出水温差（℃）' min-width='140' align='right'>
                            <template slot-scope='{row}'>{{decimal(row.chCdTDeltaFb)}}</template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop label='冷却塔' align='center'>
                        <el-table-column prop label='开启台数（台）' min-width='120' align='center'>
                            <template slot-scope='{row}'>{{row.coolTowerNumSetL+'大'+row.coolTowerNumSetS+'小'}}</template>
                        </el-table-column>
                        <el-table-column prop='coolTowerFreqSet' label='频率（Hz）' min-width='100' align='right'></el-table-column>
                        <el-table-column prop='ctTOutDelta' label='出水温度-湿球温度（℃）' min-width='190' align='right'>
                            <template slot-scope='{row}'>{{decimal(row.ctTOutDelta)}}</template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop label='操作' align='center' width='160'>
                        <template slot-scope='{row}'>
                            <div v-if='hasPermission("transfer:command:update")'>
                                <el-button v-if='row.status=="1"' @click='Disagree(row,3)' size='mini'>不同意</el-button>
                                <el-button v-if='row.status=="1"' type='primary' @click='Agree(row,2)' size='mini'>同意</el-button>
                            </div>
                            <div v-else>
                                <el-button v-if='row.status=="1"' @click='Disagree(row,3)' size='mini' disabled>不同意</el-button>
                                <el-button v-if='row.status=="1"' type='primary' @click='Agree(row,2)' size='mini' disabled>同意</el-button>
                            </div>

                            <div v-if='row.status=="2"'>协管员同意推送</div>
                            <div v-if='row.status=="3"'>协管员未同意推送</div>
                            <div v-if='row.status=="4"'>超时自动推送</div>
                            <div v-if='row.status=="5"'>超时未推送</div>
                        </template>
                    </el-table-column>
                </el-table>
            </page-table>
        </div>

        <div slot='dialog'>
            <directive-admin ref='DirectiveAdmin' @query='query'></directive-admin>
        </div>
    </div>
</template>
<script>
import { findQuery, updateQuery } from '@/api/Directive/directive.js'
import { mapGetters } from 'vuex'
import DirectiveAdmin from './DirectiveAdmin'
var moment = require('moment')
import 'moment/locale/zh-cn'

export default {
    name: 'DirectiveList',
    data() {
        return {
            pageData: {
                page: 1,
                size: 10,
                total: 0,
                tableData: [] //查询
            },
            searchData: {
                pushValue: '', //下拉框选项状态
                dateValue: []
            },
            contentStyleObj: {
                width: ''
            }, //页面宽度
            PushOptions: [
                //下拉框数据
                {
                    value: '1',
                    label: '初始状态'
                },
                {
                    value: '2',
                    label: '协管员同意推送'
                },
                {
                    value: '3',
                    label: '协管员未同意推送'
                },
                {
                    value: '4',
                    label: '超时自动推送'
                },
                {
                    value: '5',
                    label: '超时未推送'
                }
            ],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }
                ]
            }
        }
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    components: {
        'directive-admin': DirectiveAdmin
    },
    mounted() {
        this.query()
        this.getWight()
        window.addEventListener('resize', this.getWight)
        window.onresize = function() {}
    },
    methods: {
        decimal(str) {
            if (typeof str != 'number' && typeof str != 'string') {
                return str
            } else {
                if (typeof str == 'number') {
                    str = str.toString()
                }
                if (str.indexOf('.') != -1) {
                    return str.slice(0, str.indexOf('.') + 2)
                } else {
                    return str
                }
            }
        },
        timeStr(str) {
            if (/\./.test(str)) {
                return str.replace(/\d(?=(\d{2})+\.)/g, '$&:').replace(/\d{2}(?![,.]|$)/g, '$&:')
            } else {
                return str.replace(/\d(?=(\d{2})+$)/g, '$&:')
            }
        },
        pageChanged(page, size) {
            this.pageData.page = page
            this.pageData.size = size
            this.getData()
        },
        query() {
            this.pageData.size = 10
            this.pageData.page = 1
            this.getData()
        },
        // 列表数据
        getData() {
            let criteria = {}
            if (this.searchData.dateValue != null) {
                if (!this.searchData.pushValue && this.searchData.dateValue.length == 0) {
                    criteria = {
                        projectId: this.projectId,
                        status: this.searchData.pushValue
                    }
                }
                if (this.searchData.dateValue.length > 0 && !this.searchData.pushValue) {
                    criteria = {
                        projectId: this.projectId,
                        date: {
                            $gte: this.searchData.dateValue[0],
                            $lte: this.searchData.dateValue[1]
                        }
                    }
                }

                if (this.searchData.dateValue.length > 0 && this.searchData.pushValue) {
                    criteria = {
                        projectId: this.projectId,
                        status: this.searchData.pushValue,
                        date: {
                            $gte: this.searchData.dateValue[0],
                            $lte: this.searchData.dateValue[1]
                        }
                    }
                }
                if (this.searchData.dateValue.length == 0 && !this.searchData.pushValue) {
                    criteria = {
                        projectId: this.projectId
                    }
                }
            }
            if (this.searchData.dateValue == null) {
                if (this.searchData.dateValue == null && !this.searchData.pushValue) {
                    criteria = {
                        projectId: this.projectId
                    }
                }
                if (this.searchData.dateValue == null && this.searchData.pushValue) {
                    criteria = {
                        projectId: this.projectId,
                        status: this.searchData.pushValue
                    }
                }
            }
            let params = {
                postParams: {
                    criteria: criteria,
                    orders: [
                        {
                            column: 'date',
                            asc: false
                        },
                        {
                            column: 'time',
                            asc: false
                        }
                    ],
                    page: this.pageData.page,
                    size: this.pageData.size
                }
            }

            findQuery(params).then(res => {
                this.pageData.tableData = res.content
                this.pageData.total = res.count
            })
        },
        getWight() {
            this.contentStyleObj.width =
                document.body.clientWidth > 1000 ? document.body.clientWidth - 255 + 'px' : document.body.clientWidth - 75 + 'px'
        },
        Agree(data, num) {
            this.$refs.DirectiveAdmin.open(data, num)
        },
        Disagree(data, num) {
            this.$refs.DirectiveAdmin.open(data, num)
        }
    }
}
</script>