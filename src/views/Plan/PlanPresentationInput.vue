<template>
    <div class='input-form'>
        <el-form :model='ruleForm' :rules='rules' ref='ruleForm'>
            <el-form-item label='选择考试类型' prop='resource'>
                <el-radio-group v-model='ruleForm.resource'>
                    <el-radio label='1'>笔试</el-radio>
                    <el-radio label='2'>实操考试</el-radio>
                    <el-radio label='3'>应急演练</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label='本次考试日期' required>
                <el-col :span='12'>
                    <el-form-item prop='date1'>
                        <el-date-picker
                            type='date'
                            placeholder='选择日期'
                            v-model='ruleForm.date1'
                            style='width: 100%;'
                            value-format='timestamp'
                            dateType='time'
                            :picker-options='pickerOptions'
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label='下次考试日期' required>
                <el-col :span='12'>
                    <el-form-item prop='date2'>
                        <el-date-picker
                            type='date'
                            placeholder='选择日期'
                            v-model='ruleForm.date2'
                            style='width: 100%;'
                            value-format='timestamp'
                            dateType='time'
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label='参加考试人员' prop='staff'>
                <div v-for='(item,index) in ruleForm.staff' :key='index'>
                    <p>{{item.name}}</p>
                    <div v-for='(staff,ind) in item.projectPersons' :key='ind'>
                        <div class='staff'>
                            <span class='staff-name'>{{staff.name}}</span>
                            <el-radio-group v-model='staff.state' @change='staffChange(staff)'>
                                <el-radio border size='mini' label='3'>未参加考试</el-radio>
                                <el-radio border size='mini' label='1'>考试通过</el-radio>
                                <el-radio border size='mini' label='2'>考试不通过</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item style='float:right'>
                <el-button @click='resetForm'>取消</el-button>
                <el-button type='primary' @click='submitForm("ruleForm")'>提交成绩</el-button>
            </el-form-item>
        </el-form>
        <plan-project-leader ref='PlanProjectLeader' v-if='planId' :planId='planId' :type='type'></plan-project-leader>
    </div>
</template>
<script>
import PlanProjectLeader from './PlanProjectLeader'
import { EditPresenSave, personList } from '@/api/Plan/plan.js'
import { mapGetters } from 'vuex'
var moment = require('moment')
import 'moment/locale/zh-cn'
export default {
    name: 'PlanpresentationInput',
    data() {
        return {
            pickerOptions: {
                disabledDate: time => {
                    return this.dealDisabledDate(time)
                }
            },
            planId: '',
            ruleForm: {
                date1: '',
                date2: '',
                resource: '1',
                staff: []
            },
            type: '',
            rules: {
                staff: [
                    {
                        required: true,
                        message: '请输入活动名称',
                        trigger: 'blur'
                    }
                ],
                date1: [
                    {
                        type: 'date',
                        required: true,
                        message: '请选择日期',
                        trigger: 'change'
                    }
                ],
                date2: [
                    {
                        type: 'date',
                        required: true,
                        message: '请选择时间',
                        trigger: 'change'
                    }
                ],
                resource: [
                    {
                        required: true,
                        message: '请选择活动资源',
                        trigger: 'change'
                    }
                ]
            },
            staffChangeArr: []
        }
    },
    components: { PlanProjectLeader },
    computed: {
        ...mapGetters(['projectId'])
    },
    mounted() {
        this.planId = this.$route.query.id
        this.getPersonList()
    },
    methods: {
        dealDisabledDate(time) {
            return time.getTime() > Date.now()
        },
        getPersonList() {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId
                    }
                }
            }
            personList(params).then(res => {
                if (res.content) {
                    for (let i of res.content) {
                        for (let j of i.projectPersons) {
                            j.state = '3'
                        }
                    }
                }

                this.ruleForm.staff = res.content
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.ruleForm.resource == '1') {
                        this.type = 0
                        //笔试的接口
                        let arr = []
                        let obj = {}
                        this.staffChangeArr.forEach(el => {
                            obj = {
                                writtenExamTime: this.ruleForm.date1,
                                writtenNextTime: this.ruleForm.date2,
                                planId: Number(this.planId),
                                writtenState: Number(el.state),
                                personId: el.personId
                            }
                            arr.push(obj)
                        })
                        let params = {
                            postParams: arr
                        }
                        if (arr.length > 0) {
                            EditPresenSave(params).then(this.saveResult)
                        } else {
                            this.$message.error('未选择参加考试人员')
                        }
                    } else if (this.ruleForm.resource == '2') {
                        this.type = 1
                        //实操考试
                        let arr = []
                        let obj = {}
                        this.staffChangeArr.forEach(el => {
                            obj = {
                                operationExamTime: this.ruleForm.date1,
                                operationNextTime: this.ruleForm.date2,
                                planId: Number(this.planId),
                                operationState: Number(el.state),
                                personId: el.personId
                            }
                            arr.push(obj)
                        })
                        let params = {
                            postParams: arr
                        }
                        if (arr.length > 0) {
                            EditPresenSave(params).then(this.saveResult)
                        } else {
                            this.$message.error('未选择参加考试人员')
                        }
                    } else if (this.ruleForm.resource == '3') {
                        this.type = 2
                        let arr = []
                        let obj = {}
                        this.staffChangeArr.forEach(el => {
                            obj = {
                                emergencyExamTime: this.ruleForm.date1,
                                emergencyNextTime: this.ruleForm.date2,
                                planId: Number(this.planId),
                                emergencyState: Number(el.state),
                                personId: el.personId
                            }
                            arr.push(obj)
                        })
                        let params = {
                            postParams: arr
                        }
                        //应急演练
                        if (arr.length > 0) {
                            EditPresenSave(params).then(this.saveResult)
                        } else {
                            this.$message.error('未选择参加考试人员')
                        }
                    }
                } else {
                    return false
                }

                // this.$router.push({
                //     path: 'PlanPresentation',
                //     query: { planId: this.planId }
                // })
            })
        },
        saveResult(resp) {
            if (resp.result == 'success') {
                this.$refs.PlanProjectLeader.open()
            } else {
                this.$message.error('录入考试成绩失败')
            }
        },
        resetForm(formName) {
            this.$router.push('PlanPresentation')
        },
        staffChange(row) {
            this.staffChangeArr.push(row)
        }
    }
}
</script>
<style lang='scss' scoped>
.input-form {
    p {
        width: 450px;
        border-bottom: 1px solid #ccc;
        padding-left: 20px;
        color: #ccc;
    }
    .staff {
        width: 450px;
        padding-left: 20px;
        border-bottom: 1px solid #ccc;
        .staff-name {
            display: inline-block;
            width: 70px;
            // margin-right: 40px;
        }
    }
}
.page-content {
    overflow: scroll;
}
</style>
<style  lang='scss'>
.input-form {
    .staff {
        .el-radio {
            margin: 0;
        }
    }
}
</style>
