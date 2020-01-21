<template>
    <div class='create-box'>
        <div class='eng-button' v-if='this.types=="add"'>
            <el-button type='primary' icon='el-icon-back' size='mini' @click='goback'>返回</el-button>
        </div>
        <div class='eng-button' v-if='this.types=="edit"'>
            <el-button type='primary' style='margin-right:8px;' icon='el-icon-back' size='mini' @click='goback'>返回</el-button>
            <div v-for='(item,index) in butArr' :key='index'>
                <el-button type='primary' v-if='!item.autoCommit' class='btn-class' size='mini' @click='noneApproval(item.flag)'>{{item.name}}</el-button>
            </div>
            <span style='float:right'>
                项目状态：
                <b v-if='data.status=="101"'>待立项</b>
                <b v-if='data.status=="102"'>不予立项</b>
                <b v-if='data.status=="103"'>进行中</b>
                <b v-if='data.status=="104"'>暂停</b>
                <b v-if='data.status=="105"'>终止</b>
                <b v-if='data.status=="106"'>已完成</b>
                <b v-if='data.status=="107"'>待审核</b>
            </span>
        </div>
        <el-tabs type='card' v-model='activeName' @tab-click='handleClick'>
            <el-tab-pane label='基本信息' name='1'>
                <eng-node-information v-if='(Object.keys(data).length > 0 && types=="edit") || types=="add"' :types='types' :editData='data'></eng-node-information>
            </el-tab-pane>
            <el-tab-pane v-if='data.id && data.status!="101"' label='节点管理' name='2'>
                <eng-node-management
                    v-if='activities1.length >0 && activities2.length >0  && activities3.length >0'
                    :types='types'
                    :activities1='activities1'
                    :isShow='isShow'
                    :activities2='activities2'
                    :activities3='activities3'
                    :num1='num1'
                    :num2='num2'
                    :num3='num3'
                    :parentId='data.id'
                ></eng-node-management>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import EngNodeInformation from './engNodeInformation' //基本信息
import EngNodeManagement from './engNodeManagement' //节点管理
import { createWork, updateWork, queryFlow, queryRouter } from '@/api/EngDefect/EngDefect.js'
var moment = require('moment')
import 'moment/locale/zh-cn'
import { mapGetters } from 'vuex'
import { formatterCode } from '@/framework/utils/formatToClass'

export default {
    data() {
        return {
            formatterCode,
            isShow: true,
            types: '',
            data: {},
            activities: [],
            activeName: '1',
            activities1: [],
            activities2: [],
            activities3: [],
            num1:0,
            num2:0,
            num3:0,
            showRole: false,
            butArr: []
        }
    },

    components: {
        EngNodeInformation,
        EngNodeManagement
    },
    mounted() {
        this.handleClick()
        this.checkRoles()
    },
    computed: {
        ...mapGetters(['userArr']),
        ...mapGetters('layout', ['userInfo'])
    },
    provide() {
        return {
            init: this.init,
            queryNode: this.queryNode
        }
    },
    methods: {
        getRouter(id) {
            let roles = []
            this.userInfo.roles.forEach(el => {
                roles.push(el.id)
            })
            let params = {
                postParams: {
                    id: id,
                    roles: roles,
                    updateUser: this.userInfo.userId
                }
            }
            queryRouter(params).then(res => {
                let data = res.content || []
                console.log(res)
                this.butArr = res.content
            })
        },
        checkRoles() {
            this.showRole = false
            this.userInfo.roles.forEach(el => {
                if (el.id == '1002') {
                    this.showRole = true
                }
            })
        },
        handleClick() {
            if (this.activeName == '2') {
                if (this.data.id) {
                    this.init()
                }
            } else {
                this.types = this.$route.query.type
                if (this.types == 'edit') {
                    let id = this.$route.query.id
                    this.queryData(id)
                    this.getRouter(id)
                }
            }
        },
        queryData(id) {
            let params = {
                postParams: {
                    criteria: {
                        id: id,
                        projectId: this.projectId,
                        trackerId: 1
                    },
                    withColumns: ['customAttribute']
                }
            }
            queryFlow(params).then(res => {
                this.data = res.content ? res.content[0] : []
            })
        },
        // 返回
        goback() {
            this.$router.push('/EngDefect/index')
        },
        // 不予立项
        noneApproval(status) {
            let roles = []
            this.userInfo.roles.forEach(el => {
                roles.push(el.id)
            })
            if (status == 'reject' && this.data.status == '101') {
                this.$confirm('请确定此工程缺陷不予立项?', '操作提示', {
                    confirmButtonText: '确认不予立项',
                    cancelButtonText: '取消',
                    type: 'text',
                    center: true,
                    showClose: false,
                    closeOnClickModal: false
                })
                    .then(() => {
                        let params = {
                            postParams: {
                                id: this.data.id,
                                commit: 'reject',
                                updateUser: this.$store.state.layout.userInfo.userId,
                                roles: roles
                            }
                        }
                        updateWork(params).then(res => {
                            if (res.result == 'success') {
                                this.$message({
                                    type: 'success',
                                    message: '设置成功!'
                                })
                                this.$router.push('/EngDefect/index')
                            }
                        })
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '设置失败'
                        })
                    })
            } else if (status == 'over') {
                this.$confirm('请确定此工程缺陷终止止处理?', '操作提示', {
                    confirmButtonText: '确认终止',
                    cancelButtonText: '取消',
                    type: 'text',
                    center: true,
                    showClose: false,
                    closeOnClickModal: false
                })
                    .then(() => {
                        let params = {
                            postParams: {
                                id: this.data.id,
                                commit: status,
                                updateUser: this.$store.state.layout.userInfo.userId,
                                roles: roles
                            }
                        }
                        updateWork(params).then(res => {
                            if (res.result == 'success') {
                                this.$message({
                                    type: 'success',
                                    message: '设置成功!'
                                })
                                this.$router.push('/EngDefect/index')
                            }
                        })
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '设置失败'
                        })
                    })
            } else {
                let params = {
                    postParams: {
                        id: this.data.id,
                        commit: status,
                        updateUser: this.$store.state.layout.userInfo.userId,
                        roles: roles
                    }
                }
                updateWork(params).then(res => {
                    if (res.result == 'success') {
                        this.$message({
                            type: 'success',
                            message: '设置成功!'
                        })
                        this.$router.push('/EngDefect/index')
                    }
                })
            }
        },
        init() {
            let params = {
                postParams: {
                    criteria: {
                        trackerId: 2,
                        parentId: this.data.id
                    },
                    withColumns: ['customAttribute']
                }
            }
            this.activities = []
            queryFlow(params).then(res => {
                let activities = []
                this.activities1 = []
                this.activities2 = []
                this.activities3 = []
                activities = res.content || []
                activities.forEach(el => {
                    el.chargeUserName = this.formatterCode(el.chargeUser, this.userArr)
                })
                activities.forEach(a => {
                    if (a.realFinishTime) {
                        if (a.askFinishTime) {
                            //把年月日时分秒的时间错转换为年月日的时间戳。记住不能用new Date(),new Date() 回来的是默认8：00  moment(this.formatDateTime(a.realFinishTime)).unix()*1000
                            if (moment(this.formatDateByPattern(a.realFinishTime,'yyyy-MM-dd')).unix() * 1000 < a.askFinishTime) {
                                a.class1 = 'green'
                                a.icon2 = 'el-icon-check'
                                a.color2 = 'green'
                                a.showFinisheTime = '实际完成时间：' + this.formatDateByPattern(a.realFinishTime,'yyyy-MM-dd')
                            } else {
                                a.class1 = 'red'
                                a.icon2 = 'el-icon-check'
                                a.color2 = 'green'
                                a.showFinisheTime = '实际完成时间：' + this.formatDateByPattern(a.realFinishTime,'yyyy-MM-dd')
                            }
                        } else {
                            a.class1 = ''
                            a.icon2 = ''
                            a.color2 = ''
                            a.showFinisheTime = '--'
                        }
                    } else {
                        if (a.askFinishTime) {
                            if (a.askFinishTime < moment(this.formatDateByPattern(new Date().getTime(),'yyyy-MM-dd')).unix() * 1000) {
                                a.class1 = 'red'
                                a.icon2 = ''
                                a.color2 = ''
                                a.showFinisheTime = '要求完成时间：' + this.formatDateByPattern(a.askFinishTime,'yyyy-MM-dd')
                            } else {
                                a.class1 = '#303133'
                                a.icon2 = ''
                                a.color2 = ''
                                a.showFinisheTime = '要求完成时间：' + this.formatDateByPattern(a.askFinishTime,'yyyy-MM-dd')
                            }
                        } else {
                            a.class1 = ''
                            a.icon2 = ''
                            a.color2 = ''
                            a.showFinisheTime = '--'
                        }
                    }
                })
                this.activities = activities
                 this.activities1 = []
                this.activities2 = []
                this.activities3 = []
                this.num1 = 0
                this.num2 = 0
                this.num3 = 0
                this.formatActivity()
            })
        },
        formatTime(date) {
            return moment.unix(date / 1000).format('YYYY-MM-DD hh:mm')
        },
        formatActivity() {
            this.activities.forEach(el => {
                if (el.category == '方案阶段') {
                    this.activities1.push(el)
                } else if (el.category == '实施阶段') {
                    this.activities2.push(el)
                } else if (el.category == '验收阶段') {
                    this.activities3.push(el)
                }
            })
            this.sortActivities(this.activities1)
            this.sortActivities(this.activities2)
            this.sortActivities(this.activities3)
            this.activities1.forEach(el => {
                if(el.files && el.files.length){
                    this.num1 += el.files.length
                }
             })
             this.activities2.forEach(el => {
                if(el.files && el.files.length){
                    this.num2 += el.files.length
                }
             })
             this.activities3.forEach(el => {
                if(el.files && el.files.length){
                    this.num3 += el.files.length
                }
             })
        },
        sortActivities(activities) {
            activities.forEach(el => {
                el.time = el.realFinishTime ? el.realFinishTime : el.askFinishTime ? el.askFinishTime : Number.MAX_SAFE_INTEGER
            })
            activities.sort(function(a, b) {
                return a.time - b.time
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.create-box {
    background: #fff;
    .eng-button {
        padding: 20px;
        div {
            display: inline-block;
        }
        .btn-class {
            margin-right: 20px;
        }
    }
}
</style>