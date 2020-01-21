<template>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="close('form')" width="50">
        <el-form :model="form" :rules="newUserRules" ref="form">
            <el-form-item label="人员姓名" :label-width="formLabelWidth" prop="name">
                <el-input v-model="form.name" auto-complete="off" placeholder="姓名不超过5个字"></el-input>
            </el-form-item>
            <el-form-item label="电话号码" :label-width="formLabelWidth" prop="phone">
                <el-input v-model="form.phone" auto-complete="off" placeholder="请输入格式正确的电话号码" maxlength='11'></el-input>
            </el-form-item>
            <el-form-item label="公司" :label-width="formLabelWidth" prop="company">
                <el-input v-model="form.company" auto-complete="off" placeholder="公司不超过20个字"></el-input>
            </el-form-item>
            <el-form-item label="岗位" :label-width="formLabelWidth" prop="post">
                <el-input v-model="form.post" auto-complete="off" placeholder="岗位不超过10个字"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close('form')">取消</el-button>
            <el-button type="primary" @click="save()">保存</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { queryAdd } from "@/api/User/User.js";
import { mapGetters } from "vuex";
export default {
    name: "UserAdd",
    data() {
        return {
            title: "新增人员",
            dialogFormVisible: false,
            formLabelWidth: "120px",
            roles: null,
            form: { name: null, phone: null, company: null, post: null },
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
                        message: "公司不能超过20个字"
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
        open(user) {
            this.dialogFormVisible = true;
        },
        checkPhone(rule, value, callback) {
            const reg = /^1[3456789]\d{9}$/;
            // console.log(reg.test(value));
            if (reg.test(value)) {
                callback();
            } else {
                return callback(new Error("请输入正确的电话号码"));
            }
        },
        save() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let user = {
                        postParams: {
                            name: this.form.name,
                            phone: this.form.phone,
                            company: this.form.company,
                            post: this.form.post,
                            projectId: this.projectId
                        }
                    };
                    queryAdd(user).then(resp => {
                        if (resp.result == "success") {
                            this.$message.success(this.title + "成功");
                            this.dialogFormVisible = false;
                            this.$emit("confirm");
                        } else if (resp.result == "fail") {
                            this.$message.error(
                                this.title + "失败 " + resp.message
                            );
                        } else {
                            this.$message.error(resp.message);
                        }
                    });
                }
            });
        },
        close(form) {
            this.$refs[form].resetFields();
            this.dialogFormVisible = false;
        }
    }
};
</script>