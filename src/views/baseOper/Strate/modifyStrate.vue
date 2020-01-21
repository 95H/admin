<template>
    <div class='modifyStrate'>
        <div class='mod-header'>(1/3) 请选择从哪个维度调整运行策略？</div>
        <el-form>
            <el-form-item label>
                <el-radio-group v-model='resource'>
                    <el-radio label='1'>选择一个或多个运行单元进行设置</el-radio>
                    <p style='height:20px;'></p>
                    <el-radio label='2'>选择某个计划组进行设置</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <el-table v-if='resource==2' :data='tableData' stripe slot='table' height='200' width='100%' border>
            <el-table-column width='55' label>
                <template slot-scope='scope'>
                    <el-radio :label='scope.row.id' v-model='templateRadio' @change.native='getTemplateRow(scope.row)'>&nbsp;</el-radio>
                </template>
            </el-table-column>
            <el-table-column prop='name' label='已有计划组'></el-table-column>
        </el-table>
        <div style='margin-top:20px;' v-if='resource==2'>
            <el-button type='text' v-if='resource==1 || templateRadio' @click='dialogVisible = true'>编辑所选计划组</el-button>
             <el-button type='text' disabled v-else>编辑所选计划组</el-button>
        </div>
        <el-dialog title='编辑维护计划组' :visible.sync='dialogVisible' width='500px'>
            <el-form>
                <el-form-item label='计划组名称：'>
                    <el-input v-model='names' style='width:300px;'></el-input>
                </el-form-item>
            </el-form>
            <span slot='footer' class='dialog-footer'>
                <el-button type='primary' style='float:left' @click='del'>删除计划组</el-button>
                <el-button @click='dialogVisible = false'>取 消</el-button>
                <el-button type='primary' @click='saveEdit'>保存</el-button>
            </span>
        </el-dialog>
        <div class='mod-footer'>
            <el-button @click='backSet'>放弃本次设置</el-button>
            <el-button type='primary' v-if='resource==1 || templateRadio' @click='nextShow'>下一步</el-button>
            <el-button type='primary' disabled v-else>下一步</el-button>
        </div>
    </div>
</template>

<script>
import { queryGroup, saveGroup,updateGroup,delGroup} from "@/api/Strategy/strate.js";
import { mapGetters } from "vuex";
export default {
    data() {
        return {
            templateRadio: '',
            resource: '',
            names: '',
            tableData:[],
            dialogVisible: false,
            multipleSelection: {},
            data:[]
        }
    },
    methods: {
        query(){
            let params = {
                postParams:{
                    criteria:{
                        projectId:this.projectId,
                    }
                }
            }
            queryGroup(params).then(res=>{
                this.tableData = res.data.content
            })
        },
        backSet() {
            this.$router.push('/baseOper/Strate/index')
            localStorage.removeItem('sysArr')
            localStorage.removeItem('equipmentArr')
        },
        nextShow() {
            if(this.resource==1){
                 this.$router.push({path:"/baseOper/Strate/nextStrate",query:{resource:this.resource}})
            }else{
                 this.$router.push({path:"/baseOper/Strate/nextStrate",query:{resource:this.resource,name:this.multipleSelection.name,id:this.templateRadio}})
            }
        },
        getTemplateRow(row) {
            console.log(row)
            this.multipleSelection = row
            this.templateRadio = this.multipleSelection.id
            this.names = this.multipleSelection.name
        },
        saveEdit(){
            this.dialogVisible = false;
            let objectList = []
            this.multipleSelection.objectList.forEach(el=>{
                objectList.push({
                    objectId:el.objectId
                })
            })
            let params = {
                postParams:{            
                    projectId:this.projectId,
                    name:this.names,
                    id:this.multipleSelection.id,
                    objectList:objectList         
                }
            }
            updateGroup(params).then(res=>{
                if(res.data.result=='success'){
                    this.$message.success("修改成功！")
                    this.query()
                }
            })
        },
        del(){
            this.dialogVisible = false;
            let params = {
                postParams:{
                     id:this.multipleSelection.id,
                }
            }
            delGroup(params).then(res=>{
                if(res.data.result=='success'){
                     this.$message.success("删除成功！")
                      this.query()
                }
            })
        }
    },
    computed: {
        ...mapGetters(["projectId"])
    },
    mounted(){
        if(this.$route.query.planId){
            this.resource = '2'
            this.templateRadio = Number(this.$route.query.planId)
            this.multipleSelection.id = Number(this.$route.query.planId)
            this.names = this.$route.query.names
        }else{
            this.resource = '1'
        }
    },
    created(){
         this.query()
    }
}
</script>

<style lang="scss" scoped>
.modifyStrate {
    margin: 0 auto;
    .mod-header {
        font-size: 32px;
        margin-bottom: 40px;
    }
    .mod-footer {
        margin-top: 80px;
        display: flex;
        justify-content: space-between;
    }
}
</style>
<style lang="scss" >
.el-table__header-wrapper .el-table__header thead tr th {
    background-color: #d9d9d9 !important;
    color: #000;
}
</style>