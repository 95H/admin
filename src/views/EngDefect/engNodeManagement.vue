<template>
    <div class='node-box'>
        <div class='node-box-inner'>
            <h3>方案阶段</h3>
            <com-time-line v-if='activities1.length>0' :activities='activities1' :num ='num1' :isShow='isShow' :parentId='parentId'></com-time-line>
            <div class='node-box-bottom' @click='nodeEdit(null,1,"方案阶段")' v-if='isShow'>
                <i class='el-icon-plus'></i>
                <span>新建节点</span>
            </div>
        </div>
        <div class='node-box-inner'>
            <h3>实施阶段</h3>
            <com-time-line v-if='activities2.length>0' :activities='activities2' :num='num2' :isShow='isShow' :parentId='parentId'></com-time-line>
            <div class='node-box-bottom' @click='nodeEdit(null,1,"实施阶段")' v-if='isShow'>
                <i class='el-icon-plus'></i>
                <span>新建节点</span>
            </div>
        </div>
        <div class='node-box-inner'>
            <h3>验收阶段</h3>
            <com-time-line v-if='activities3.length>0'  :num='num3' :activities='activities3' :isShow='isShow'  :parentId='parentId'></com-time-line>
            <div class='node-box-bottom' @click='nodeEdit(null,1,"验收阶段")' v-if='isShow'>
                <i class='el-icon-plus'></i>
                <span>新建节点</span>
            </div>
        </div>
        <eng-edit-dialog ref='EngEditDialog' :parentId='parentId'></eng-edit-dialog>
    </div>
</template>
<script>
import EngEditDialog from './engEditDialog' //新建-节点管理-新建
import ComTimeLine from './comTimeLine' //时间线
export default {
    data() {
        return {
            centerDialogVisible: false
        }
    },
    props: ['isShow', 'activities1', 'activities2', 'activities3', 'parentId','num1','num2','num3'],
    components: {
        ComTimeLine,
        EngEditDialog
    },
    methods: {
        nodeEdit(row, num, stage) {
            this.$refs.EngEditDialog.open(row, num, stage)
        }
    },
    mounted() {}
}
</script>
<style lang="scss" scoped>
.node-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    text-align: center;
    .node-box-inner {
        background: #fff;
        width: 33%;
        padding: 0 20px;
        .timeline-box {
            margin: 0 auto;
            .timeline-left {
                width: 80%;
                display: inline-block;
                text-align: left;
                .red {
                    color: red;
                }
                .green {
                    color: green;
                }
                .timeline-time {
                     padding: 0;
                    margin-top: 0;
                }
                .timeline-icon {
                    float: right;
                    i {
                        font-size: 20px;
                    }
                }
                .timeline-person {
                    color: #aaa;
                }
            }
            .timeline-right {
                font-size: 20px;
                cursor: pointer;
                margin-left: 15px;
                vertical-align: middle;
                height: 100%;
                display: inline-block;
            }
        }
        .node-box-bottom {
            height: 50px;
            line-height: 50px;
            cursor: pointer;
            margin: 0 auto;
            text-align: center;
            i {
                margin-bottom: 4px;
                font-size: 20px;
                vertical-align: middle;
            }
            span {
                font-size: 16px;
                display: inline-block;
            }
        }
    }
}
</style>
<style lang="scss">
.node-box {
    .el-tabs__content {
        overflow: auto;
    }
    .el-timeline-item__content {
        display: flex;
        align-items: center;
    }
    .el-timeline-item__wrapper {
        padding-left: 0;
        left: 20px;
    }
    .el-timeline {
        padding-left: 0;
    }
}
</style>