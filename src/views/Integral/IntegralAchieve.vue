<template>
    <div class="Integral">
        <el-tabs type="border-card" v-model="activeTabs" @tab-click="handleClick">
            <el-tab-pane v-for="(item1,index) in tableList" :key="index" :name="String(index)" :label="item1.code">
                <span slot="label">{{item1.name}}</span>
                <table-page-template>
                    <el-table :data="daa" class="table" border stripe slot="table" v-loading="loading" :height="`${tableHeight}px`">
                        <el-table-column prop="levelName" label="等级" width="100" align="center" fixed></el-table-column>
                        <el-table-column v-for="(item,index) in names" :key="index" :prop="item.name" width="80">
                            <template slot-scope="{row}">
                                <span class="span1" @click="Lookpoint(item,item1)">{{row[item.name]}}</span>
                            </template>
                            <!--  v-if="row.personName==names[index]" 等级的name等于row.name -->
                            <!-- <el-table-column :key="index" :label="labels[index]" width="80" >
                                <template slot-scope="{row}">
                                <span class="span1" @click="Lookpoint(row,item1)">{{row.point}}</span>
                                </template>
                            </el-table-column>-->
                            <template slot="header">
                                <span>{{item.name}}</span>
                                <hr style="background-color:#EBEEF5;height:1px;border:none;" />
                                <span>{{item.position}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </table-page-template>
            </el-tab-pane>
        </el-tabs>
        <integral-acquisition ref="IntegralAcquisition"></integral-acquisition>
    </div>
</template>
<script>
import { majorList, Definition, ByProjectquery } from "@/api/Integral/Integral.js"
import { mapGetters } from "vuex"
import IntegralAcquisition from "./IntegralAcquisition.vue" // 积分日志
export default {
    data() {
        return {
            loading: true,
            activeTabs: "0",
            tableList: [], // 13类积分类型
            initData: "",
            names: [], //人名
            daa: []
        }
    },
    components: {
        "integral-acquisition": IntegralAcquisition
    },
    computed: {
        ...mapGetters(["projectId"]),
        tableHeight() {
            if (window.screen.height == "1080") {
                return document.documentElement.clientHeight - 270
            } else if (window.screen.height == "768") {
                return document.documentElement.clientHeight - 230
            } else {
                return 600
            }
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        // 13类积分类型
        init() {
            let params = {}
            majorList(params).then(res => {
                this.tableList = res.data
                if (this.tableList) {
                    this.initData = this.tableList[0].code
                }
                this.activeTabs = "0"
                this.init2()
            })
        },
        handleClick(tab) {
            this.initData = tab.label
            let params = {
                postParams: {
                    criteria: {
                        major: tab.label
                    },
                    orders: [
                        {
                            column: "orderId",
                            asc: true
                        }
                    ]
                }
            }
            this.init2()
            this.loading = true
        },
        clickList2(row) {
            let params = {
                postParams: {
                    criteria: {
                        major: row
                    },
                    orders: [
                        {
                            column: "orderId",
                            asc: true
                        }
                    ]
                }
            }
            return Definition(params)
        },
        // 查询项目下人员等级积分
        CheckingIntegral(row) {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId,
                        major: row
                    }
                }
            }
            return ByProjectquery(params)
        },
        init2() {
            Promise.all([this.clickList2(this.initData), this.CheckingIntegral(this.initData)]).then(([res1, res2]) => {
                this.loading = false
                const result = this.formatData(res1.content, res2.content)
                this.names = result.names
                this.daa = result.daa
            })
        },
        formatData(list1, list2) {
            let names = []
            let name_point = {} // name: point
            let daa = []
            if (list1) {
                list1.forEach((i, index1) => {
                    if (list2 != undefined) {
                        list2.forEach((j, index2) => {
                            if (i.id == j.level.levelId) {
                                name_point[j.person.name] = j.level.point
                            } else {
                                name_point[j.person.name] = ""
                            }
                            if (index1 == 0) {
                                const obj = {
                                    name: j.person.name,
                                    personId: j.person.personId,
                                    position: j.person.position ? j.person.position.name : "--"
                                }
                                names.push(obj)
                            }
                        })
                        daa[index1] = {
                            id: i.id,
                            levelName: i.name,
                            ...name_point
                            // point: j.level.point,
                            // personId: j.person.personId,
                            // personName: j.person.name
                        }
                    }
                })
            }
            return { names, daa } //岗位  数据   人名  等级
        },
        // 打开弹框
        Lookpoint(row, item1) {
            this.$refs["IntegralAcquisition"].open(row, item1)
        }
    }
}
</script>
<style lang="scss">
.Integral {
    .query-form {
        display: none;
    }
    .el-table th {
        background: #d9d9d9;
        color: #000;
    }
    .el-table {
        .span1 {
            text-align: center;
            color: #02a7f0;
            cursor: pointer;
        }
    }
    .el-table thead.is-group th {
        background: #d9d9d9;
        color: #000;
    }
    .el-table .el-table__body-wrapper .el-table__body tr td .cell {
        height: 58px;
        text-align: center;
        line-height: 59px !important;
    }
    .el-table th div {
        padding: 0;
        text-align: center;
    }
}
</style>