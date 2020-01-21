<template>
    <div class='strateShow'>
        <div class='s-header'>
            <div style='float:right'>
                <el-button type='primary' size='small' @click='drumpRoute'>批量配置或修改策略</el-button>
            </div>
            <el-form :inline='true' slot='form' size='mini'>
                <el-form-item label='日期：'>
                    <el-date-picker v-model='value1' type='date' format='yyyy-MM-dd' value-format='yyyyMMdd' placeholder='选择日期' @change='getData'></el-date-picker>
                </el-form-item>
                <el-form-item label='显示模式：'>
                    <el-select v-model='modelValue' placeholder='请选择' @change='changeModel' clearable>
                        <el-option v-for='item in modelOptions' :key='item.value' :label='item.label' :value='item.value'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='专业/系统/设备类:'>
                    <el-cascader
                        :options='$store.state.categoryArr.equipmentAll'
                        v-model='devValue'
                        :show-all-levels='false'
                        placeholder='全部专业系统设备类'
                        :props='configObj'
                        @change='getData'
                        clearable
                    ></el-cascader>
                </el-form-item>
                <el-form-item label='计划组：'>
                    <el-select placeholder='请选择' v-model='groupId' @change='getChange' clearable>
                        <el-option v-for='item in planOptions' :key='item.value' :label='item.label' :value='item.value'></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class='s-center'>
            <p style='width:300px'>
                <el-input placeholder='运行单元名称' v-model='keyword' class='input-with-select'>
                    <el-button slot='append' @click='getData'>筛选</el-button>
                </el-input>
            </p>
            <tree v-if='modelValue==0' :unintData='unintData' @detailData='detailData'></tree>
            <tree-table v-if='modelValue!=0 && resultData' :treeData='resultData' @detailData='detailData'></tree-table>
        </div>
        <div class='drawer-layout' v-if='showDrawer' @click='closeDrawer'></div>
        <div class='drawer' v-if='showDrawer'>
            <detail-drawer :row='row' @close='closeDrawer' ref='drawer' @handleDel='handleDel'></detail-drawer>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import treeTable from './treeTable'
import tree from './tree'
import { GetEquipmentList, queryGroup, saveGroup, queryRunTime } from '@/api/Strategy/strate.js'
import detailDrawer from './detailDrawer'
import { SystemCodetoClass } from '../../../framework/utils/formatToClass'

export default {
    components: { treeTable, detailDrawer, tree },
    data() {
        return {
            value1: new Date(),
            SystemCodetoClass,
            modelOptions: [
                {
                    value: '0',
                    label: '设备分类'
                },
                {
                    value: 'startTime',
                    label: '开启时刻'
                },
                {
                    value: 'stopTime',
                    label: '关闭时刻'
                },
                {
                    value: 'runTime',
                    label: '运行总时长'
                }
            ],
            modelValue: '0',
            devValue: '',
            keyword: '',
            configObj: {
                label: 'name',
                value: 'id',
                checkStrictly: true
            },
            groupId: '',
            planOptions: [],
            showDrawer: false,
            row: {},
            ids: [],
            runTimeList: [],
            treeData: [],
            resultData: [],
            unintData: []
        }
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    methods: {
        getData() {
            let criteria = {
                projectId: this.projectId
            }
            if (this.groupId) {
                criteria.groupId = this.groupId
            }
            if (this.keyword) {
                criteria.localName = {
                    $like: `%${this.keyword}%`
                }
            }
            if (this.devValue.length > 0) {
                switch (this.devValue.length) {
                    case 1:
                        criteria.majorCategory = this.devValue[0]
                        this.loading = true
                        break
                    case 2:
                        criteria.majorCategory = this.devValue[0]
                        criteria.systemCategory = this.devValue[1]
                        this.loading = true
                        break
                    case 3:
                        criteria.majorCategory = this.devValue[0]
                        criteria.systemCategory = this.devValue[1]
                        criteria.equipmentCategory = this.devValue[2]
                        this.loading = true
                        break
                }
            }
            let params = {
                postParams: {
                    criteria: criteria
                }
            }
            this.treeData = []
            this.resultData = []
            this.unintData = []
            GetEquipmentList(params).then(res => {
                //第一级是专业 majorCategory 第二级是系统和系统实例 systemCategory system 第三级是设备和设备实例 equipmentCategory localName
                if (res.content) {
                    this.treeData = res.content
                    if (this.treeData) {
                        this.getRunTime()
                    }
                }
            })
        },
        getChange(val) {
            this.groupId = val
            this.getData()
        },
        changeModel(val) {
            this.modelValue = val
            this.getData()
        },
        formatTree(content) {
            let obj1 = {}
            // 将 majorCategory 一样的放在一块先
            content.forEach(i => {
                const key1 = i.obj.majorCategory
                if (obj1[key1]) {
                    obj1[key1].data.push(i)
                } else {
                    obj1[key1] = {
                        majorCategory: key1,
                        data: [i]
                    }
                }
            })

            Object.values(obj1).forEach(i => {
                let obj2 = {}
                i.data.forEach(item => {
                    if (item.system) {
                        const childrenItem = {
                            label: item.obj.equipmentCategory1 + ',' + item.obj.localName,
                            id: item.obj.id,
                            activities: item.activities,
                            obj: item.obj,
                            equipmentCategory: item.obj.equipmentCategory1
                            // parentId: item.system.id
                        }
                        if (obj2[item.system.id]) {
                            obj2[item.system.id].children.push(childrenItem)
                        } else {
                            obj2[item.system.id] = {
                                label: item.obj.systemCategory1 + ',' + item.system.localName,
                                id: item.system.id,
                                activities: item.activities,
                                obj: item.obj,
                                systemCategory: item.obj.systemCategory1,
                                children: [childrenItem]
                            }
                        }
                    } else {
                        obj2[item.obj.id] = {
                            label: item.obj.equipmentCategory1
                                ? item.obj.equipmentCategory1 + ',' + item.obj.localName
                                : item.obj.systemCategory1 + ',' + item.obj.localName,
                            equipmentCategory: item.obj.equipmentCategory1,
                            activities: item.activities,
                            obj: item.obj,
                            children: []
                        }
                    }
                })
                i.data = Object.values(obj2)
            })
            return Object.values(obj1)
        },
        drumpRoute() {
            this.$router.push({ path: '/baseOper/Strate/modifyStrate' })
        },
        queryPlanGoup() {
            let criteria = {
                projectId: this.projectId
            }
            if (this.devValue.length > 0) {
                switch (this.devValue.length) {
                    case 1:
                        criteria.majorCategory = this.devValue[0]
                        this.loading = true
                        break
                    case 2:
                        criteria.majorCategory = this.devValue[0]
                        criteria.systemCategory = this.devValue[1]
                        this.loading = true
                        break
                    case 3:
                        criteria.majorCategory = this.devValue[0]
                        criteria.systemCategory = this.devValue[1]
                        criteria.equipmentCategory = this.devValue[2]
                        this.loading = true
                        break
                }
            }
            let params = {
                postParams: {
                    criteria: criteria
                }
            }
            queryGroup(params).then(res => {
                let content = res.data.content
                if (content && content.length > 0) {
                    content.forEach(el => {
                        let obj = {
                            value: el.id,
                            label: el.name
                        }
                        this.planOptions.push(obj)
                    })
                }
            })
        },
        detailData(row) {
            this.row = row
            this.showDrawer = true
        },
        closeDrawer() {
            this.showDrawer = false
        },
        handleDel() {
            this.showDrawer = false
            this.getData()
        },
        getRunTime() {
            this.ids = this.treeData.map(i => i.obj.id)
            let orders = []
            if (this.modelValue == 'runTime') {
                orders = [
                    {
                        column: this.modelValue,
                        asc: false
                    }
                ]
            } else {
                orders = [
                    {
                        column: this.modelValue,
                        asc: true
                    }
                ]
            }
            let params = {
                postParams: {
                    criteria: {
                        id: this.ids,
                        date: this.value1
                    },
                    orders: orders
                }
            }
            queryRunTime(params).then(res => {
                this.runTimeList = []
                this.resultData = []
                this.unintData = []
                if (res.result == 'success') {
                    this.runTimeList = res.content
                    this.runTimeList.forEach(i => {
                        if (i.activities) {
                            i.activities.forEach(k => {
                                k.activityTime1 = k.activityTime.slice(8, 14)
                            })
                        }
                        this.treeData.forEach(j => {
                            if (i.objectId === j.obj.id) {
                                i.obj = j.obj
                                i.system = j.system
                                i.obj.equipmentCategory1 = this.SystemCodetoClass(this.$store.state.categoryArr.equipmentAll, i.obj.equipmentCategory)
                                i.obj.systemCategory1 = this.SystemCodetoClass(this.$store.state.categoryArr.equipmentAll, i.obj.systemCategory)
                            }
                        })
                    })
                    this.resultData = this.runTimeList
                    this.unintData = this.formatTree(this.resultData)
                }
            })
        },
        createdTimeFormat(timestamp) {
            let date = timestamp
            let Y = date.getFullYear()
            let M = date.getMonth() + 1
            M = M < 10 ? '0' + M : M
            let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
            return Y + '' + M + '' + D
        }
    },
    mounted() {
        this.value1 = this.createdTimeFormat(this.value1)
        this.getData()
        this.queryPlanGoup()
    },
    created() {}
}
</script>

<style lang="scss" scoped>
.strateShow {
    .s-header {
        background: #fff;
        padding: 10px;
    }
    .s-center {
        margin-top: 10px;
    }
    .drawer-layout {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 235px;
        right: 0;
        z-index: 99;
    }
    .drawer {
        position: fixed;
        background: #fff;
        top: 0;
        bottom: 0;
        right: 0;
        width: 700px;
        z-index: 999;
        box-shadow: 0 7px 15px 0 rgba(0, 0, 0, 0.2);
        transition: all 0.5s ease-in-out;
        overflow-y: scroll;
    }
}
</style>
<style lang="scss">
.strateShow {
    .el-form-item {
        margin-right: 15px !important;
    }
}
</style>