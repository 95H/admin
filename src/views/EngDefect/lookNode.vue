<template>
    <div class='look-node'>
        <el-dialog title='查看节点' :visible.sync='nodeDialogVisible' :before-close='handleClose' center>
            <div class='dia-content'>
                <div class='dia-content-left'>
                    <p>节点详情</p>
                    <el-form :model='ruleForm' :rules='rules' ref='ruleForm' label-width='100px' class='demo-ruleForm'>
                        <el-form-item label='节点名称:' prop='title'>
                            <span class='look-span' v-if='showFlag_title'>
                                {{ruleForm.title||'--'}}
                                <i v-if='ruleForm.isFirm && permissionsData.includes("title")' class='el-icon-edit el-input__icon' @click='switchEdit("title")'></i>
                            </span>
                            <span v-else>
                                <span v-if='permissionsData.includes("title")' class='edit-span'>
                                    <el-input v-model='ruleForm.title' maxlength='50'></el-input>
                                    <i class='el-input__icon el-icon-check' @click='switchLook("title","ruleForm" )'></i>
                                </span>
                                <span v-else class='edit-span'>
                                    <el-input v-model='ruleForm.title' maxlength='50' :disabled='true'></el-input>
                                    <i class='el-input__icon el-icon-check' @click='switchLook("title","ruleForm" )'></i>
                                </span>
                            </span>
                        </el-form-item>
                        <el-form-item label='节点说明:' prop='description'>
                            <span class='look-span2' v-if='showFlag_description'>
                                <span>{{ruleForm.description||'--'}}</span>
                                <i v-if='permissionsData.includes("description")' class='el-icon-edit el-input__icon' @click='switchEdit("description")'></i>
                            </span>
                            <span v-else>
                                <span class='edit-span' v-if='permissionsData.includes("description")'>
                                    <el-input v-model='ruleForm.description' maxlength='100'></el-input>
                                    <i class='el-input__icon el-icon-check' @click='switchLook("description","ruleForm")'></i>
                                </span>
                                <span class='edit-span' v-else>
                                    <el-input v-model='ruleForm.description' maxlength='100' :disabled='true'></el-input>      
                                </span>
                            </span>
                        </el-form-item>
                        <el-form-item label='节点负责人:' prop='chargeUser'>
                            <span class='look-span' v-if='showFlag_chargeUser'>
                                {{formatterCode(ruleForm.chargeUser,userArr1)||'--'}}
                                <i
                                    v-if='permissionsData.includes("chargeUser")'
                                    class='el-icon-edit el-input__icon'
                                    @click='switchEdit("chargeUser")'
                                ></i>
                            </span>
                            <span v-else>
                                <span class='edit-span' v-if='permissionsData.includes("chargeUser")'>
                                    <el-select v-model='ruleForm.chargeUser' placeholder='请选择负责人' clearable>
                                        <system-user-list></system-user-list>
                                    </el-select>
                                    <i class='el-input__icon el-icon-check' @click='switchLook("chargeUser","ruleForm")'></i>
                                </span>
                                <span class='edit-span' v-else>
                                    <el-select :disabled='true' v-model='ruleForm.chargeUser' placeholder='请选择负责人' clearable>
                                        <system-user-list></system-user-list>
                                    </el-select>
                                   
                                </span>
                            </span>
                        </el-form-item>
                        <el-form-item label='要求完成日期:' prop='askFinishTime'>
                            <span class='look-span' v-if='showFlag_askFinishTime'>
                                {{formatterM(ruleForm.askFinishTime)}}
                                <i  v-if='permissionsData.includes("askFinishTime")'  class='el-icon-edit el-input__icon' @click='switchEdit("askFinishTime")'></i>
                            </span>
                            <span class='edit-span' v-else>
                                <el-date-picker
                                    v-if='permissionsData.includes("askFinishTime")'
                                     type='datetime'
                                    @change="setRemindTime"
                                    format='yyyy-MM-dd HH:mm'
                                    placeholder='选择日期'
                                    value-format='timestamp'
                                    v-model='ruleForm.askFinishTime'
                                    maxlength='100'
                                    style='width: 100%;'
                                ></el-date-picker>
                                <el-date-picker
                                    v-else
                                    type='datetime'
                                    format='yyyy-MM-dd HH:mm'
                                    placeholder='选择日期'
                                    value-format='timestamp'
                                    v-model='ruleForm.askFinishTime'
                                    maxlength='100'
                                    style='width: 100%;'
                                    :disabled='true'
                                ></el-date-picker>
                                <i class='el-input__icon el-icon-check' @click='switchLook("askFinishTime","ruleForm")'></i>
                            </span>
                        </el-form-item>
                        <el-form-item prop='note' v-if='!showFlag_askFinishTime && ruleForm.askFinishTime && showNote'>
                            <el-input type='textarea' placeholder="请输入要求完成时间变更原因" v-model='ruleForm.note'></el-input>
                            <span></span>
                        </el-form-item>
                        <el-form-item label='提醒日期:' prop='noticeTime'>
                            <span class='look-span' v-if='showFlag_noticeTime'>
                                {{formatterM(ruleForm.noticeTime)}}
                                <i  v-if='permissionsData.includes("noticeTime")' class='el-icon-edit el-input__icon' @click='switchEdit("noticeTime")'></i>
                            </span>
                            <span class='edit-span' v-else>
                                <el-date-picker
                                    v-if='permissionsData.includes("noticeTime")'
                                     type='datetime'
                                    @change="setAskFinishTime"
                                     format='yyyy-MM-dd HH:mm'
                                    placeholder='选择日期'
                                    v-model='ruleForm.noticeTime'
                                    :picker-options='pickerOptions'
                                    style='width: 100%;'
                                    value-format='timestamp'
                                ></el-date-picker>
                                <el-date-picker
                                    v-else
                                    type='datetime'
                                    placeholder='选择日期'
                                    v-model='ruleForm.noticeTime'
                                     format='yyyy-MM-dd HH:mm'
                                    :picker-options='pickerOptions'
                                    style='width: 100%;'
                                    value-format='timestamp'
                                    :disabled='true'
                                ></el-date-picker>
                                <!-- <i class='el-input__icon el-icon-check' @click='switchLook("noticeTime","ruleForm")'></i> -->
                            </span>
                        </el-form-item>
                        <el-form-item label='相关附件:' prop='files'>
                            <upload-file :files='ruleForm.files' @setFile='setFile' :permissionsData='permissionsData'></upload-file>
                        </el-form-item>
                        <el-form-item label='相关照片：'>
                            <upload-img v-if='ruleForm.pics.length>=0' :souseArr='ruleForm.pics' @setPic='setPic' :permissionsData='permissionsData'></upload-img>
                        </el-form-item>`
                    </el-form>
                </div>
                <div class='dia-content-right'>
                    <p class='finish'>要求完成日期修改记录</p>
                    <eng-record ref='engRecord' v-if='ruleForm.id' :workId='ruleForm.id'></eng-record>
                </div>
            </div>
            <span slot='footer' class='dialog-footer'>
                <el-button size='mini' @click='close'>关闭</el-button>
                <el-button v-if='showFlagContinue && !ruleForm.isCheck' size='mini' @click='buttonFirm("continue")' type='primary'>重新打开</el-button>
                <el-button v-if='showFlagOver && !ruleForm.isCheck' size='mini' @click='buttonFirm("over")' type='primary'>标记完成</el-button>
                <el-button v-if='showFlagOver && ruleForm.isCheck' size='mini' @click='buttonFirm("over")' type='primary'>申请验收</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
var moment = require('moment')
import 'moment/locale/zh-cn'
import engRecord from './engRecord'
import uploadFile from './uploadFile'
import UploadImg from './uploadImg'
import { updateWork, queryFlow, queryImmutableAttribute, queryRouter } from '@/api/EngDefect/EngDefect.js'
import { mapGetters } from 'vuex'
import { formatterCode } from '@/framework/utils/formatToClass'
import SystemUserList from './systemuserList'

export default {
    components: { engRecord, uploadFile, UploadImg, SystemUserList },
    props: ['parentId'],
    inject: ['queryNode','query'],
    data() {
        return {
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now()
                }
            },
            formatterCode,
            workId: '',
            showFlag_noticeTime: true,
            showFlag_title: true,
            showFlag_askFinishTime: true,
            showFlag_chargeUser: true,
            showFlag_description: true,
            nodeDialogVisible: false,
            ruleForm: {
                files: [],
                pics: []
            },
            rules: {
                title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
                note: [{ required: false, message: '请输入内容', trigger: 'blur' }]
            },
            activities: [],
            nodeId: '',
            userArr1: [],
            permissionsData: [],
            showFlagOver: false,
            showFlagContinue: false,
            showNote:false,
        }
    },
    computed: {
        ...mapGetters(['projectId']),
        ...mapGetters('layout', ['userInfo'])
    },
    mounted() {
        this.userArr1 = JSON.parse(sessionStorage.getItem('userArr'))
    },
    methods: {
         setRemindTime(){
            if(this.ruleForm.noticeTime){
                if(this.ruleForm.noticeTime>this.ruleForm.askFinishTime){
                     this.ruleForm.noticeTime = this.ruleForm.askFinishTime
                }

            }else{
                this.ruleForm.noticeTime = this.ruleForm.askFinishTime
            }
        },
        setAskFinishTime(){
            if(this.ruleForm.askFinishTime){
                if(this.ruleForm.noticeTime>this.ruleForm.askFinishTime){
                     this.ruleForm.askFinishTime = this.ruleForm.noticeTime
                }

            }else{
                 this.ruleForm.askFinishTime = this.ruleForm.noticeTime
            }
        },
        getQuery() {
            let roles = []
            this.userInfo.roles.forEach(el => {
                roles.push(el.id)
            })
            let params = {
                postParams: {
                    id: this.ruleForm.id,
                    roles: roles,
                    updateUser: this.userInfo.userId
                }
            }
            queryRouter(params).then(res => {
                let data = res.content || []
                this.showFlagOver = data.some(el => el.flag == 'over')
                this.showFlagContinue = data.some(el => el.flag == 'continue')
            })
        },
        distinctFile(a) {
            return Array.from(new Set(a))
        },
        getEditPermissions(id) {
            let roles = []
            this.userInfo.roles.forEach(el => {
                roles.push(el.id)
            })
            let postParams = {
                id: id,
                roles: roles,
                updateUser: this.userInfo.userId
            }
            queryImmutableAttribute({ postParams }).then(res => {
                console.log(res)
                if (res.result == 'success') {
                    this.permissionsData = res.data ? res.data : []
                }
            })
        },
        open(row) {
            this.nodeDialogVisible = true
            this.ruleForm = row
            this.$set(this.ruleForm, 'title', row.title)
            this.$set(this.ruleForm, 'askFinishTime', row.askFinishTime ? row.askFinishTime : null)
            this.$set(this.ruleForm, 'noticeTime', row.noticeTime ? row.noticeTime : null)
            this.$set(this.ruleForm, 'id', row.id)
            this.$set(this.ruleForm, 'description', row.description)
            this.$set(this.ruleForm, 'note', '')
            this.$set(this.ruleForm, 'chargeUser', row.chargeUser)
            this.$set(this.ruleForm, 'pics', row.pics ? row.pics : [])
            this.$set(this.ruleForm,'files',row.files ? row.files:[])
            if (row) {
                this.getEditPermissions(this.ruleForm.id)
                this.getQuery()
            }
        },
        switchEdit(msg) {
            this['showFlag_' + msg] = false
        },
        switchLook(msg, ruleForm) {
            if (msg == 'askFinishTime') {
                this.$refs[ruleForm].validate(valid => {
                    if (valid) {
                        this.rules.note[0].required = true
                        this['showFlag_' + msg] = true
                    }
                })
            } else {
                this['showFlag_' + msg] = true
            }
            this.update(ruleForm)
        },
        close() {
            this.handleClose()
        },
        handleClose() {
            this.queryNode()
            this.ruleForm.note = ''
            this.$refs.ruleForm.clearValidate()
            this.$refs.ruleForm.resetFields()
            this.$refs.engRecord.queryRecord(this.ruleForm.id)
            this.dialogFormVisible = false
            this.nodeDialogVisible = false
            this.showFlag_noticeTime = true
            this.showFlag_title = true
            this.showFlag_askFinishTime = true
            this.showFlag_chargeUser = true
            this.showFlag_description = true
        },
        buttonFirm(status) {
            let roles = []
            this.userInfo.roles.forEach(el => {
                roles.push(el.id)
            })
            let params = {
                postParams: {
                    id: this.ruleForm.id,
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
                    this.queryNode()
                    let vm = this
                    setTimeout(function(){vm.query()},500)
                    
                }
            })
            this.close()
        },
        initParam() {
            let p = {}
            for (let att in this.ruleForm) {
                if (this.ruleForm[att] && this.ruleForm[att] != '') {
                    p[att] = this.ruleForm[att]
                }
            }
            p.trackerId = 2
            p.projectId = this.projectId
            p.parentId = this.parentId
            p.category = this.category
            return p
        },
        update(ruleForm) {
            let roles = []
            this.userInfo.roles.forEach(el => {
                roles.push(el.id)
            })
            this.$refs[ruleForm].validate(valid => {
                if (valid) {
                    let p = this.initParam()
                    p.updateUser = this.$store.state.layout.userInfo.userId
                    p.pics = this.distinctFile(this.ruleForm.pics)
                    p.files = this.distinctFile(this.ruleForm.files)
                    p.roles = roles
                    updateWork({ postParams: p })
                }
            })
        },
        setFile(file) {
            this.ruleForm.files = file
              this.update('ruleForm')
        },
        setPic(pics) {
            this.ruleForm.pics = pics
              this.update('ruleForm')
        },
        formatterM(date) {
            if (date) {
                return moment.unix(date / 1000).format('YYYY-MM-DD')
            }
        }
    },
    watch: {
        'ruleForm.askFinishTime': function(val, oldVal) {
           if (oldVal && oldVal!=val) {
                this.showNote = true
                this.rules.note[0].required = true
            } else {
                this.showNote = false
                this.rules.note[0].required = false
            }
        }
    },
}
</script>

<style lang='scss' scoped>
.look-node {
    .dia-content {
        width: 100%;
        display: flex;
        .dia-content-left {
            width: 55%;
            overflow: auto;
            height: 480px;
            p {
                text-align: center;
            }
            .look-span {
                display: flex;
                span {
                    max-width: 242px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .look-span2 {
                display: flex;
                span {
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    line-clamp: 3;
                    -webkit-box-orient: vertical;
                }
            }
            .edit-span {
                display: flex;
                i {
                    margin-left: 4px;
                }
            }
        }
        .dia-content-right {
            padding: 0 20px;
            width: 48%;
            // overflow: auto;
            // height: 450px;
            .finish {
                text-align: center;
            }
        }
    }
}
</style>
<style lang="scss" >
.look-node {
    .el-upload-dragger {
        width: 40px;
        height: 40px;
        border: none;
    }
    .el-upload-dragger .el-icon-upload {
        font-size: 40px;
        margin: 0;
    }
    .el-dialog--center .el-dialog__footer {
        clear: both;
    }
    .el-dialog__footer {
        clear: both;
        margin-top: 30px;
        text-align: center;
    }
}
</style>