<template>
    <el-dialog class="edit-month" :title="title" :visible.sync="dialogFormVisible" @close="close('form')">
      <el-form ref="form" :model="formValue" :rules="newFileRules">
        <el-form-item label="对应年月" :label-width="formLabelWidth" prop="month">
             <el-date-picker
                v-model="formValue.month"
                type="month"
                value-format="timestamp"
                placeholder="选择日期"
                @change="isReport"
                >
            </el-date-picker>
        </el-form-item>
        <div class="pad"><span v-if="msg">请选择对应年月的月报文件</span><span class="danger" v-else>已存在月报文件，上传后，月报文件被覆盖！</span></div>
        <el-form-item label="月报文件" :label-width="formLabelWidth" prop="file">
          <el-upload class="upload-demo" :on-change="getFile" action accept=".pdf" file="formValue.file">
            <el-button size="medium" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">上传一个文件，只支持pdf</div>
            <p>{{files}}</p>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!msg" type="text" style="float:left;margin-left:20px;" @click="del()">删除月报 <i class="el-icon-delete"></i></el-button>
        <el-button @click="close('form')">取消</el-button>
        <el-button type="primary" @click="save()">保存</el-button>
      </div>
    </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import {queryMonthReport,saveMonthReport,deleteMonthReport} from '@/api/Month/month.js'
import {deleteFile } from '@/api/Plan/plan.js'
var moment = require('moment')
import 'moment/locale/zh-cn'
export default {
    name: "PlanMasterAdd",
    data() {
        return {
            title: "月报管理",
            dialogFormVisible: false,
            formLabelWidth: "100px",
            roles: null,
            formValue: {
                month: new Date(),
                file: null
            },
            loading: false,
            fileName: "",
            files: "",
            newFileRules: {
                month: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                file: [
                    {
                        required: true,
                        trigger: ["blur", "commit"],
                        message: "请上传pdf的文件"
                    }
                ]
            },
            msg:''
        };
    },
    computed: {
        ...mapGetters(["projectId"])
    },
    methods: {
        formatTime(date){
            return moment.unix(date / 1000).format('YYYYMM')
        },
        open(data) {
            this.dialogFormVisible = true;
        },
        save() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let url = `/image-service/common/file_upload?systemId=saas&secret=46f869eea8b31d14&key=${
                        this.fileName
                    }`;
                     let get_url = `/image-service/common/file_get?systemId=saas&secret=46f869eea8b31d14&key=${
                        this.fileName
                    }`;
                    let obj = {
                        fileName: this.fileName,
                        url: url
                    };
                    let _this = this;
                    let reader = new FileReader();
                    reader.readAsArrayBuffer(this.formValue.file);
                    reader.onload = function(e) {
                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", url);
                        xhr.send(reader.result);
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState == 4) {
                                if (xhr.status == 200) {
                                    _this.$message.success("文件上传成功");
                                    let params = {
                                        postParams: {
                                            month: _this.formatTime(_this.formValue.month),
                                            projectId: _this.projectId,
                                            url:get_url
                                        }
                                    };
                                    if(_this.msg){
                                        params.postParams.createUser = _this.$store.state.layout.userInfo.userId
                                    }else{
                                        params.postParams.updateUser = _this.$store.state.layout.userInfo.userId
                                    }
                                    saveMonthReport(params).then(
                                        resp => {
                                            if (resp.result == "success") {
                                                _this.$message.success(
                                                    _this.title + "成功"
                                                );
                                                _this.dialogFormVisible = false;
                                                _this.$emit("confirm",_this.formatTime(_this.formValue.month));
                                            } else if (resp.result == "fail") {
                                                _this.$message.error(
                                                    _this.title +
                                                        "失败 " +
                                                        resp.message
                                                );
                                            } else {
                                                _this.$message.error(
                                                    resp.message
                                                );
                                            }
                                        }
                                    );
                                } else {
                                    _this.$message.error("文件上传失败");
                                    return;
                                }
                            }
                        };
                    };
                }
            });
        },
        // 上传图片或文件
        getFile(event) {
            this.files = event.name;
            this.fileName = new Date().getTime() + "_" + event.name;
            this.formValue.file = event.raw;
        },
        close(form) {
            this.$refs[form].resetFields();
            this.dialogFormVisible = false;
            this.$emit("cancel");
        },
        isReport(date){
            let params = {
                postParams:{
                    criteria:{
                        projectId:this.projectId,
                        month:this.formatTime(this.formValue.month)
                    }
                }
            }
            queryMonthReport(params).then(res=>{
                if(res.result=='success'){
                   if(res.count>0){
                       this.msg = false
                   }else{
                       this.msg = true
                   }
                }
            })
        },
        del(){
            let fileParams = {
                postParams: {
                    keys: [this.fileName]
                }
            }
            deleteFile(fileParams).then(res => {
               
            })
            let params = {
                postParams:{
                    projectId:this.projectId,
                    month:this.formatTime(this.formValue.month)
                }
            }
            deleteMonthReport(params).then(res=>{
                if(res.result=='success'){
                    this.$message({
                        type: 'success',
                        message: '删除月报成功!'
                    })
                    this.$emit("confirm");
                    this.dialogFormVisible = false;
                }

            })
        }
    },
    mounted() {
        this.isReport()
    }
};
</script>
<style lang="scss" scoped>
.edit-month{
    .pad{
        margin-left:100px;
        margin-bottom:20px;
    }
    .danger{
        color: red;
    }
    .el-upload {
        width: 100% !important;
        .el-button--medium {
            width: 100% !important;
        }
    }
    .el-form-item__content{
        line-height: 0;
    }
}
</style>
<style lang="scss">

   .edit-month .el-dialog {
        width: 500px;
        .el-dialog__header{
            text-align: center;
        }
        .el-form {
            margin-right: 35px;
        }
    }
</style>