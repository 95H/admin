<template>
    <div class='control-risk'>
        <table-page-template>
            <el-table :data='result' border stripe slot='table' row-key='id'>
                <el-table-column prop='str' label='风险分类及风险点' header-align='center'></el-table-column>
                <el-table-column prop='value' label='阈值' align='center' width='400'>
                    <template slot-scope='{row}'>
                        <div v-if='row.children.length==0'>
                            <div v-if='hasPermission("transfer:riskDefine:update")'>
                                <el-input v-model='row.value' style='width:60%;margin-right:20px;' size='mini' @blur='changeInput(row)' />万元
                            </div>
                            <div v-else>
                                <el-input disabled='true' v-model='row.value' style='width:60%;margin-right:20px;' size='mini' />万元
                            </div>
                        </div>
                        <div v-else></div>
                    </template>
                </el-table-column>
            </el-table>
        </table-page-template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRiskList, updateRiskList } from '@/api/Control/control.js'
export default {
    data() {
        return {
            obj: {},
            result: []
        }
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    methods: {
        filterString(i) {
            delete i.str
            delete i.value
            delete i.id
            delete i.rowId
            return i
        },
        toFormat(obj) {
            let arr = Object.values(obj)
            arr.forEach((i, index) => {
                if (i !== null && typeof i === 'object') {
                    arr[index] = {
                        str: i.str,
                        value: i.value,
                        id: String(i.id),
                        rowId: i.rowId,
                        children: this.toFormat(this.filterString(i))
                    }
                }
            })
            return arr
        },
        handleData(i, floor) {
            const dataObj = {
                str: i[`c${floor}str`],
                value: i.upperLimit || 0,
                id: i[`c${floor}`],
                rowId: i.id
            }
            for (let j = 0; j < floor; j++) {
                if (this.obj[i.c1]) {
                    if (floor > 1) {
                        if (this.obj[i.c1][i.c2]) {
                            if (floor > 2) {
                                if (this.obj[i.c1][i.c2][i.c3]) {
                                    if (floor > 3) {
                                        this.obj[i.c1][i.c2][i.c3][i.c4] = dataObj
                                    }
                                } else {
                                    this.obj[i.c1][i.c2][i.c3] = floor === 3 ? dataObj : {}
                                }
                            }
                        } else {
                            this.obj[i.c1][i.c2] = floor === 2 ? dataObj : {}
                        }
                    }
                } else {
                    this.obj[i.c1] = floor === 1 ? dataObj : {}
                }
            }
        },
        // 查询风控阈值设置
        TheaccidentRisk() {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId
                    }
                }
            }
            getRiskList(params).then(res => {
                if (res.result == 'success') {
                    if (res.content) {
                        this.obj = {}
                        res.content.forEach(i => {
                            if (i.c4) {
                                // 则c4,c3,c2,c1都存在
                                this.handleData(i, 4)
                            } else if (i.c3) {
                                this.handleData(i, 3)
                            } else if (i.c2) {
                                this.handleData(i, 2)
                            } else if (i.c1) {
                                this.handleData(i, 1)
                            }
                        })
                        this.result = this.toFormat(this.obj)
                    }
                }
            })
        },
        //修改风控阈值设置
        changeInput(row) {
            let params = {
                postParams: {
                    projectId: this.projectId,
                    id: row.rowId,
                    upperLimit: row.value
                }
            }
            updateRiskList(params).then(res => {
                this.TheaccidentRisk()
            })
        }
    },
    mounted() {
        this.TheaccidentRisk()
    }
}
</script>

<style lang="scss">
.control-risk {
    .query-form {
        display: none;
    }
}
</style>