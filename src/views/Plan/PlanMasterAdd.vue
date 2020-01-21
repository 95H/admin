<template>
  <div class="planmater">
    <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="close('form')">
      <el-form ref="form" :model="formValue" :rules="newFileRules">
        <el-form-item label="报告名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model.trim="formValue.name" auto-complete="off" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="报告文件" :label-width="formLabelWidth" prop="file">
          <el-upload class="upload-demo" :on-change="getFile" action accept=".pdf" file="formValue.file">
            <el-button size="medium" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">上传一个文件，只支持pdf</div>
            <p>{{files}}</p>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close('form')">取消</el-button>
        <el-button type="primary" @click="save()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { AdditionalIncidentReport } from "@/api/Plan/plan.js";
export default {
    name: "PlanMasterAdd",
    data() {
        return {
            title: "新增报告",
            dialogFormVisible: false,
            formLabelWidth: "100px",
            roles: null,
            formValue: {
                name: null,
                file: null
            },
            loading: false,
            fileName: "",
            files: "",
            newFileRules: {
                name: [
                    {
                        required: true,
                        trigger: ["blur", "commit"],
                        message: "请输入文件报告名"
                    }
                ],
                file: [
                    {
                        required: true,
                        trigger: ["blur", "commit"],
                        message: "请上传pdf的文件"
                    }
                ]
            }
        };
    },
    computed: {
        ...mapGetters(["projectId"])
    },
    methods: {
        open(data) {
            this.dialogFormVisible = true;
        },
        save() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let url = `/image-service/common/file_upload?systemId=saas&secret=46f869eea8b31d14&key=${
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
                                            fileName: _this.fileName,
                                            presentationName:
                                                _this.formValue.name,
                                            projectId: _this.projectId
                                        }
                                    };
                                    AdditionalIncidentReport(params).then(
                                        resp => {
                                            if (resp.result == "success") {
                                                _this.$message.success(
                                                    _this.title + "成功"
                                                );
                                                _this.dialogFormVisible = false;
                                                _this.$emit("confirm");
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
        }
    },
    created() {}
};
</script>
<style lang="scss">
.el-dialog {
    width: 35%;
    .el-form {
        margin-right: 35px;
    }
}
.planmater {
    .el-upload {
        width: 100% !important;
        .el-button--medium {
            width: 100% !important;
        }
    }
}
</style>