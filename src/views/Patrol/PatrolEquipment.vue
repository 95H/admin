<template>
    <div class='patrol'>
        <table-page-template>
            <el-form :inline='true' slot='form' size='mini' onSubmit='return false'>
                <el-form-item>
                    <el-input
                        v-if='this.name=="equip"||this.name=="space"'
                        style='width: 265px;'
                        placeholder='输入sop名称关键字查找'
                        v-model.trim='searchValue'
                        clearable
                    >
                        <el-button slot='append' icon='el-icon-search' @click='searchButton'></el-button>
                    </el-input>
                    <span class='span1'>
                        有
                        <span class='span1-1'>{{count}}</span>条sop没有设定有效期
                    </span>
                    <el-checkbox v-model='checked' label='查看没有有效期的sop及对象' name='type' @change='search'></el-checkbox>
                </el-form-item>
            </el-form>
        </table-page-template>
        <div class='patrol-bottom'>
            <page-table :total='pageData.total' :page='pageData.page' :size='pageData.size' @pageChanged='pageChanged' v-loading='loading'>
                <el-table :data='pageData.tableData' border stripe slot='table'>
                    <el-table-column prop='sopName' label='适用SOP名称'></el-table-column>
                    <el-table-column prop label='有效期' width='300'>
                        <template slot-scope='{row}'>
                            <div v-if='hasPermission("fm:inspectionDuration:update")'>
                                <el-input class='input-1' v-model='row.duration' @keyup.native='changeNumber(row)' @blur='changeInput(row)'></el-input>天
                            </div>
                            <div v-else>
                                <el-input
                                    disabled='true'
                                    class='input-1'
                                    v-model='row.duration'
                                    @keyup.native='changeNumber(row)'
                                    @blur='changeInput(row)'
                                ></el-input>天
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </page-table>
        </div>
    </div>
</template>

<script>
import { saveValidity, queryValidity, queryValidityNull } from '@/api/patrol/patrol.js'
export default {
    data() {
        return {
            pageData: {
                page: 1,
                size: 10,
                total: 0,
                tableData: [] //查询
            },
            searchValue: '',
            input: '',
            input2: '',
            objType: [], //传
            name: '',
            count: '', //数量
            sopName: null, //模糊匹配
            checked: false,
            loading: true
        }
    },
    components: {},
    methods: {
        pageChanged(page, size) {
            this.pageData.page = page
            this.pageData.size = size
            this.search(page, size)
        },
        query() {
            this.pageData.size = 10
            this.pageData.page = 1
            this.search()
        },
        // 查询没有设定有效期的sop数量
        init(objType) {
            this.objType = objType
            this.name = objType[0]
            let params = {
                postParams: {
                    onlyCount: true,
                    criteria: {
                        sopType: '1',
                        workType: '巡检',
                        objType: this.objType,
                        duration: {
                            $null: true
                        }
                    }
                }
            }
            queryValidityNull(params).then(res => {
                if (res.result == 'success') {
                    this.loading = false
                    this.count = res.count
                }
            })
            this.query()
        },
        // 查询
        search() {
            let params = {
                postParams: {
                    criteria: {
                        sopType: '1',
                        workType: '巡检',
                        objType: this.objType,
                        sopName: this.sopName,
                        duration: null
                    },
                    page: this.pageData.page,
                    size: this.pageData.size,
                    orders: [
                        {
                            column: 'sopName',
                            asc: true
                        }
                    ]
                }
            }
            if (this.checked) {
                params.postParams.criteria.duration = {
                    $null: true
                }
            }
            queryValidity(params).then(res => {
                if (res.result == 'success') {
                    this.loading = false
                    this.pageData.tableData = res.content
                    this.pageData.total = res.count
                }
            })
        },
        //input只能输入正整数
        changeNumber(row) {
            let str = '' + row.duration
            if (str.indexOf('.') != -1 || str.indexOf('-') != -1) {
                let arr = str.split('')
                arr.splice(arr.length - 1)
                let str2 = arr.join('')
                row.duration = +str2
            }
        },
        //input失去焦点保存有效期
        changeInput(row) {
            let params = {
                postParams: {
                    sopId: row.sopId,
                    duration: row.duration || null
                }
            }
            saveValidity(params).then(res => {
                if (res.result == 'success') {
                    this.init(this.objType)
                }
            })
        },
        searchButton() {
            if (this.searchValue) {
                this.sopName = {
                    $like: `%${this.searchValue}%`
                }
            } else {
                this.sopName = null
            }
            this.search()
        }
    }
}
</script>
<style lang="scss" scoped>
.patrol {
    .span1 {
        margin: 0 5px;
        color: #606266;
        .span1-1 {
            width: 30px;
            display: inline-block;
            text-align: center;
        }
    }
    .input-1 {
        width: 100px;
        margin-right: 15px;
    }
}
</style>
<style lang="scss">
.patrol-bottom {
    .el-input__inner {
        height: 30px;
        line-height: 30px;
    }
}
</style>