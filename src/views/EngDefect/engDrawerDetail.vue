<template>
    <div class='drawer-box'>
        <div class='fix'>
            <div class='right-drawer'>
                <el-button type='primary' size='mini' @click='isPass' v-if='showRole && detail.status==107'>验收审核</el-button>
                <el-button type='primary' size='mini' v-if='showRole || detail.chargeUser == userInfo.userId' @click='dumpEdit(detail)'>启动编辑</el-button>
            </div>
        </div>
        <div class='cont'>
            <p>
                <span class='gap'>改造工程名称：{{detail.title||'--'}}</span>
                <span class='gap'>项目提交人：{{formatterCode(detail.createUser,userArr1)||'--'}}</span>
                <span class='gap'>项目提交时间：{{detail.createTime?formatDate(detail.createTime):'--'}}</span>
                <span class='gap'>工程缺陷类型：{{detail.category||'--'}}</span>
                <span class='gap'>工程缺陷对象：{{objectName||'--'}}</span>
                <span class='gap'>工程改造规模：{{detail.scope||'--'}}</span>
                <span class='gap'>预估改造金额：{{detail.money||'--'}}元</span>
                <span class='gap'>影响范围：{{detail.effect||'--'}}</span>
                <span class='gap'>紧急程度：{{detail.priority||'--'}}</span>
                <span class='gap'>
                    项目状态：
                    {{formatterCode(detail.status,statusArr)||'--'}}
                </span>
                <span class='gap'>项目负责人：{{formatterCode(detail.chargeUser,userArr1)||'--'}}</span>
            </p>
            <p>
                <span>缺陷情况说明：{{detail.overview||'--'}}</span>
            </p>
            <p>
                <span>临时处理方案：{{detail.plan||'--'}}</span>
            </p>
            <p>
                <span>相关附件：</span>
                <span class='file-span' v-for='(file,index) in distinctFile(detail.files)' :key='index'>
                    <a :href='`/image-service/common/file_get?systemId=saas&secret=46f869eea8b31d14&key=${file}`' target='_blank'>{{file}}</a>
                </span>
            </p>
            <p>
                <span style='display:block'>相关图片：</span>
                <span style='display:inline-block;margin-left:70px;'>
                    <span class='img-span' v-for='(image,index) in distinctFile(detail.pics)' :key='index'>
                        <zoom-image :url='`/image-service/common/image_get?systemId=saas&secret=46f869eea8b31d14&key=${image}`'></zoom-image>
                    </span>
                </span>
            </p>
            <div class='cont-bottom'>
                <eng-node-management
                    v-if='Object.keys(detail).length > 0  && activities1.length >0 && activities2.length >0  && activities3.length >0'
                    :types='1'
                    :userArr='userArr1'
                    :activities1='activities1'
                    :isShow='isShow'
                    :activities2='activities2'
                    :activities3='activities3'
                    :num1='num1'
                    :num2='num2'
                    :num3='num3'
                    :parentId='detail.id'
                ></eng-node-management>
            </div>
        </div>
        <el-dialog title='验收审核' :visible.sync='centerDialogVisible' width='22%' :show-close='false' center>
            <p style='text-align:center'>请确定审核结果</p>
            <span slot='footer' class='dialog-footer'>
                <el-button @click='cancle'>取 消</el-button>
                <el-button @click='noPass'>不通过</el-button>
                <el-button type='primary' @click='pass'>审核通过</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
var moment = require('moment')
import 'moment/locale/zh-cn'
import { mapGetters } from 'vuex'
import EngNodeManagement from './engNodeManagement'
import zoomImage from './zoomImage'
import { queryObject } from '@/api/EngDefect/EngDefect.js'
import { queryFlow, queryRouter, updateWork } from '@/api/EngDefect/EngDefect.js'
import { formatterCode } from '@/framework/utils/formatToClass'

export default {
    components: { EngNodeManagement, zoomImage },
    provide() {
        return {
            init: this.init,
            queryNode: this.queryNode
        }
    },
    inject: ['query'],
    data() {
        return {
            formatterCode,
            centerDialogVisible: false,
            isShow: false,
            objectName: '',
            activities: [],
            activities1: [],
            activities2: [],
            activities3: [],
            num1:0,
            num2:0,
            num3:0,
            detail: {},
            userArr1: [],
            showRole: false,
            autoCommitArr: []
        }
    },
    props: ['id'],
    mounted() {
        this.queryData(this.id)
        this.checkRoles()
        this.queryNode()
        this.userArr1 = JSON.parse(sessionStorage.getItem('userArr'))
    },
    computed: {
        ...mapGetters(['projectId', 'statusArr']),
        ...mapGetters('layout', ['userInfo'])
    },
    methods: {
        checkRoles() {
            this.showRole = false
            this.userInfo.roles.forEach(el => {
                if (el.id == '1002') {
                    this.showRole = true
                }
            })
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
                this.detail = res.content ? res.content[0] : []
            })
        },
        isShowDeleteNode(activities) {
            activities.forEach(el => {
                if (el.isFirm == false) {
                    this.getRouter(el.id)
                }
            })
            this.formatCommit(activities)
        },
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
                this.autoCommitArr = res.content || []
            })
        },
        formatCommit(activities) {
            this.autoCommitArr.forEach(ele => {
                activities.forEach(el => {
                    el.chargeUserName = this.formatterCode(el.chargeUser, this.userArr1)      
                    if (ele.id == el.id) {
                        el.autoCommit = ele.autoCommit
                    }
                })
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
        },
        queryNode() {
            let params = {
                postParams: {
                    criteria: {
                        trackerId: 2,
                        parentId: this.id
                    },
                    withColumns: ['customAttribute']
                }
            }
            this.activities = []
            queryFlow(params).then(res => {
                let activities = []
                activities = res.content || []
                this.isShowDeleteNode(activities)
            })
        },
        formatDateTime(date) {
            if (date) {
                return moment.unix(date).format('YYYY-MM-DD')
            }
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
        },
        distinctFile(a) {
            return Array.from(new Set(a))
        },
        //时间戳转换
        formatDate(date) {
            return moment.unix(date / 1000).format('YYYY-MM-DD')
        },
        isPass() {
            this.centerDialogVisible = true
        },
        dumpEdit(row) {
            this.$router.push({ path: '/EngDefect/engCreateAndEdit', query: { type: 'edit', id: row.id } })
        },
        cancle() {
            this.centerDialogVisible = false
            this.$message({
                showClose: true,
                message: '取消成功',
                type: 'info'
            })
        },
        noPass() {
            this.centerDialogVisible = false
            let roles = []
            this.userInfo.roles.forEach(el => {
                roles.push(el.id)
            })
            let params = {
                postParams: {
                    id: this.detail.id,
                    commit: 'reject',
                    updateUser: this.$store.state.layout.userInfo.userId,
                    roles: roles
                }
            }
            updateWork(params).then(res => {
                if (res.result == 'success') {
                    this.$message({
                        type: 'error',
                        message: '审核不通过!'
                    })
                   let vm = this
                   setTimeout(function(){vm.query()},500)
                }
            })
        },
        pass() {
            this.centerDialogVisible = false
            let roles = []
            this.userInfo.roles.forEach(el => {
                roles.push(el.id)
            })
            let params = {
                postParams: {
                    id: this.detail.id,
                    commit: 'pass',
                    updateUser: this.$store.state.layout.userInfo.userId,
                    roles: roles
                }
            }
            updateWork(params).then(res => {
                if (res.result == 'success') {
                    this.$message({
                        type: 'success',
                        message: '审核通过!'
                    })
                 let vm = this
                 setTimeout(function(){vm.query()},500)
                }
            })
        },
        // 工程缺陷对象查找
        findObj(objectId) {
            let params = {
                getParams: {
                    projectId: this.projectId,
                    objectId: objectId
                }
            }
            queryObject(params).then(res => {
                if (res.data) {
                    this.objectName = res.data.localName
                } else {
                    this.objectName = '--'
                }
            })
        }
    }
}
</script>


<style lang="scss" scoped>
.drawer-box {
    .fix {
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
        top: 0;
    }
    .cont {
        width: 100%;
        padding-left: 20px;
        color: #606266;
        overflow: auto;
        p {
            margin-left: 30px;
            .file-span {
                margin-right: 15px;
            }
            .img-span {
                display: inline-block;
                width: 80px;
                height: 80px;
                margin-right: 15px;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        p:first-child {
            margin-top: 0;
        }
        .gap {
            display: inline-block;
            width: 380px;
            margin-top: 16px;
        }
        .cont-bottom {
            width: 96%;
            margin-top: 20px;
        }
    }
    .right-drawer {
        float: right;
        margin-right: 20px;
    }
}
</style>
<style lang="scss" >
.drawer-box {
    .cont-bottom {
        .el-dialog {
            width: 900px;
            height: 700px;
        }
    }
    .el-dialog__body {
        padding: 10px;
    }
}
</style>