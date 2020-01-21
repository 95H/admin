<template>
    <el-dialog :title='title' :visible.sync='visible' width='60%' slot='dialog'>
        <el-card class='input-form-panel'>
            <el-form ref='form' :model='form' label-width='120px'>
                <el-form-item label='工作历名称' prop='name'>
                    <el-input v-model='form.name'></el-input>
                </el-form-item>
                <el-form-item label prop='file'>
                    <el-upload :show-file-list='false' :before-upload='beforeUpload' action :http-request='uploadFile' accept='.xlsx'>
                        <el-button size='small' type='primary'>上传xlsx</el-button>
                        <div slot='tip' class='el-upload__tip'>只能上传xlsx文件</div>
                    </el-upload>
                </el-form-item>
                <el-form-item align='right'>
                    <el-button type='primary' @click='save' size='small'>保存</el-button>
                    <el-button @click='visible = false' size='small'>取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { uploadCalendar} from "@/api/Strategy/strate.js";
export default {
    name: 'demo-dialog',
    props: [],
    components: {},
    data() {
        return {
            visible: false,
            title: '导入工作历',
            form: {
                name: null
            },
            fileObj: null,
            formobj: null,
            diologNum: null
        }
    },
    computed: {
   
    },
    methods: {
        beforeUpload(file) {
            const isText = file.type === 'application/vnd.ms-excel'
            const isTextComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            return isText | isTextComputer
        },
        uploadFile(item) {
            console.log(item)
            this.form.name = item.file.name
            this.fileObj = item.file
            this.formobj = new FormData()
            this.formobj.append('file', this.fileObj)
            console.log(this.formobj)
        },
        open(data) {
            this.diologNum = data
            if (data) {
                this.form.name = data.name
            } else {
                this.form.name = null
            }
            this.visible = true
        },
        save() {
            let vm = this
            this.$refs.form.validate(valid => {
                if (valid) {  
                        let param = {
                            projectId: vm.$store.state.projectId,
                            name: vm.form.name
                        }
                        uploadCalendar(param,vm.formobj).then(resp => {
                            if (resp.data.result == 'success') {
                                vm.$message.success(vm.title + '成功')
                                 vm.visible = false
                                vm.$emit('commit',vm.form.name)
                            } else if (resp.data.result == 'fail') {
                                vm.$message.error(vm.title + '失败' + resp.data.message)
                                vm.visible = false
                            }
                        })
                }
            })
        }
    }
}
</script>