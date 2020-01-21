<template>
    <div class="intal">
        <el-table :data="tableData" :span-method="objectSpanMethod" stripe border v-loading="loading" :height="`${tableHeight}px`">
            <el-table-column label="成就内容" align="center" fixed="left" width="260">
                <el-table-column prop="type1" label="成就大类" width="80"></el-table-column>
                <el-table-column prop="type2" label="成就分类" width="80"></el-table-column>
                <el-table-column prop="name" label="成就名字" width="100"></el-table-column>
            </el-table-column>
            <el-table-column v-for="(item,index) in names" :key="index" :prop="`prop${index}`" :label="names[index]" width="80" align="center">
                <el-table-column :key="index" :prop="`prop${index}`" :label="labels[index]" width="80" align="center">
                    <template slot-scope="{row}">
                        <i style="color:#70b603" v-if="row[`prop${index}`]" class="iconfont icon-duigou"></i>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>

  <script>
import { ListAch, ProjectAch } from "@/api/Integral/Integral.js"
import { mapGetters } from "vuex"
export default {
    data() {
        return {
            loading: true,
            tableData: [], //查询成就定义
            labels: [],
            names: [],
            col1: {}, // 保存第一第二列需要合并单元格的数据
            col2: {}
        }
    },
    computed: {
        ...mapGetters(["projectId"]),
        tableHeight() {
            if (window.screen.height == "1080") {
                return document.documentElement.clientHeight - 200
            } else if (window.screen.height == "768") {
                return document.documentElement.clientHeight - 160
            } else {
                return 600
            }
        }
    },
    methods: {
        init() {
            Promise.all([this.loadListAch(), this.Searcher()]).then(([res1, res2]) => {
                this.loading = false
                this.handleStatistics(res1.data)
                const result = this.formatData(res1.data, res2.content)
                if (result) {
                    this.names = result.names
                    this.labels = result.labels
                    this.tableData = result.tableData
                }
            })
        },
        // 查询成就定义
        loadListAch() {
            let params = {
                getParams: {}
            }
            return ListAch(params)
        },
        // 按项目查询人员成就
        Searcher() {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId
                    }
                }
            }
            return ProjectAch(params)
        },
        formatData(list1, list2) {
            if (!list1 || !list2) {
                return
            }
            let names = []
            let labels = []
            let tableData = []
            list1.forEach((i, index1) => {
                tableData[index1] = {
                    id: i.id,
                    type1: i.type1,
                    type2: i.type2,
                    name: i.name
                }
                list2.forEach((j, index2) => {
                    if (j.achievements) {
                        let item = j.achievements.find(k => k.achievementId == i.id) || {}
                        //["prop1"]
                        tableData[index1][`prop${index2}`] = item.achieved
                        if (index1 === 0) {
                            names.push(j.person.name)
                            labels.push(j.person.position ? j.person.position.name : "--")
                        }
                    }
                })
            })

            return { labels, tableData, names }
        },
        handleStatistics(list1) {
            let col1 = {}
            let col2 = {}
            if (list1) {
                list1.forEach((i, index) => {
                    if (col1[i.type1]) {
                        col1[i.type1].count += 1
                    } else {
                        col1[i.type1] = {
                            startIndex: index,
                            count: 1
                        }
                    }
                    if (col2[i.type2]) {
                        col2[i.type2].count += 1
                    } else {
                        col2[i.type2] = {
                            startIndex: index,
                            count: 1
                        }
                    }
                })
            }

            this.col1 = col1
            this.col2 = col2
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                let item = Object.values(this.col1).find(i => i.startIndex == rowIndex)
                if (item) {
                    return {
                        rowspan: item.count,
                        colspan: 1
                    }
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }

            if (columnIndex === 1) {
                let item = Object.values(this.col2).find(i => i.startIndex == rowIndex)
                if (item) {
                    return {
                        rowspan: item.count,
                        colspan: 1
                    }
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }
        }
    }
}
</script>
 <style lang="scss">
.intal {
    .el-table .has-gutter th {
        background: #d9d9d9;
        color: #000;
    }
    .el-table thead.is-group th {
        background: #d9d9d9;
        color: #000;
    }
}
</style>