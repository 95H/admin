<template>
    <el-dialog title="编辑人员" :visible.sync="dialogFormVisible" @close="close">
        <el-form :model="form" :rules="newUserRules" ref="loginForm">
            <el-form-item label="人员姓名" :label-width="formLabelWidth" prop="name">
                <el-input v-model="form.name" auto-complete="off" placeholder="姓名不超过5个字"></el-input>
            </el-form-item>
            <el-form-item label="电话号码" :label-width="formLabelWidth" prop="phone">
                <el-input v-model="form.phone" auto-complete="off" placeholder="请输入格式正确的电话号码"></el-input>
            </el-form-item>
            <el-form-item label="公司" :label-width="formLabelWidth" prop="company">
                <el-input v-model="form.company" auto-complete="off" placeholder="公司不超过20个字"></el-input>
            </el-form-item>
            <el-form-item label="岗位" :label-width="formLabelWidth" prop="post">
                <el-input v-model="form.post" auto-complete="off" placeholder="岗位不超过10个字"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" size="small">取消</el-button>
            <el-button type="primary" @click="save" size="small">保存</el-button>
        </div>
    </el-dialog>
</template>
<script>
import userapi from "@/api/system/user";
import roleapi from "@/api/system/role";
import { queryEdit } from "@/api/User/User.js";
import { mapGetters } from "vuex";
export default {
    name: "UserEdit",
    data() {
        return {
            dialogFormVisible: false,
            formLabelWidth: "120px",
            roles: null,
            title: null,
            form: {
                id: null,
                name: null,
                phone: null,
                company: null,
                post: null,
                isUsed: null
            },
            newUserRules: {
                name: [
                    {
                        required: true,
                        trigger: ["blur", "commit"],
                        message: "请输入姓名"
                    },
                    {
                        max: 5,
                        trigger: ["blur", "commit"],
                        message: "姓名不能超过5个字"
                    }
                ],
                phone: [
                    {
                        required: true,
                        trigger: ["blur", "commit"],
                        message: "请输入电话号码"
                    },
                    {
                        validator: this.checkPhone,
                        trigger: ["blur", "commit"]
                    }
                ],
                company: [
                    {
                        max: 20,
                        trigger: ["blur", "commit"],
                        message: "公司不能超过10个字"
                    }
                ],
                post: [
                    {
                        max: 10,
                        trigger: ["blur", "commit"],
                        message: "岗位不能超过10个字"
                    }
                ]
            }
        };
    },
    computed: {
        ...mapGetters(["projectId"])
    },
    methods: {
        checkPhone(rule, value, callback) {
            const reg = /^1[3456789]\d{9}$/;
            // console.log(reg.test(value));
            if (reg.test(value)) {
                callback();
            } else {
                return callback(new Error("请输入正确的电话号码"));
            }
        },
        async open(data) {
            let vm = this;
            vm.dialogFormVisible = true;
            // console.log(data);
            vm.form.id = data.id;
            vm.form.name = data.name;
            vm.form.post = data.post;
            vm.form.company = data.company;
            vm.form.phone = data.phone;
            vm.form.isUsed = data.isUsed;
        },
        save() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    let param = {
                        postParams: {
                            id: this.form.id,
                            name: this.form.name,
                            post: this.form.post,
                            company: this.form.company,
                            phone: this.form.phone,
                            projectId: this.projectId,
                            isUsed: this.form.isUsed
                        }
                    };
                    queryEdit(param).then(this.saveResult);
                }
            });
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
        close() {
            let vm = this;
            vm.dialogFormVisible = false;
            if (vm.form.id) {
                vm.form.id = null;
                vm.form.name = null;
                vm.form.phone = null;
                vm.form.company = null;
                vm.form.post = null;
            }
            vm.$emit("cancel");
        }
    }
};
</script>
 