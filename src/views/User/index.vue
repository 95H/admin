<template>
    <div class='flex-column' :style='contentStyleObj'>
        <div class='query-form' v-if='hasPermission("manage:addressbook:save")'>
            <el-form :inline='true' :model='queryData' size='mini'>
                <el-form-item>
                    <el-button type='primary' @click='openAdd(null)'>新增人员</el-button>
                </el-form-item>
            </el-form>
        </div>
        <page-table :total='pageData.total' :page='pageData.page' :size='pageData.size' @pageChanged='pageChanged'>
            <el-table :data='pageData.users' border stripe slot='table'>
                <el-table-column prop='name' label='人员姓名' min-width='180'></el-table-column>
                <el-table-column prop='phone' label='电话号码' min-width='180'></el-table-column>
                <el-table-column prop='company' label='公司' min-width='200'></el-table-column>
                <el-table-column prop='post' label='岗位' min-width='180'></el-table-column>
                <el-table-column label='操作' width='150' align='center'>
                    <template slot-scope='{row}'>
                        <opt-button text='编辑' v-if='hasPermission("manage:addressbook:update")' @click='openEdit(row)' />
                        <opt-button text='编辑' v-else disabled @click='openEdit(row)' />
                        <opt-separator />
                        <opt-button text='作废' v-if='hasPermission("manage:addressbook:delete")' type='danger' @click='setInvalid(row)' />
                        <opt-button text='作废' v-else disabled type='danger' @click='setInvalid(row)' />
                    </template>
                </el-table-column>
            </el-table>
        </page-table>
        <user-add ref='addUser' @confirm='getData' slot='dialog'></user-add>
        <user-edit ref='editUser' @confirm='getData' slot='dialog'></user-edit>
    </div>
</template>
<script>
import UserAdd from './UserAdd'
import UserEdit from './UserEdit'
import { queryDelete, queryItems } from '@/api/User/User.js'
import { mapGetters } from 'vuex'
export default {
    name: 'UserList',
    data() {
        return {
            contentStyleObj: {
                width: ''
            },
            queryData: { username: null },
            pageData: { page: 1, size: 10, total: 0, users: [] }
        }
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    components: {
        'user-add': UserAdd,
        'user-edit': UserEdit
    },
    mounted() {
        this.getWight()
        window.addEventListener('resize', this.getWight)
        window.onresize = function() {}
    },
    methods: {
        getWight() {
            this.contentStyleObj.width =
                document.body.clientWidth > 1000 ? document.body.clientWidth - 255 + 'px' : document.body.clientWidth - 75 + 'px'
        },
        openAdd(user) {
            this.$refs.addUser.open(user)
        },
        openEdit(user) {
            this.$refs.editUser.open(user)
        },
        pageChanged(page, size) {
            this.pageData.page = page
            this.pageData.size = size
            this.getData()
        },
        query() {
            this.pageData.page = 1
            this.getData()
        },
        async getData() {
            let vm = this
            let request = {
                postParams: {
                    page: vm.pageData.page,
                    size: vm.pageData.size,
                    criteria: {
                        projectId: this.projectId
                    },
                    orders: [
                        {
                            column: 'name',
                            asc: true
                        }
                    ]
                }
            }
            queryItems(request).then(resp => {
                vm.pageData.total = resp.count
                vm.pageData.users = resp.content
            })
        },
        setValid(user) {
            userapi.setValid({ id: user.id, status: 1 }).then(resp => {
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                })
                this.getData()
            })
        },
        setInvalid(user) {
            // console.log(user);
            if (!user.isUsed) {
                this.$confirm('该人员信息目前被使用中，确定作废该人员吗?作废之后人员信息将被移除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                })
                    .then(() => {
                        let params = {
                            postParams: {
                                id: user.id
                            }
                        }
                        queryDelete(params).then(resp => {
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            })
                            this.getData()
                        })
                    })
                    .catch(() => {})
            } else {
                this.$confirm('确定作废人员吗，作废之后人员信息将不可被应用！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                })
                    .then(() => {
                        let params = {
                            postParams: {
                                id: user.id
                            }
                        }
                        queryDelete(params).then(resp => {
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            })
                            this.getData()
                        })
                    })
                    .catch(() => {})
            }
        },
        statusFormatter(row, column, cellValue, index) {
            if (cellValue == 1) {
                return '正常'
            } else {
                return '禁用'
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.query()
        })
    }
}
</script>
