<template>
    <div class='planProject'>
        <el-dialog title='请选择要通知的项目负责人' :visible.sync='dialogFormVisible' @close='close'>
            <el-checkbox-group v-model='checkedCities' @change='handleCheckedCitiesChange'>
                <el-checkbox v-for='(item,index) in personerArr' :label='item.id' :key='index'>{{item.realname}}</el-checkbox>
            </el-checkbox-group>
            <div slot='footer' class='dialog-footer'>
                <el-button size='small' @click='noticeNo'>不通知，只更新成绩</el-button>
                <el-button type='primary' size='small' :disabled='checkedCities.length==0' @click='noticeYes'>更新成绩并通知所选负责人</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { queryPerson, sendPerson } from '@/api/Plan/plan.js'
export default {
    name: 'UserEdit',
    data() {
        return {
            personerArr: [],
            dialogFormVisible: false,
            checkedCities: []
        }
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    props: ['planId', 'type'],
    methods: {
        close() {
            this.dialogFormVisible = false
        },
        open() {
            this.dialogFormVisible = true
        },
        handleCheckedCitiesChange(value) {
            this.checkedCities = value
        },
        query() {
            let params = {
                getParams: {
                    criteria: {
                        projectId: this.projectId
                    }
                }
            }
            queryPerson(params).then(res => {
                this.personerArr = res.content ? res.content : []
            })
        },
        noticeNo() {
            this.dialogFormVisible = false
            this.$message.success('更新成绩成功')
            this.$router.push({
                path: 'PlanPresentation',
                query: { planId: this.planId }
            })
        },
        noticeYes() {
            this.dialogFormVisible = false
            let params = {
                postParams: {
                    projectId: this.projectId,
                    id: Number(this.planId),
                    type: this.type,
                    userArray: this.checkedCities
                }
            }
            sendPerson(params).then(res => {
                if (res.result == 'success') {
                    this.$message.success('更新成绩并通知负责人成功')
                    this.$router.push({
                        path: 'PlanPresentation',
                        query: { planId: this.planId }
                    })
                } else {
                    this.$message.error('操作失败')
                }
            })
        }
    },
    mounted() {
        this.query()
    }
}
</script>
<style lang="scss">
.planProject {
    .el-checkbox-group {
        width: 80%;
        margin: 0 auto;
    }
    .el-checkbox {
        margin-bottom: 20px;
        display: block;
    }
    .el-checkbox__inner {
        width: 20px;
        height: 20px;
        line-height: 20px;
        border-radius: 90px;
    }
    ::after {
        position: absolute;
        top: 4px;
        left: 7px;
    }
}
</style>
