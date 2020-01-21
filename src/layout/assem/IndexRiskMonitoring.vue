<template>
    <table-page-template>
        <el-table :data='riskMonitoringArr' border stripe slot='table' :height='`${tableHeight}px`'>
            <el-table-column label='序号' prop='id' width='50' type='index'>
                <template slot-scope='scope'>
                    <div :class='scope.row.value>scope.row.upperLimit?"red":""'>{{scope.$index+1}}</div>
                </template>
            </el-table-column>
            <el-table-column label='风险说明' prop='explain' :show-overflow-tooltip='true'>
                <template slot-scope='{row}'>
                    <div :class='row.value>row.upperLimit?"red":""'>{{row.explain}}</div>
                </template>
            </el-table-column>
            <el-table-column label='预计损失' prop='value' width='136' :show-overflow-tooltip='true'>
                <template slot-scope='{row}'>
                    <div :class='row.value>row.upperLimit?"red":""'>{{row.value.toFixed(2)}}万元</div>
                </template>
            </el-table-column>
        </el-table>
    </table-page-template>
</template>
<script>
export default {
    data() {
        return {}
    },
    props: ['riskMonitoringArr'],
    methods: {},
    computed: {
        tableHeight() {
            if (window.screen.height >= '1080') {
                return 235
            } else {
                return 135
            }
        }
    },
    mounted() {}
}
</script>
<style lang="scss" scoped >
.red {
    color: #d83931ff;
}
</style>