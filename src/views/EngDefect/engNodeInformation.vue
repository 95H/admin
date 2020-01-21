<template>
    <div class='eng-form'>
        <el-form size='mini' ref='ruleForm' :model='ruleForm' label-width='80px' :rules='rules'>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label='改造工程名称：' prop='title'>
                        <el-input
                            v-if='types=="add" || permissionsData.includes("title")'
                            style='width:200px'
                            v-model='ruleForm.title'
                            maxlength='50'
                            placeholder='请输入名称'
                        ></el-input>
                        <el-input v-else style='width:200px' v-model='ruleForm.title' :disabled='true' maxlength='50' placeholder='请输入名称'></el-input>
                    </el-form-item>
                    <el-form-item label='工程缺陷类型：' prop='category'>
                        <el-select
                            v-if='types=="add" || permissionsData.includes("category")'
                            style='width:200px'
                            v-model='ruleForm.category'
                            placeholder='请选择类型'
                        >
                            <el-option v-for='item in categoryOptions' :key='item.value' :label='item.label' :value='item.value'></el-option>
                        </el-select>
                        <el-select v-else style='width:200px' v-model='ruleForm.category' placeholder='请选择类型' disabled>
                            <el-option v-for='item in categoryOptions' :key='item.value' :label='item.label' :value='item.value'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label='工程缺陷对象：'>
                        <el-input
                            v-if='types=="add" || permissionsData.includes("object")'
                            style='width:200px'
                            v-model='ruleForm.object'
                            placeholder='请选择对象'
                        ></el-input>
                        <el-input v-else style='width:200px' v-model='ruleForm.object' :disabled='true' placeholder='请选择对象'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label='工程缺陷改造规模：'>
                        <el-select
                            style='width:200px'
                            v-if='types=="add" || permissionsData.includes("scope")'
                            v-model='ruleForm.scope'
                            placeholder='请选择改造规模'
                        >
                            <el-option v-for='item in urgentArr' :key='item.value' :label='item.label' :value='item.value'></el-option>
                        </el-select>
                        <el-select v-else style='width:200px' v-model='ruleForm.scope' placeholder='请选择改造规模' disabled>
                            <el-option v-for='item in urgentArr' :key='item.value' :label='item.label' :value='item.value'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label='预估改造金额：'>
                        <el-input
                            v-if='types=="add" || permissionsData.includes("money")'
                            style='width:200px'
                            v-model='ruleForm.money'
                            placeholder='请输入金额'
                        ></el-input>
                        <el-input v-else style='width:200px' v-model='ruleForm.money' :disabled='true' placeholder='请输入金额'></el-input>元
                    </el-form-item>
                    <el-form-item label='影响范围：'>
                        <el-select
                            v-if='types=="add" || permissionsData.includes("effect")'
                            style='width:200px'
                            v-model='ruleForm.effect'
                            placeholder='请选择影响范围'
                        >
                            <el-option v-for='item in fluenceArr' :key='item.value' :label='item.label' :value='item.value'></el-option>
                        </el-select>
                        <el-select v-else style='width:200px' v-model='ruleForm.effect' placeholder='请选择影响范围' disabled>
                            <el-option v-for='item in fluenceArr' :key='item.value' :label='item.label' :value='item.value'></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label='紧急程度：'>
                        <el-select
                            v-if='types=="add" || permissionsData.includes("priority")'
                            style='width:200px'
                            v-model='ruleForm.priority'
                            placeholder='请选择紧急程度'
                        >
                            <el-option v-for='item in urgentArr' :key='item.value' :label='item.label' :value='item.value'></el-option>
                        </el-select>
                        <el-select v-else style='width:200px' v-model='ruleForm.priority' placeholder='请选择紧急程度' disabled>
                            <el-option v-for='item in urgentArr' :key='item.value' :label='item.label' :value='item.value'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label='项目负责人：' prop='chargeUser'>
                        <el-select
                            v-if='types=="add" || permissionsData.includes("chargeUser")'
                            v-model='ruleForm.chargeUser'
                            placeholder='请选择负责人'
                            clearable
                        >
                            <system-user-list></system-user-list>
                        </el-select>
                        <el-select v-else v-model='ruleForm.chargeUser' placeholder='请选择负责人' clearable disabled>
                            <system-user-list></system-user-list>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label='缺陷情况说明：'>
                <label></label>
                <el-input v-if='types=="add" || permissionsData.includes("overview")' type='textarea' maxlength='100' v-model='ruleForm.overview'></el-input>
                <el-input v-else type='textarea' :disabled='true' maxlength='100' v-model='ruleForm.overview'></el-input>
            </el-form-item>
            <el-form-item label='临时处置方案：'>
                <label></label>
                <el-input v-if='types=="add" || permissionsData.includes("plan")' type='textarea' maxlength='100' v-model='ruleForm.plan'></el-input>
                <el-input v-else type='textarea' :disabled='true' maxlength='100' v-model='ruleForm.plan'></el-input>
            </el-form-item>
            <el-form-item label='相关附件：'>
                <label></label>
                <span class='enclosure-box'>
                    <upload-file
                        v-if='ruleForm.files.length>=0'
                        :files='ruleForm.files'
                        :types='types'
                        :permissionsData='permissionsData'
                        @setFile='setFile'
                    ></upload-file>
                </span>
            </el-form-item>
            <el-form-item label='相关照片：'>
                <upload-img
                    v-if='ruleForm.pics.length>=0'
                    :souseArr='ruleForm.pics'
                    :types='types'
                    :permissionsData='permissionsData'
                    @setPic='setPic'
                ></upload-img>
            </el-form-item>
        </el-form>
        <div class='foot'>
            <el-button v-if='this.types=="add"' style='margin-left:80%;' type='primary' @click='create("ruleForm")'>创建</el-button>
            <div v-if='this.types=="edit"'>
                <span>项目由 {{formatterCode(ruleForm.createUser,userArr1)}} 在 {{ruleForm.createTime|formatDateTimeForMillisecond}} 创建提交</span>
                <el-button style='margin-left:50%;' type='primary' @click='save("ruleForm")'>保存</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import UploadImg from './uploadImg'
import { createWork, updateWork, queryObjectNum, queryImmutableAttribute } from '@/api/EngDefect/EngDefect.js'
import { mapGetters } from 'vuex'
import uploadFile from './uploadFile'
var moment = require('moment')
import 'moment/locale/zh-cn'
import { formatterCode } from '@/framework/utils/formatToClass'
import SystemUserList from './systemuserList'

export default {
    data() {
        return {
            formatterCode,
            rules: {
                title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }, { max: 50, message: '长度在50个字符', trigger: 'blur' }],
                category: [{ required: true, message: '请选择缺陷类型', trigger: 'blur' }]
            },
            ruleForm: {
                title: '', //名称
                category: '', //类型
                object: '', //对象
                scope: '', //规模
                money: '', //金额
                effect: '', //影响范围
                priority: '', //紧急程度
                chargeUser: '', //负责人
                overview: '', //缺陷情况说明
                plan: '', //处置方案
                files: [],
                pics: [],
                createUser: '',
                createTime: ''
            },
            projectCode: '',
            fluenceArr: [
                //影响范围
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
            urgentArr: [
                //紧急程度
                {
                    value: '高',
                    label: '高'
                },
                {
                    value: '中',
                    label: '中'
                },
                {
                    value: '低',
                    label: '低'
                }
            ],
            categoryOptions: [
                //缺陷情况
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
            souseArr: [],
            files: [],
            fileName: '',
            userArr1: [],
            permissionsData: []
        }
    },
    props: ['types', 'editData'],
    components: {
        UploadImg,
        uploadFile,
        SystemUserList
    },
    mounted() {
        this.init()
        this.userArr1 = JSON.parse(sessionStorage.getItem('userArr'))
        if (this.types == 'edit') {
            this.getEditPermissions()
        }
    },
    computed: {
        ...mapGetters(['projectId', 'userArr']),
        ...mapGetters('layout', ['userInfo'])
    },
    methods: {
        getEditPermissions() {
            let roles = []
            this.userInfo.roles.forEach(el => {
                roles.push(el.id)
            })
            let postParams = {
                id: this.ruleForm.id,
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
        initParam() {
            let p = {}
            for (let att in this.ruleForm) {
                if (this.ruleForm[att] && this.ruleForm[att] != '') {
                    p[att] = this.ruleForm[att]
                }
            }
            p.trackerId = 1
            p.projectId = this.projectId
            return p
        },
        setPic(pics) {
            this.ruleForm.pics = pics
        },
        setFile(file) {
            this.ruleForm.files = file
        },
        init() {
            if (this.editData) {
                this.ruleForm.title = this.editData.title
                this.ruleForm.category = this.editData.category
                this.ruleForm.object = this.editData.object
                this.ruleForm.scope = this.editData.scope
                this.ruleForm.money = this.editData.money
                this.ruleForm.effect = this.editData.effect
                this.ruleForm.priority = this.editData.priority
                this.ruleForm.chargeUser = this.editData.chargeUser
                this.ruleForm.overview = this.editData.overview
                this.ruleForm.plan = this.editData.plan
                this.ruleForm.files = this.editData.files || []
                this.ruleForm.pics = this.editData.pics || []
                this.ruleForm.id = this.editData.id
                this.ruleForm.trackerId = this.editData.trackerId
                this.ruleForm.createUser = this.editData.createUser
                this.ruleForm.createTime = this.editData.createTime
            }
        },
        create(ruleForm) {
            this.$refs[ruleForm].validate(valid => {
                if (valid) {
                    let params = {
                        getParams: {
                            projectId: this.projectId
                        }
                    }

                    queryObjectNum(params).then(res => {
                        this.projectCode = res.id
                        this.createProject(this.projectCode)
                    })
                } else {
                    return false
                }
            })
        },
        createProject(projectCode) {
            let params = this.initParam()
            params.projectCode = projectCode
            params.createUser = this.$store.state.layout.userInfo.userId
            createWork({ postParams: params }).then(res => {
                if (res.result == 'success') {
                    this.$message.success('创建成功！')
                    this.$router.push('/EngDefect/index')
                } else {
                    this.$message.success('创建失败！')
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
                    let params = {
                        postParams: this.ruleForm
                    }
                    params.postParams.projectId = this.projectId
                    params.postParams.updateUser = this.$store.state.layout.userInfo.userId
                    params.postParams.roles = roles
                    updateWork(params).then(res => {
                        if (res.result == 'success') {
                            this.$message.success('保存成功！')
                            this.$router.push('/EngDefect/index')
                        } else {
                            this.$message.success('保存失败！')
                        }
                    })
                } else {
                    return false
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.eng-form {
    background: #fff;
    padding: 20px;
    min-width: 1100px;
    .eng-form-box {
        display: flex;
        .eng-form-center {
            width: 30%;
        }
    }
    .enclosure-box {
        display: inline-block;
        .enclosure {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            span {
                display: flex;
                align-items: center;
                margin-right: 20px;
                i {
                    cursor: pointer;
                    font-size: 16px;
                }
            }
        }
    }
    .foot {
        padding: 0 80px;
    }
}
</style>
<style lang="scss">
.eng-form {
    .el-form-item__error {
        left: 60px;
    }
    .el-form-item__label {
        width: 140px !important;
    }
    .el-textarea {
        width: 60%;
    }

    .enclosure-box {
        .el-upload-dragger {
            border: none;
            width: 50px;
            height: 30px;
        }
        .el-upload-dragger .el-icon-upload {
            font-size: 30px;
            margin: 0;
            line-height: 40px;
        }
    }
}
</style>