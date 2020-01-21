<template>
    <div :style="contentStyleObj" class="position">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="设备" name="first">
                <position-equipment ref="PositionEquipment" :objArr="objArr" :categoryArr="categoryArrTest" :count="count"></position-equipment>
            </el-tab-pane>
            <el-tab-pane label="空间" name="second">
                <position-space ref="PositionSpace" :objArr="objArr" :count="count"></position-space>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import httputils from '@/api/httputils'
import PositionEquipment from './PositionEquipment'
import PositionSpace from './PositionSpace'
import { queryArchitecture, queryFloor, querySpace, queryCategory } from '@/api/Position/position.js'
export default {
    data() {
        return {
            activeName: 'first',
            contentStyleObj: {
                width: ''
            },
            objArr: [], //对象位置
            spaceArr: [], //空间
            categoryArr: [], //设备
            categoryArrTest: [],
            listArr: [],
            count: '' //项目下的建筑数量
        }
    },
    components: {
        PositionEquipment,
        PositionSpace
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    methods: {
        //   对象位置 查询建筑
        getQuery() {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId
                    },
                    orders: [
                        {
                            column: 'name',
                            asc: true
                        }
                    ]
                }
            }
            queryArchitecture(params).then(res => {
                if (res.content.length > 0) {
                    let arr = []
                    res.content.forEach(item => {
                        let obj = {
                            id: item.id,
                            name: item.localName,
                            children: []
                        }
                        arr.push(obj)
                        this.getFloor(item.id)
                    })
                    this.objArr = arr
                    this.count = res.count
                }
            })
        },
        // 查询楼层
        getFloor(buildingId) {
            let params = {
                postParams: {
                    criteria: {
                        buildingId: buildingId
                    },
                    orders: [
                        {
                            column: 'localName',
                            asc: false
                        }
                    ]
                }
            }
            queryFloor(params).then(res => {
                if (res.content) {
                    let arr = []
                    res.content.forEach(item => {
                        let obj = {
                            id: item.id,
                            name: item.localName,
                            children: []
                        }
                        arr.push(obj)
                        this.getSpace(buildingId, item.id)
                    })
                    this.objArr.forEach(item => {
                        if (item.id == buildingId) {
                            item.children = arr
                        }
                    })
                }
            })
        },
        // 查询空间
        getSpace(buildingId, floorId) {
            let params = {
                postParams: {
                    criteria: {
                        floorId: floorId
                    },
                    orders: [
                        {
                            column: 'localName',
                            asc: true
                        }
                    ]
                }
            }
            querySpace(params).then(res => {
                if (res.content) {
                    let arr = []
                    res.content.forEach(item => {
                        let obj = {
                            id: item.id,
                            name: item.localName
                        }
                        arr.push(obj)
                    })
                    this.objArr.forEach(item => {
                        if (item.id == buildingId) {
                            item.children.forEach(ele => {
                                if (ele.id == floorId) {
                                    ele.children = arr
                                }
                            })
                        }
                    })
                }
            })
        },
        // 查询设备类1
        getCategory1() {
            let params1 = {
                postParams: {
                    criteria: {
                        level: 1
                    },
                    orders: [
                        {
                            column: 'majorName',
                            asc: true
                        }
                    ]
                }
            }
            let params2 = {
                postParams: {
                    criteria: {
                        level: 2
                    }
                }
            }
            let params3 = {
                postParams: {
                    criteria: {
                        level: 3
                    }
                }
            }
            queryCategory(params1).then(res1 => {
                let datalist1 = res1.content
                let arr = []
                datalist1.forEach(item => {
                    let obj = {
                        id: item.id,
                        name: item.majorName,
                        children: []
                    }
                    arr.push(obj)
                })
                queryCategory(params2).then(res2 => {
                    let datalist2 = res2.content
                    let arr2 = []
                    arr.forEach(val => {
                        datalist2.forEach(item => {
                            let obj = {
                                id: item.id,
                                name: item.systemName,
                                children: []
                            }
                            if (val.id == item.id.substr(0, 2)) {
                                val.children.push(obj)
                            }
                        })
                    })
                    queryCategory(params3).then(res3 => {
                        let datalist3 = res3.content
                        arr.forEach(val => {
                            val.children.forEach(item => {
                                datalist3.forEach(value => {
                                    let obj = {
                                        id: value.id,
                                        name: value.equipName
                                    }
                                    if (item.id == value.id.substr(0, 4)) {
                                        item.children.push(obj)
                                    }
                                })
                            })
                        })
                        this.categoryArrTest = arr
                        this.categoryArrTest.forEach(val => {
                            if (val.children.length == 0) {
                                val.children = null
                            } else {
                                val.children.forEach(val2 => {
                                    if (val2.children.length == 0) {
                                        val2.children = null
                                    }
                                })
                            }
                        })
                    })
                })
            })
        },
        getWight() {
            this.contentStyleObj.width =
                document.body.clientWidth > 1000 ? document.body.clientWidth - 255 + 'px' : document.body.clientWidth - 75 + 'px'
        },
        handleClick() {
            if (this.activeName == 'first') {
                this.$refs['PositionEquipment'].search()
            } else if (this.activeName == 'second') {
                this.$refs['PositionSpace'].search()
            }
        }
    },
    mounted() {
        window.addEventListener('resize', this.getWight)
        this.getWight()
        this.handleClick()
        this.getQuery()
        this.getCategory1()
    }
}
</script>