<template>
    <el-table :data='equipmentArr' ref='multipleTable' stripe slot='table' height='300' width='100%' border @selection-change='handleSelectionChange'>
        <el-table-column type='selection' width='55'></el-table-column>
        <el-table-column label='类型名'>
            <template slot-scope='{row}'>
                <span v-if='activeName=="first"'>{{SystemCodetoClass($store.state.categoryArr.equipmentAll,row.equipment.systemCategory)}}</span>
                <span v-else>{{SystemCodetoClass($store.state.categoryArr.equipmentAll,row.equipment.equipmentCategory)}}</span>
            </template>
        </el-table-column>
        <el-table-column prop='equipment.localId' label='本地编码'></el-table-column>
        <el-table-column prop='equipment.localName' label='全局名称'></el-table-column>
        <el-table-column prop='space.localName' label='安装位置'></el-table-column>
        <el-table-column prop='building.localName' label='所在建筑'></el-table-column>
        <el-table-column prop='floor.localName' label='所在楼层'></el-table-column>
    </el-table>
</template>

<script>
import { SystemCodetoClass } from '../../../framework/utils/formatToClass'
export default {
    data() {
        return {
            multipleSelection: this.equipmentArr,
            SystemCodetoClass
        }
    },
    props: ['equipmentArr', 'activeName'],
    updated() {
        this.$nextTick(function() {
            this.checked()
        })
    },
    watch: {
        equipmentArr(oldVal, newVal) {
            if (newVal) {
                this.checked()
            }
        }
    },
    methods: {
        checked() {
            for (let i = 0; i < this.equipmentArr.length; i++) {
                this.$refs.multipleTable.toggleRowSelection(this.equipmentArr[i], true)
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
            this.$emit('setTableEq', this.multipleSelection)
        }
    }
}
</script>

<style>
.el-table__header-wrapper .el-table__header thead tr th {
    background-color: #d9d9d9 !important;
    color: #000;
}
</style>