<template>
    <div class='dialog'>
        <el-dialog
            title='图片上传详情'
            v-if='dialogFormVisible'
            :visible.sync='dialogFormVisible'
            @close='close'
            width='1080px'
            :close-on-click-modal='false'
        >
            <el-table :data='picStatus' height='550' v-loading='loading'>
                <el-table-column label='序号' width='50' type='index'>
                    <template slot-scope='scope'>
                        <div :class='scope.row.overdueState==0?"red":""'>{{scope.$index+1}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop='name' label='编号'></el-table-column>
                <el-table-column prop='code' label='名称'></el-table-column>
                <el-table-column prop='fileName' label='文件名' width='500'></el-table-column>
                <el-table-column prop='status' label='状态' width='70'>
                    <template slot-scope='{row}'>
                        <div v-if='row.status==0' style='color:red'>失败</div>
                        <div v-if='row.status==1'>成功</div>
                    </template>
                </el-table-column>
            </el-table>
            <div slot='footer' class='dialog-footer'>
                <el-button @click='close' size='small'>关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            dialogFormVisible: false,
            picStatus: [],
            loading: true
        }
    },
    methods: {
        open(row) {
            this.loading = true
            this.picStatus = []
            this.dialogFormVisible = true
            if (row) {
                this.picStatus = row
                this.loading = false
            }
        },
        close() {
            this.picStatus = []
            this.dialogFormVisible = false
        }
    }
}
</script>

 