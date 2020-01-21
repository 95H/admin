<template>
    <div class="gold-box">
        <table-page-template>
            <el-table :data="tableDataCoin" border stripe style="width: 100%" slot='table' v-loading='loading' :summary-method="getSummaries" show-summary>
                <el-table-column prop="person.name" label="" width="180">
                </el-table-column>
                <el-table-column prop="person.position.name" label="岗位">
                </el-table-column>
                <el-table-column prop="coin.balance" sortable label="当前剩余金币">
                </el-table-column>
                <el-table-column prop="coin.total" sortable label="累计获得金币">
                </el-table-column>
            </el-table>
        </table-page-template>
    </div>

</template>
<script>
import { Goldcoins } from '@/api/Integral/Integral.js'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            loading: true,
            tableDataCoin: []
        }
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    methods: {
        getSummaries(param) {
            const { columns, data } = param
            const sums = []
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计'
                    return
                }
                var arr = column.property.split('.')
                var column1 = arr[0]
                var column2 = arr[1]
                const values = data.map(item => {
                    return Number(item[column1][column2])
                })
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            return prev + curr
                        } else {
                            return prev
                        }
                    }, 0)
                } else {
                    sums[index] = ''
                }
            })
            let arrs = []
            sums.forEach((val, i) => {
                if (typeof val === 'number' && !isNaN(val)) {
                    arrs.push(Number(val.toFixed(1)))
                } else {
                    arrs.push(val)
                }
            })
            return arrs
        },
        // 按项目查询人员金币
        Coin() {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId
                    }
                }
            }
            Goldcoins(params).then(res => {
                this.loading = false
                if (res.content) {
                    this.tableDataCoin = res.content
                }
            })
        }
    }
}
</script>
<style lang="scss">
.gold-box {
    .el-table th {
        padding: 7px 0;
    }
}
</style>
