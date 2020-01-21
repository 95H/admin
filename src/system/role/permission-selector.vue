<template>
    <el-dialog title='配置权限' :visible.sync='visible' width='80%'>
        <el-table
            :data='tableData'
            row-key='path'
            border
            stripe
            default-expand-all
            :tree-props='treeProps'
            size='mini'
            v-loading='loading'
            height='450px'
        >
            <el-table-column prop='name' label='菜单' width='180'></el-table-column>
            <el-table-column prop='opt' label='操作' align='right'>
                <template slot-scope='{row}'>
                    <el-checkbox v-for='(opt,index) in row.opts' :key='index' v-model='opt.checked' @change='changeCheckBox(row, opt)'>{{opt.name}}</el-checkbox>
                </template>
            </el-table-column>
        </el-table>
        <span slot='footer' class='dialog-footer'>
            <el-button @click='visible = false' size='small'>取 消</el-button>
            <el-button type='primary' @click='save' size='small'>确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import adminapi from '@/api/system/admin'
import roleapi from '@/api/system/role'
export default {
    name: 'permission-selector',
    props: [],
    components: {},
    data() {
        return {
            loading: true,
            visible: false,
            roleId: null,
            treeProps: { children: 'children', hasChildren: 'hasChildren' },
            tableData: [],
            selectOpts: []
        }
    },
    computed: {},
    methods: {
        save() {
            this.loading = true
            let arr = []
            this.tableData.forEach(menu => this.getChecked(menu, arr))
            roleapi.setOperations({ roleId: this.roleId, opts: arr }).then(resp => {
                this.loading = false
                if (resp.result == 'success') {
                    this.$message.success('配置成功')
                    this.visible = false
                } else {
                    this.$message.error('配置失败: ' + resp.message)
                }
            })
        },
        initMenu(menu, psDef) {
            if (menu.children && menu.children.length > 0) {
                menu.children.forEach(submenu => this.initMenu(submenu, psDef))
            } else if (menu.opts && menu.opts.length > 0) {
                menu.opts.forEach(opt => {
                    opt.checked = !!psDef[opt.permission]
                })
            }
        },
        getChecked(menu, arr) {
            if (menu.children && menu.children.length > 0) {
                menu.children.forEach(submenu => this.getChecked(submenu, arr))
            } else if (menu.opts && menu.opts.length > 0) {
                menu.opts.forEach(opt => {
                    if (opt.checked) {
                        arr.push(opt.permission)
                    }
                })
            }
        },
        async show(roleId) {
            this.roleId = roleId
            this.visible = true
            this.loading = true
            let resp = await roleapi.getOperations(roleId)
            let ps = resp.data ? resp.data : []
            let psDef = {}
            ps.forEach(p => (psDef[p] = true))
            let menus = adminapi.getAllMenus({})
            menus.forEach(menu => {
                this.initMenu(menu, psDef)
            })
            this.tableData = menus
            this.loading = false
        },
        changeCheckBox(data, opt) {
            if (opt.checked && !opt.basic) {
                data.opts.forEach(o => {
                    if (o.basic && !o.checked) {
                        o.checked = true
                    }
                })
            }
        }
    }
}
</script>