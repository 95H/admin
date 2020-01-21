<template>
    <div class='tree-table'>
        <page-table :total='treeData.length' :page='1' :size='treeData.length'>
            <el-table :data='treeData' stripe slot='table' border v-loading='loading' @row-click='handleClick'>
                <el-table-column prop='obj.equipmentCategory' label='设备' width='230'>
                    <template slot-scope='{row}'>
                        <span
                            class='span-style'
                            v-if='row.obj.equipmentCategory'
                        >{{SystemCodetoClass($store.state.categoryArr.equipmentAll,row.obj.equipmentCategory)}}</span>
                        <span class='span-style' v-else>{{SystemCodetoClass($store.state.categoryArr.equipmentAll,row.obj.systemCategory)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop='obj.localName' label='名称' width='200'></el-table-column>
                <el-table-column label='数据'>
                    <template slot-scope='{row}'>
                        <span>
                            <slider
                                v-if='row.activities && row.activities.length>0'
                                :list='handleSegment(row.activities)'
                                :width='`${(sliderWidth)}`'
                            ></slider>
                            <slider v-else :list='[]' :width='`${sliderWidth}`'></slider>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </page-table>
    </div>
</template>

<script>
import slider from '../Warn/slider'
import { SystemCodetoClass } from '../../../framework/utils/formatToClass.js'
export default {
    components: { slider },
    props: ['treeData'],
    data() {
        return {
            list: [],
            SystemCodetoClass,
            loading: true
        }
    },
    computed: {
        sliderWidth() {
            if (document.body.clientWidth <= '1366') {
                return 600
            } else {
                return 900
            }
        }
    },
    methods: {
        handleSegment(list) {
            // 防止后端不排序
            const _list = JSON.parse(JSON.stringify(list)).sort((i, j) => Number(i.activityTime1) - Number(j.activityTime1))
            let result = []
            let pointer = 0 // 指针，每检测到一个停止，指针+1
            _list.forEach(i => {
                if (!Boolean(result[pointer])) {
                    result[pointer] = []
                }
                result[pointer].push(i)
                if (i.activityType === 2) {
                    pointer++
                }
            })
            return result
        },
        handleClick(row) {
            console.log(row)
            this.$emit('detailData', row)
        }
    },
    mounted() {
        if (this.treeData) {
            this.loading = false
        }
    }
}
</script>
<style lang="scss" scoped>
.tree-table {
    .span-style {
        display: inline-block;
        background: #ccc;
        width: 174px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 6px;
        margin-right: 10px;
        margin-left: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
<style lang="scss">
.tree-table {
    .el-table--border td,
    .el-table--border th {
        border-right: none;
        padding-left: 30px;
    }
    th {
        display: none;
    }
    td {
        cursor: pointer;
    }
}
</style>