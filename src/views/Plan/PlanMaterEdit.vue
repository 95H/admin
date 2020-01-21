<template>
  <div class="planmater">
    <el-dialog title="编辑报告" :visible.sync="dialogFormVisible" @close="close">
      <el-form ref="form" :model="formValue" :rules="newFileRules">
        <el-form-item label="报告名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model.trim="formValue.name" auto-complete="off" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="报告文件" :label-width="formLabelWidth" prop="file">
          <el-upload
            class="upload-demo"
            :on-change="getFile"
            accept=".pdf"
            action
            file="formValue.file"
          >
            <el-button size="medium" type="primary">点击上传</el-button>
            <p>{{files || this.formValue.file}}</p>
            <div slot="tip" class="el-upload__tip">上传一个文件，只支持pdf</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close" size="small">取消</el-button>
        <el-button type="primary" @click="save" size="small">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { EditingEventReport } from "@/api/Plan/plan.js";
import { mapGetters } from "vuex";
export default {
  name: "UserEdit",
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: "120px",
      formValue: {
        name: null,
        file: null,
        id: null
      },
      files: "",
      fileName: "",
      newFileRules: {
        name: [
          {
            required: true,
            trigger: ["blur", "commit"],
            message: "请输入报告名"
          },
          {
            min: 0,
            max: 20,
            message: "不能超过20个字段",
            trigger: "blur"
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
    async open(data) {
      let vm = this;
      vm.dialogFormVisible = true;
      vm.formValue.name = data.presentationName;
      vm.formValue.id = data.id;
      vm.formValue.file = data.fileName;
      this.files = ''
    },
    save() {
      let vm = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          if (vm.files) {
            //重新上传文件
            let url = `/image-service/common/file_upload?systemId=saas&secret=46f869eea8b31d14&key=${vm.fileName}`;
            let obj = {
              fileName: vm.fileName,
              url: url
            };
            let reader = new FileReader();
            reader.readAsArrayBuffer(vm.formValue.file);
            reader.onload = function(e) {
              var xhr = new XMLHttpRequest();
              xhr.open("POST", url);
              xhr.send(reader.result);
              xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                  if (xhr.status == 200) {
                    vm.$message.success("文件上传成功");
                    vm.saveFunc();
                  } else {
                    vm.$message.error("文件上传失败");
                  }
                }
              };
            };
          } else {
            vm.saveFunc();
          }
        }
      });
    },
    saveFunc() {
      let param = {};
      if (this.fileName) {
        param = {
          postParams: {
            id: this.formValue.id,
            fileName: this.fileName,
            presentationName: this.formValue.name,
            projectId: this.projectId
          }
        };
      } else {
        param = {
          postParams: {
            id: this.formValue.id,
            fileName: this.formValue.file,
            presentationName: this.formValue.name,
            projectId: this.projectId
          }
        };
      }
      EditingEventReport(param).then(this.saveResult);
    },
    saveResult(resp) {
      if (resp.result == "success") {
        this.$message.success("编辑用户成功");
        this.dialogFormVisible = false;
        this.$emit("confirm");
      } else {
        this.$message.error("编辑用户失败");
      }
    },
    // 上传图片或文件
    getFile(event) {
      this.files = event.name;
      this.fileName = new Date().getTime() + "_" + event.name;
      this.formValue.file = event.raw;
    },
    close() {
      let vm = this;
      vm.dialogFormVisible = false;
      if (vm.formValue.id) {
        vm.formValue.id = null;
        vm.formValue.name = null;
        vm.formValue.file = null;
      }
      vm.$emit("cancel");
    }
  }
};
</script>
<style lang="scss">
.planmater {
  .el-upload {
    width: 100% !important;
    .el-button--medium {
      width: 100% !important;
    }
  }
}
</style>