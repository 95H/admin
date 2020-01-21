<template>
    <div :style='contentStyleObj'>
        <div class='bgImg' v-if='this.planArr.length<=0'>
            <table-page-template>
                <el-form :inline='true' slot='form' size='mini' v-if='hasPermission("manage:master:saveList")'>
                    <el-form-item>
                        <el-button type='primary' @click='openEdit(activeName)'>录入考试成绩</el-button>
                    </el-form-item>
                </el-form>
            </table-page-template>
            <div class='bgImg-box'>
                <img src='../../../static/images/no.jpg' alt />
                <p>暂无数据</p>
            </div>
        </div>
        <div class='plan-present' v-if='this.planArr.length>0'>
            <el-tabs v-model='activeName' @tab-click='handleClick'>
                <el-tab-pane v-for='(item,index) in planArr' :key='index' :label='item.planName' :name='item.id.toString()'>
                    <div class='query-form' v-if='hasPermission("manage:master:saveList")'>
                        <el-form :inline='true' size='mini'>
                            <el-form-item>
                                <el-button type='primary' @click='openEdit(activeName)'>录入考试成绩</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <plan-pre-table v-if='tableData.length>0' :tableData='tableData'></plan-pre-table>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import PlanPreTable from './PlanPreTable'
import { InquiryCase, queryPresen } from '@/api/Plan/plan.js'
import { mapGetters } from 'vuex'
var moment = require('moment')
import 'moment/locale/zh-cn'
export default {
    data() {
        return {
            contentStyleObj: {
                width: ''
            },
            activeName: '1',
            tableData: [],
            planArr: [],
            planId: ''
        }
    },
    components: {
        PlanPreTable
    },
    mounted() {
        this.queryTitle()
        this.getWight()
        window.addEventListener('resize', this.getWight)
        // console.log(this.$route.query.planId)
        this.planId = this.$route.query.planId
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    methods: {
        getWight() {
            this.contentStyleObj.width =
                document.body.clientWidth > 1000 ? document.body.clientWidth - 255 + 'px' : document.body.clientWidth - 75 + 'px'
        },
        handleClick(tab, event) {
            this.query()
        },
        queryTitle() {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId
                    },
                    orders: [
                        {
                            column: 'planName',
                            asc: false
                        }
                    ]
                }
            }
            InquiryCase(params).then(res => {
                if (res.content) {
                    this.planArr = res.content
                    if (this.planArr.length > 0) {
                        if (this.planId) {
                            this.activeName = this.planId
                        } else {
                            this.activeName = this.planArr[0].id.toString()
                        }
                        this.query()
                    }
                }
            })
        },
        query() {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId,
                        planId: Number(this.activeName)
                    }
                }
            }
            queryPresen(params).then(res => {
                if (res.content) {
                    this.tableData = res.content
                }
                // this.activeName = this.planId
            })
        },
        openEdit(activeName) {
            this.activeName = activeName
            this.$router.push({
                path: 'PlanPresentationInput',
                query: { id: activeName }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.bgImg {
    width: 100%;
    height: 100%;
    background: #fff;
    position: relative;
    .bgImg-box {
        width: 30%;
        height: 30%;
        margin: 0 auto;
        padding: 10%;
        // padding: 15% 35% 25% 35%;
        img {
            width: 100%;
            height: 100%;
        }
        p {
            text-align: center;
        }
    }
}
.plan-present {
    // background: red;
    // overflow: scroll;
    // height: 100%;
    // background: #fff;
    padding-left: 20px;
}
</style>
<style lang="scss">
.el-tabs__item is-top {
    border: 1px solid red;
}
</style>
