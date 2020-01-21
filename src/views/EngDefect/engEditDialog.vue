<template>
    <div class='timeLine-edit'>
        <el-dialog :title='title' :visible.sync='dialogFormVisible'>
            <div class='dia-content'>
                <div class='dia-content-left'>
                    <p>节点详情</p>
                    <el-form :model='ruleForm' :rules='rules' ref='ruleForm' label-width='100px' class='demo-ruleForm'>
                        <el-form-item label='节点名称:' prop='title'>
                            <span v-if='types=="edit" '>
                                <el-input v-if='permissionsData.includes("title") && !ruleForm.isFirm' maxlength='50' v-model='ruleForm.title'></el-input>
                                <span v-else>{{ruleForm.title}}</span>
                            </span>
                            <el-input v-else maxlength='50' v-model='ruleForm.title'></el-input>
                        </el-form-item>
                        <el-form-item label='节点说明:' prop='description'>
                            <el-input type='textarea'  v-if='types=="add" || permissionsData.includes("description")' maxlength='100' v-model='ruleForm.description'></el-input>
                        </el-form-item>
                        <el-form-item label='节点负责人:' prop='chargeUser'>
                            <el-select
                                v-if='types=="add" || permissionsData.includes("chargeUser")'
                                v-model='ruleForm.chargeUser'
                                placeholder='请选择负责人'
                                clearable
                            >
                                <system-user-list></system-user-list>
                            </el-select>
                            <el-select v-else v-model='ruleForm.chargeUser' placeholder='请选择负责人' clearable :disabled='true'>
                                <system-user-list></system-user-list>
                            </el-select>
                        </el-form-item>
                        <el-form-item label='要求完成日期:'>
                            <el-date-picker
                                v-if='types=="add" || permissionsData.includes("askFinishTime")'
                                type='datetime'
                                placeholder='选择日期'
                                @change="setRemindTime"
                                v-model='ruleForm.askFinishTime'
                                :picker-options='pickerOptions1'
                                style='width: 100%;'
                                format='yyyy-MM-dd HH:mm'
                                value-format='timestamp'
                            ></el-date-picker>
                            <el-date-picker
                                v-else
                                type='datetime'
                                placeholder='选择日期'
                                v-model='ruleForm.askFinishTime'
                                :picker-options='pickerOptions1'
                                style='width: 100%;'
                                format='yyyy-MM-dd HH:mm'
                                value-format='timestamp'
                                :disabled='true'
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item prop='note' v-if="showNote &&　ruleForm.askFinishTime">
                            <el-input type='textarea' maxlength='100' placeholder="请输入要求完成时间变更原因" v-model='ruleForm.note'></el-input>
                            <span></span>
                        </el-form-item>
                        <el-form-item label='提醒日期:'>
                            <el-date-picker
                                v-if='types=="add" || permissionsData.includes("noticeTime")'
                                type='datetime'
                                format='yyyy-MM-dd HH:mm'
                                placeholder='选择日期'
                                @change="setAskFinishTime"
                                v-model='ruleForm.noticeTime'
                                style='width: 100%;'
                                :picker-options='pickerOptions'
                                value-format='timestamp'
                            ></el-date-picker>
                            <el-date-picker
                                v-else
                                type='datetime'
                                format='yyyy-MM-dd HH:mm'
                                placeholder='选择日期'
                                v-model='ruleForm.noticeTime'
                                style='width: 100%;'
                                :picker-options='pickerOptions'
                                value-format='timestamp'
                                :disabled='true'
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item label='相关附件:' prop='files'>
                            <upload-file :files='ruleForm.files || []' :permissionsData='permissionsData' :types='types' @setFile='setFile'></upload-file>
                        </el-form-item>
                        <el-form-item label='相关照片：'>
                            <upload-img
                                v-if='ruleForm.pics.length>=0'
                                :permissionsData='permissionsData'
                                :types='types'
                                :souseArr='ruleForm.pics'
                                @setPic='setPic'
                            ></upload-img>
                        </el-form-item>
                    </el-form>
                </div>
                <div class='dia-content-right'>
                    <p class='finish'>要求完成日期修改记录</p>
                    <eng-record v-if="ruleForm.id" ref='engRecord' :workId='ruleForm.id '></eng-record>
                </div>
            </div>
            <span slot='footer' class='dialog-footer'>
                <el-button size='mini' @click='close'>关闭</el-button>
                <el-button size='mini' v-if='this.title=="创建节点"' @click='create("ruleForm")' type='primary'>创建</el-button>
                <el-button size='mini' v-else @click='save("ruleForm")' type='primary'>保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
var moment = require('moment')
import 'moment/locale/zh-cn'
import { mapGetters } from 'vuex'
import engRecord from './engRecord'
import { createWork, updateWork, queryImmutableAttribute } from '@/api/EngDefect/EngDefect.js'
import uploadFile from './uploadFile'
import UploadImg from './uploadImg'
import { formatterCode } from '@/framework/utils/formatToClass'
import SystemUserList from './systemuserList'

export default {
    name: 'IntegralAcquisition',
    inject: ['init'],
    data() {
        return {
            formatterCode,
            category: '',
            dialogFormVisible: false,
            title: '',
            isRequired: true,
            ruleForm: {
                title: '',
                note: '',
                chargeUser: '',
                askFinishTime: '',
                noticeTime: '',
                files: [],
                pics: [],
                description: '',
                isCheck: false,
                isFirm: false
            },
            files: '',
            fileName: '',
            rules: {
                title: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
                note: [{ required: false, message: '请输入内容', trigger: 'blur' }]
            },
            actives: [],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now()
                }
            },
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 3600 * 1000 * 24
                }
            },
            permissionsData: [],
            types: '',
            showNote:false,
        }
    },
    props: ['parentId'],
    computed: {
        ...mapGetters(['projectId', 'userArr']),
        ...mapGetters('layout', ['userInfo'])
    },
    components: { engRecord, uploadFile, UploadImg, SystemUserList },
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
                if (res.result == 'success') {
                    this.permissionsData = res.data ? res.data : []
                }
            })
        },
        setFile(file) {
            this.ruleForm.files = file
        },
        setPic(pics) {
            this.ruleForm.pics = pics
        },
        open(row, num, stage) {
            this.dialogFormVisible = true
            this.category = stage
            if (num == 1) {
                this.title = '创建节点'
                this.types = 'add'
                this.ruleForm = {
                    title: '',
                    note: '',
                    chargeUser: '',
                    askFinishTime: '',
                    noticeTime: '',
                    files: [],
                    pics: [],
                    description: '',
                    isCheck: false,
                    isFirm: false
                }
            } else {
                this.title = '编辑节点'
                this.types = 'edit'
                if (row) {
                    this.ruleForm.title = row.title
                    this.ruleForm.askFinishTime = row.askFinishTime ? row.askFinishTime : null
                    this.ruleForm.noticeTime = row.noticeTime ? row.noticeTime : null
                    this.ruleForm.id = row.id
                    this.ruleForm.pics = row.pics || []
                    this.ruleForm.files = row.files || []
                    this.ruleForm.description = row.description
                    this.ruleForm.note = ''
                    this.ruleForm.isFirm = row.isFirm
                    this.ruleForm.isCheck = row.isCheck
                    this.category = stage
                    this.$set(this.ruleForm, 'chargeUser', row.chargeUser)
                    this.getEditPermissions(this.ruleForm.id)
                }
            }
            if (this.$refs.engRecord) {
                this.$refs.engRecord.queryRecord(this.ruleForm.id)
            }
        },
        close() {
            this.ruleForm.note = ''
            this.$refs.ruleForm.clearValidate()
            this.$refs.ruleForm.resetFields()
            this.dialogFormVisible = false
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
        distinctFile(a) {
            return Array.from(new Set(a))
        },
        create(ruleForm) {
            this.$refs[ruleForm].validate(valid => {
                if (valid) {
                    let p = this.initParam()
                    p.createUser = this.$store.state.layout.userInfo.userId
                    p.files = this.distinctFile(this.ruleForm.files)
                    p.pics = this.distinctFile(this.ruleForm.pics)
                    p.isFirm = false
                    p.isCheck = false
                    createWork({ postParams: p }).then(res => {
                        if (res.result == 'success') {
                            this.$message.success('创建成功！')
                            this.init()
                            this.$refs.engRecord.queryRecord(this.ruleForm.id)
                        } else {
                            this.$message.success('创建失败！')
                        }
                    })
                    this.dialogFormVisible = false
                }
            })
        },
        save(ruleForm) {
            let roles = []
            this.userInfo.roles.forEach(el => {
                roles.push(el.id)
            })
            this.$refs[ruleForm].validate(valid => {
                if (valid) {
                    let p = this.initParam()
                    p.updateUser = this.$store.state.layout.userInfo.userId
                    p.files = this.distinctFile(this.ruleForm.files)
                    p.pics = this.distinctFile(this.ruleForm.pics)
                    p.isFirm = this.ruleForm.isFirm
                    p.isCeck = this.ruleForm.isCeck
                    p.roles = roles
                    updateWork({ postParams: p }).then(res => {
                        if (res.result == 'success') {
                            this.$message.success('保存成功！')
                            this.init()
                            this.$refs.engRecord.queryRecord(this.ruleForm.id)
                        } else {
                            this.$message.success('保存失败！')
                        }
                    })
                    this.dialogFormVisible = false
                }
            })
        }
    }
}
</script>
<style lang='scss' scoped>
.timeLine-edit {
    .dia-content {
        width: 100%;
        display: flex;
        .dia-content-left {
            padding-right: 10px;
            height: 480px;
            overflow: auto;
            width: 55%;
            text-align: left;
            p {
                text-align: center;
            }
            .enclosure-box {
                display: block;
            }
            .dia-name {
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                line-clamp: 1;
                -webkit-box-orient: vertical;
            }
            .dia-span {
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                line-clamp: 3;
                -webkit-box-orient: vertical;
            }
        }
        .dia-content-right {
            padding: 0 20px;
            width: 45%;
            height: 500px;
            .finish {
                text-align: center;
            }
        }
    }
}
</style>
<style lang="scss" >
.timeLine-edit {
    .el-upload-dragger {
        width: 40px;
        height: 40px;
        border: none;
    }
    .el-upload-dragger .el-icon-upload {
        font-size: 40px;
        margin: 0;
    }

    .el-dialog {
        width: 900px;
        height: 700px;
        .el-dialog__footer {
            clear: both;
            margin-top: 0;
            text-align: center;
        }
    }
}
</style>