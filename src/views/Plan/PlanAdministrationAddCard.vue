<template>
    <el-dialog title="新增预案" :visible.sync="dialogFormVisible" @close="close">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="getRowDatas">
            <el-table-column type="selection" width="35" :selectable="checkSelectable">
                <!-- <template slot-scope="{row}">
                    {{row.isChecked}}
                </template> -->
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="100">
            </el-table-column>
            <el-table-column prop="phone" label="电话" width="120">
            </el-table-column>
            <el-table-column prop="company" label="公司" width="170">
            </el-table-column>
            <el-table-column prop="post" label="岗位" width="170">
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click='close'>取消</el-button>
            <el-button type="primary" @click="save()">保存</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { queryItems } from '@/api/User/User.js'
import { mapGetters } from 'vuex'
export default {
    name: 'PlanAdministrationAddCard',

    data() {
        return {
            tableData: [],
            selectedId: [],
            form: {
                name: null,
                phone: null,
                company: null,
                address: null
            },
            planAddressBook: [], //传过来的自带的联系人
            changeArr: [], //选中的数据
            dialogFormVisible: false,
            formLabelWidth: '100px'
        }
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    mounted() {
        this.getData()
    },
    methods: {
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row)
                })
            } else {
                this.$refs.multipleTable.clearSelection()
            }
        },
        checkSelectable(row) {
            let flag = true
            let phone = ''
            this.planAddressBook.forEach(val => {
                if (row.phone === val.addressBooksPhone) {
                    phone = val.addressBooksPhone
                }
            })
            if (row.phone == phone) {
                flag = false
            }
            return flag
        },
        open(data) {
            this.planAddressBook = data
            this.dialogFormVisible = true
            this.$nextTick(function() {
                let arr = []
                data.forEach((v1, k1) => {
                    this.tableData.forEach((v2, k2) => {
                        if (v2.name == v1.addressBooksName) {
                            arr.push(this.tableData[k2])
                        }
                    })
                })
                // this.toggleSelection(arr);
            })
        },
        // 选中的联系人
        getRowDatas(row) {
            this.changeArr = row
        },
        // 查询联系人
        getData() {
            let vm = this
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId
                    },
                    orders: [
                        {
                            column: 'name',
                            asc: false
                        }
                    ]
                }
            }
            queryItems(params).then(res => {
                if (res.content) {
                    this.tableData = res.content // 请求到的数据
                }
            })
        },
        // 保存
        save() {
            this.$emit('messege', this.changeArr)
            this.$refs.multipleTable.clearSelection()
            this.dialogFormVisible = false
        },
        //关闭组件
        close() {
            this.dialogFormVisible = false
            this.$refs.multipleTable.clearSelection()
        }
    }
}
</script>