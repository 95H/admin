<template>
    <div :style='contentStyleObj'>
        <div class='query-form'>
            <el-form :inline='true' slot='form' size='mini' v-if='hasPermission("manage:presentation:save")'>
                <el-form-item>
                    <el-button type='primary' @click='EventAdd(null)'>新增报告</el-button>
                </el-form-item>
            </el-form>
        </div>
        <page-table :total='pageData.total' :page='pageData.page' :size='pageData.size' @pageChanged='pageChanged'>
            <el-table :data='pageData.tableData' border stripe slot='table'>
                <el-table-column prop='presentationName' label='应急报告名称'></el-table-column>
                <el-table-column label='上传时间' width='180' align='center'>
                    <template slot-scope='{row}'>{{formatDate(row.updateTime)}}</template>
                </el-table-column>
                <el-table-column label='操作' width='180' align='center'>
                    <template slot-scope='{row}'>
                        <a
                            v-if='hasPermission("manage:presentation:save")'
                            class='down'
                            :href='`/image-service/common/file_get?systemId=saas&secret=46f869eea8b31d14&key=${row.fileName}`'
                            :download='`${row.fileName}`'
                        >
                            <opt-button text='下载' />
                        </a>

                        <a
                            v-else
                            class='down'
                            :href='`/image-service/common/file_get?systemId=saas&secret=46f869eea8b31d14&key=${row.fileName}`'
                            :download='`${row.fileName}`'
                        >
                            <opt-button disabled text='下载' />
                        </a>

                        <opt-separator />
                        <opt-button v-if='hasPermission("manage:presentation:update")' text='编辑' @click='EventEdit(row)' />
                        <opt-button v-else disabled text='编辑' />
                        <opt-separator />
                        <opt-button v-if='hasPermission("manage:presentation:delete")' text='删除' @click='Eventdelete(row)' type='danger' />
                        <opt-button v-else disabled text='删除' type='danger' />
                    </template>
                </el-table-column>
            </el-table>
        </page-table>
        <div slot='dialog'>
            <planMaster-add ref='PlanMasterAdd' @confirm='EventMeet'></planMaster-add>
            <planMaster-Edit ref='PlanMasterEdit' @confirm='EventMeet'></planMaster-Edit>
        </div>
    </div>
</template>
<script>
import PlanMasterAdd from './PlanMasterAdd'
import PlanMasterEdit from './PlanMaterEdit'
import { mapGetters } from 'vuex'
import { QueryEventReport, DeleteEventReport, deleteFile } from '@/api/Plan/plan.js'
var moment = require('moment')
import 'moment/locale/zh-cn'

export default {
    data() {
        return {
            contentStyleObj: {
                width: ''
            },
            updateTime: '',
            pageData: {
                page: 1,
                size: 10,
                total: 0,
                tableData: []
            }
        }
    },
    components: {
        PlanMasterAdd,
        PlanMasterEdit
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    mounted() {
        this.query()
        this.getWight()
        window.addEventListener('resize', this.getWight)
    },
    methods: {
        getWight() {
            this.contentStyleObj.width =
                document.body.clientWidth > 1000 ? document.body.clientWidth - 255 + 'px' : document.body.clientWidth - 75 + 'px'
        },
        query() {
            this.pageData.page = 1
            this.EventMeet()
        },
        pageChanged(page, size) {
            this.pageData.page = page
            this.pageData.size = size
            this.EventMeet(page, size)
        },
        // 查询事件报告
        EventMeet() {
            let params = {
                postParams: {
                    page: this.pageData.page,
                    size: this.pageData.size,
                    criteria: {
                        projectId: this.projectId
                    },
                    orders: [
                        {
                            column: 'updateTime',
                            asc: false
                        }
                    ]
                }
            }
            QueryEventReport(params).then(res => {
                if (res.result == 'success') {
                    if (res.content) {
                        this.pageData.tableData = res.content
                        this.pageData.total = res.count
                    }
                }
            })
        },
        // 新增事件报告
        EventAdd(row) {
            this.$refs.PlanMasterAdd.open(row)
        },
        // 编辑事件报告
        EventEdit(row) {
            this.$refs.PlanMasterEdit.open(row)
        },
        formatDate(date) {
            return moment.unix(date / 1000).format('YYYY-MM-DD')
        },
        // 删除事件报告
        Eventdelete(row) {
            this.$confirm('确定删除该应急报告吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            })
                .then(() => {
                    let fileParams = {
                        postParams: {
                            keys: [row.fileName]
                        }
                    }
                    deleteFile(fileParams).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除文件成功!'
                        })
                    })
                    let params = {
                        postParams: {
                            id: row.id
                        }
                    }
                    DeleteEventReport(params).then(resp => {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        })
                        this.EventMeet()
                    })
                })
                .catch(() => {})
        }
    }
}
</script>
<style lang="scss" scoped>
.down {
    color: #606266;
}
</style>