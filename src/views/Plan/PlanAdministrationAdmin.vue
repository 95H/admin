<template>
    <div class="input-form">
        <el-form :model="form" :rules="Rules" ref="loginForm">
            <el-form-item label="预案名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="form.name" auto-complete="off" placeholder="不超过10个字"></el-input>
            </el-form-item>
            <el-form-item label="预案简称" :label-width="formLabelWidth" prop="container">
                <el-input v-model="form.container" auto-complete="off" placeholder="不超过4个字，用于移动端展示"></el-input>
            </el-form-item>
            <el-form-item label="预案文件" :label-width="formLabelWidth" prop="file">
                <el-upload class="upload-demo" :on-change="getFile" action accept=".pdf" file="form.file">
                    <el-button size="medium" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">上传一个文件，只支持pdf</div>
                    <p style="margin:0">{{files||form.file}}</p>
                </el-upload>
            </el-form-item>
            <el-form-item label="联系人" :label-width="formLabelWidth" prop="Contacts">
                <el-button class="lbutton telPhone" @click="EventAdd(planAddressBook)" v-model="ContactsArr">点击选择联系人</el-button>
                <p v-if="showTel" class="telcont">请选择联系人！</p>
            </el-form-item>
            <el-form-item class="formitem">
                <p class="cont-acts" v-for="(item,index) in ContactsArr" :key="index">
                    <span class="cont-span1">{{item.name}}</span>
                    <span class="cont-span2">{{item.phone}}</span>
                    <span class="cont-span3">
                        <input class="cont-button" maxlength="10" auto-complete="off" v-model="postAdd[index]" />
                    </span>
                    <span class="cont-span4">
                        <i class="el-icon-delete" @click="Casedelete(ContactsArr[index])"></i>
                    </span>
                </p>
                <p class="cont-acts" v-for="(item,index) in planAddressBook" :key="'cont'+index">
                    <span class="cont-span1">{{item.addressBooksName}}</span>
                    <span class="cont-span2">{{item.addressBooksPhone}}</span>
                    <span class="cont-span3">
                        <input class="cont-button" maxlength="10" auto-complete="off" v-model="planNameAdd[index]" />
                    </span>
                    <span class="cont-span4">
                        <i class="el-icon-delete" @click="Casedelete2(planAddressBook[index])"></i>
                    </span>
                </p>
            </el-form-item>

            <el-form-item class="formitem">
                <el-button @click="delet">取消</el-button>
                <el-button type="primary" @click="save(ContactsArr)">保存</el-button>
            </el-form-item>
        </el-form>
        <div slot="dialog">
            <plan-administration-add-card ref="PlanAdministrationCard" @messege="messege"></plan-administration-add-card>
        </div>
    </div>
</template>
<script>
import PlanAdministrationAddCard from './PlanAdministrationAddCard'
import { queryDelete } from '@/api/User/User.js'
import { mapGetters } from 'vuex'
import { AdditionalCases, EditorialPlan } from '@/api/Plan/plan.js'
export default {
    name: 'UserAdd',
    data() {
        return {
            formLabelWidth: '100px',
            form: {
                name: null,
                container: null,
                file: null,
                raw: null,
                id: null,
                Contacts: null
            },
            files: '',
            Rules: {
                name: [
                    {
                        required: true,
                        trigger: ['blur', 'commit'],
                        message: '预案名称不可为空！'
                    },
                    {
                        max: 10,
                        trigger: ['blur', 'commit'],
                        message: '预案名称不能超过10个字'
                    }
                ],
                container: [
                    {
                        required: true,
                        trigger: ['blur', 'commit'],
                        message: '预案简称不可为空！'
                    },
                    {
                        max: 4,
                        trigger: ['blur', 'commit'],
                        message: '预案简称不能超过4个字'
                    }
                ],
                file: [
                    {
                        required: true,
                        trigger: ['blur', 'commit'],
                        message: '请上传pdf的文件！'
                    }
                ]
                // Contacts: [
                //     {
                //         required: true,
                //         trigger: ['blur', 'commit'],
                //         message: '请选择联系人！'
                //     }
                // ]
            },
            ContactsArr: [],
            ContactsArr2: [],
            planAddressBook: [],
            planAddressBook2: [],
            planNameAdd: [],
            planName: '',
            role: '',
            company: '',
            post: '',
            postAdd: [],
            planNameStr: '',
            roleStr: '',
            posStr: '',
            pos2Str: '',
            showTel: false
        }
    },
    components: {
        'plan-administration-add-card': PlanAdministrationAddCard
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    mounted() {},
    created() {
        if (this.$route.query.from == 'isEdit') {
            this.parmers()
        }
    },
    methods: {
        // 选择联系人
        EventAdd(row) {
            this.$refs.PlanAdministrationCard.open(row)
        },
        // 传过来的参数
        parmers() {
            this.form.name = this.$route.query.planName
            this.form.container = this.$route.query.planShortName
            this.form.id = this.$route.query.id
            this.form.file = this.$route.query.fileName
            this.planAddressBook = JSON.parse(this.$route.query.planAddressBooks)
            // input自带公司和职位
            this.planAddressBook.forEach(item => {
                this.planName = item.planName
                this.role = item.role
                let planNameAddString = this.planName + ' ' + this.role
                if (planNameAddString.length > 10) {
                    this.planNameAdd.push(planNameAddString.slice(0, 10))
                } else {
                    this.planNameAdd.push(planNameAddString)
                }
            })
        },
        // 上传图片或文件
        getFile(event) {
            this.files = event.name
            this.form.raw = event.raw
            this.form.file = new Date().getTime() + '_' + event.name
        },
        // 删除联系人
        Casedelete(row) {
            for (let i in this.ContactsArr) {
                if (this.ContactsArr[i].id == row.id) {
                    this.ContactsArr.splice(i, 1)
                    this.postAdd.splice(i, 1)
                }
            }
        },
        Casedelete2(row) {
            for (let i in this.planAddressBook) {
                if (this.planAddressBook[i].id == row.id) {
                    this.planAddressBook.splice(i, 1)
                    this.planNameAdd.splice(i, 1)
                }
            }
        },
        // 取消
        delet() {
            this.$router.push({
                path: 'PlanAdministration'
            })
        },
        // 保存
        save(row) {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    if (this.ContactsArr.length == 0 && this.planAddressBook.length == 0) {
                        this.showTel = true
                        return
                    } else {
                        this.showTel = false
                        let arr = []
                        let arr2 = []
                        arr = this.ContactsArr.concat(this.planAddressBook)
                        let inputValArr = this.postAdd.concat(this.planNameAdd)
                        arr.forEach((val, key) => {
                            let valArr = inputValArr[key].split(' ')
                            this.posStr = valArr[0]
                            this.pos2Str = valArr[1]
                            let obj = {
                                projectId: val.projectId,
                                planName: this.posStr ? this.posStr : '',
                                addressBooksId: val.addressBooksId ? val.addressBooksId : val.id,
                                addressBooksName: val.name ? val.name : val.addressBooksName,
                                addressBooksPhone: val.phone ? val.phone : val.addressBooksPhone,
                                role: this.pos2Str ? this.pos2Str : ''
                            }
                            arr2.push(obj)
                        })
                        if (this.$route.query.from == 'isAdd') {
                            //新增的上传文件
                            let url = `/image-service/common/file_upload?systemId=saas&secret=46f869eea8b31d14&key=${this.form.file}`
                            let obj = {
                                name: this.form.file,
                                url: url
                            }
                            let _this = this
                            let reader = new FileReader()
                            reader.readAsArrayBuffer(this.form.raw)
                            reader.onload = function(e) {
                                var xhr = new XMLHttpRequest()
                                xhr.open('POST', url)
                                xhr.send(reader.result)
                                xhr.onreadystatechange = function() {
                                    if (xhr.readyState == 4) {
                                        if (xhr.status == 200) {
                                            _this.$message.success('文件上传成功')
                                            let params = {
                                                postParams: {
                                                    fileName: _this.form.file,
                                                    planName: _this.form.name,
                                                    planShortName: _this.form.container,
                                                    projectId: _this.projectId,
                                                    planAddressBooks: arr2
                                                }
                                            }
                                            AdditionalCases(params).then(res => {
                                                if (res.result == 'success') {
                                                    _this.$message({
                                                        type: 'success',
                                                        message: '操作成功!'
                                                    })
                                                    _this.$router.push({
                                                        path: 'PlanAdministration',
                                                        query: {
                                                            row: row
                                                        }
                                                    })
                                                } else if (res.result == 'fail') {
                                                    _this.$message.error('失败 ' + res.message)
                                                } else {
                                                    _this.$message.error(res.message)
                                                }
                                            })
                                        } else {
                                            _this.$message.error('文件上传失败')
                                        }
                                    }
                                }
                            }
                        } else if (this.$route.query.from == 'isEdit') {
                            let _this = this
                            //编辑
                            if (this.files) {
                                let url = `/image-service/common/file_upload?systemId=saas&secret=46f869eea8b31d14&key=${this.form.file}`
                                let obj = {
                                    name: this.form.file,
                                    url: url
                                }
                                let _this = this
                                let reader = new FileReader()
                                reader.readAsArrayBuffer(this.form.raw)
                                reader.onload = function(e) {
                                    var xhr = new XMLHttpRequest()
                                    xhr.open('POST', url)
                                    xhr.send(reader.result)
                                    xhr.onreadystatechange = function() {
                                        if (xhr.readyState == 4) {
                                            if (xhr.status == 200) {
                                                _this.$message.success('文件上传成功')
                                            } else {
                                                _this.$message.error('文件上传失败')
                                            }
                                        }
                                    }
                                }
                                let params = {
                                    postParams: {
                                        id: Number(_this.form.id),
                                        fileName: _this.form.file ? _this.form.file : _this.files,
                                        planName: _this.form.name,
                                        planShortName: _this.form.container,
                                        projectId: _this.projectId,
                                        planAddressBooks: arr2
                                    }
                                }
                                EditorialPlan(params).then(res => {
                                    if (res.result == 'success') {
                                        _this.$message({
                                            type: 'success',
                                            message: '操作成功!'
                                        })
                                        _this.$router.push({
                                            path: 'PlanAdministration',
                                            query: {
                                                row: row
                                            }
                                        })
                                    } else if (res.result == 'fail') {
                                        _this.$message.error('失败 ' + res.message)
                                    }
                                })
                            } else {
                                let params = {
                                    postParams: {
                                        id: Number(_this.form.id),
                                        fileName: _this.form.file ? _this.form.file : _this.files,
                                        planName: _this.form.name,
                                        planShortName: _this.form.container,
                                        projectId: _this.projectId,
                                        planAddressBooks: arr2
                                    }
                                }
                                EditorialPlan(params).then(res => {
                                    if (res.result == 'success') {
                                        _this.$message({
                                            type: 'success',
                                            message: '操作成功!'
                                        })
                                        _this.$router.push({
                                            path: 'PlanAdministration',
                                            query: {
                                                row: row
                                            }
                                        })
                                    } else if (res.result == 'fail') {
                                        _this.$message.error('失败 ' + res.message)
                                    }
                                })
                            }
                        }
                    }
                }
            })
        },
        messege(data) {
            this.ContactsArr = data

            this.ContactsArr.forEach(item => {
                this.company = item.company ? item.company : ''
                this.post = item.post ? item.post : ''
                let postAddString = this.company + ' ' + this.post
                if (postAddString.length > 10) {
                    this.postAdd.push(postAddString.slice(0, 10))
                } else {
                    this.postAdd.push(postAddString)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.formitem {
    .cont-acts {
        .cont-span1 {
            display: inline-block;
            width: 80px;
        }
        .cont-span2 {
            display: inline-block;
            width: 100px;
        }
        .cont-span3 {
            display: inline-block;
            width: 200px;
            height: 30px;
            margin-right: 20px;
            .cont-button {
                display: inline-block;
                width: 100%;
                height: 100%;
                -webkit-appearance: none;
                background-color: #fff;
                background-image: none;
                border-radius: 4px;
                border: 1px solid #dcdfe6;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                color: #606266;
                display: inline-block;
                font-size: inherit;
                height: 30px;
                line-height: 30px;
                outline: 0;
                padding: 0 15px;
            }
        }
        .cont-span4 {
            display: inline-block;
            width: 20px;
            cursor: pointer;
        }
    }
}
.telcont {
    color: #f56c6c;
    font-size: 12px;
    padding: 0;
    margin: 0;
    height: 12px;
    margin-top: 4px;
    line-height: 12px;
}
.telPhone {
    position: relative;
    ::before {
        position: absolute;
        left: -65px;
        top: 14px;
        content: '*';
        color: #f56c6c;
        font-size: 16px;
    }
}
</style>
<style lang="scss">
.input-form {
    .el-upload__tip {
        margin-top: 0 !important;
    }
    .el-upload {
        width: 100% !important;
        .el-button--medium {
            width: 100% !important;
        }
        .el-button--default {
            width: 100% !important;
        }
    }
    .formitem .el-form-item__content {
        margin-left: 100px !important;
    }
    .lbutton {
        width: 100%;
    }
}
</style>