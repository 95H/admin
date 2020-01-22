<template>
    <div class='timeline-box'>
        <el-timeline>
            <el-timeline-item
                v-for='(item, index) in activities'
                :key='index'
                :icon='item.icon2'
                :color='item.color2'
                size='large'
                placement='top'
                :hide-timestamp='true'
            >
                <div class='timeline-left' @click='dumpLookNode(item)' :class='isShow?"":"cursion"'>
                    <p class='timeline-time'>
                        <span :class='item.class1'>{{item.showFinisheTime}}</span>
                        <span v-if='index==0 && num' class='timeline-icon'>
                            <i class='el-icon-document'></i>
                            <span>{{num}}</span>
                        </span>
                    </p>
                    <p>{{item.title}}</p>
                    <p class='timeline-person'>
                        <span>负责人：{{formatterCode(item.chargeUser,userArr1) || '--'}}</span>
                        <span>提醒时间：{{item.noticeTime?formatDateTime(item.noticeTime) : '--'}}</span>
                    </p>
                </div>
                <div class='timeline-right' v-if='isShow'>
                    <span>
                        <i v-if='!item.isFirm && item.status!="202" && !item.autoCommit' @click='nodeDelete(item)' class='el-icon-delete'></i>
                        <i v-if='item.status!="202"' @click='nodeEdit(item)' class='el-icon-edit-outline'></i>
                        <i @click='nodeLook(item)' class='el-icon-view'></i>
                    </span>
                </div>
            </el-timeline-item>
            <eng-look-dialog ref='EngLookDialog'></eng-look-dialog>
            <eng-edit-dialog ref='EngEditDialog'></eng-edit-dialog>
            <look-node ref='lookNode' :parentId='parentId'></look-node>
        </el-timeline>
    </div>
</template>
<script>
import { formatterCode } from '@/framework/utils/formatToClass'
import EngEditDialog from './engEditDialog' //新建-节点管理-编辑
import EngLookDialog from './engLookDialog' //新建-节点管理-查看
import lookNode from './lookNode' //侧弹-查看节点
var moment = require('moment')
import { mapGetters } from 'vuex'
import 'moment/locale/zh-cn'
import { updateWork,queryRouter } from '@/api/EngDefect/EngDefect.js'
export default {
    data() {
        return {
            formatterCode,
            userArr1: [],
            data:[],
        }
    },
    inject: ['init'],
    // provide(){
    //     return{
    //         query:this.query
    //     }
    // },
     computed: {
        ...mapGetters(['userArr']),
        ...mapGetters("layout", [
             "userInfo",
        ]),
    },
    components: { EngLookDialog, EngEditDialog, lookNode },
    props: ['isShow', 'activities', 'parentId','num'],
    mounted() {
        this.userArr1 = JSON.parse(sessionStorage.getItem('userArr'))
    },
    methods: {
        formatDateTime(date) {
            if (date) {
                return moment.unix(date / 1000).format('YYYY-MM-DD')
            }
        },
        nodeEdit(row) {
            this.$refs.EngEditDialog.open(row, 0)
        },
        nodeLook(row) {
            this.$refs.EngLookDialog.open(row)
        },
        // 删除
        nodeDelete(item) {
            this.$confirm('您确认删除此节点吗?', '确认删除', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'text',
                center: true,
                showClose: false,
                closeOnClickModal: false
            })
                .then(() => {
                    let roles = []
                    this.userInfo.roles.forEach(el=>{
                        roles.push(el.id)
                    })
                    let params = {
                        postParams: {
                            id: item.id,
                            updateUser: this.$store.state.layout.userInfo.userId,
                            commit:'delete',
                            roles:roles
                        }
                    }
                    updateWork(params).then(res => {
                        if (res.result == 'success') {
                            this.init()
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                        }
                    })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
        },
        dumpLookNode(row) {
            if (this.isShow == false) {
                this.$refs.lookNode.open(row)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.timeline-box {
    margin: 0 auto;
    .timeline-left {
        width: 70%;
        min-width: 232px;
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
    .cursion {
        cursor: pointer;
    }
    .timeline-right {
        font-size: 20px;
        cursor: pointer;
        margin-left: 5px;
        vertical-align: middle;
        height: 100%;
        display: inline-block;
        i {
            // font-size: 18px;
        }
    }
}
</style>
