<template>
    <div class='tree'>
        <div v-for='(item,index) in unintData' :key='index'>
            <p style='text-align:center;color:#bcbcbc'>{{SystemCodetoClass($store.state.categoryArr.equipmentAll,item.majorCategory)}}</p>
            <el-table :data='item.data' style='width: 100%;' row-key='id' border :tree-props='{children: "children", hasChildren: "hasChildren"}'>
                <el-table-column prop='label' width='420' :show-overflow-tooltip='true'>
                    <template slot-scope='{row}'>
                        <span v-if='row.children' style='overflow: hidden;white-space: nowrap;'>
                            <span class='span-style' :class='row.children==0?"pad-style:":""'>{{row.label.split(',')[0]}}</span>
                            <span>{{row.label.split(',')[1]}}</span>
                        </span>
                        <span v-else style='overflow: hidden;white-space: nowrap;'>
                            <span class='span-style'>{{row.label.split(',')[0]}}</span>
                            <span>{{row.label.split(',')[1]}}</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop='activities'>
                    <template slot-scope='{row}'>
                        <span v-if='row.children==0 || !row.children' @click='handleClick(row)' style='cursor: pointer;'>
                            <slider v-if='row.activities && row.activities.length>0' :list='handleSegment(row.activities)' :width='`${sliderWidth}`'></slider>
                            <slider v-else :list='[]' :width='`${sliderWidth}`'></slider>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import slider from '../Warn/slider'
import { SystemCodetoClass } from '../../../framework/utils/formatToClass.js'
export default {
    components: { slider },
    props: ['unintData'],
    data() {
        return {
            SystemCodetoClass
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
    }
}
</script>
<style lang="scss" scoped>
.tree {
    .span-style {
        display: inline-block;
        background: #ccc;
        width: 174px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 6px;
        margin-right: 10px;
        // overflow: hidden;
        // text-overflow:ellipsis;
        // white-space: nowrap;
    }
    .pad-style {
        margin-left: 25px;
    }
}
</style>
<style lang="scss">
.tree {
    .el-table--border td,
    .el-table--border th {
        border-right: none;
        padding-left: 30px;
    }
    th {
        display: none;
    }
}
</style>