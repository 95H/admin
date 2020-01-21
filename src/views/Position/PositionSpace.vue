<template>
    <div class='pos-box'>
        <div class='pos-top'>
            <span style='float:left;font-size:10px;margin-top:5px;color:#aaa;'>不能勾选,可能是以下一条或多条原因：1、缺少空间轮廓信息;2、缺少楼层平面图</span>
            当前项目共{{total}}个空间，其中{{imgIsNullCount}}个尚无位置图片
            <el-button type='primary' @click='automatic' v-if='hasPermission("object:position:update")' size='mini'>自动生成位置图片</el-button>
            <el-button type='primary' size='mini' v-else disabled>自动生成位置图片</el-button>
            <el-upload class='upload-image' action multiple :show-file-list='false' :http-request='uploadFile' accept='.svg'>
                <el-button size='mini' type='primary' v-if='hasPermission("object:position:update")'>批量上传</el-button>
                <el-button v-else disabled size='mini' type='primary'>批量上传</el-button>
            </el-upload>
        </div>
        <table-page-template>
            <el-form :inline='true' slot='form' size='mini' style='justify-content: space-between;'>
                <el-form-item>
                    <el-input style='width: 265px;' placeholder='输入设备名称或编号关键字查找' v-model.trim='searchValue' clearable>
                        <el-button slot='append' icon='el-icon-search' @click='searchButton'></el-button>
                    </el-input>
                    <el-cascader
                        :options='objArr'
                        :value='values'
                        @change='change'
                        @active-item-change='handleItemChange'
                        v-model='objValue'
                        placeholder='全部位置'
                        :props='configObj'
                        clearable
                    ></el-cascader>
                    <el-cascader
                        :options='listArr'
                        v-model='devValue'
                        @change='devChange'
                        @active-item-change='listArrChange'
                        placeholder='全部功能类型'
                        :props='configObjlist'
                        clearable
                    ></el-cascader>
                    <el-select v-model='typeValue' placeholder='全部生成方式' @change='TypeChange'>
                        <el-option v-for='item in options1' :key='item.value' :label='item.label' :value='item.value'></el-option>
                    </el-select>
                    <el-checkbox label='尚无位置图片的' name='type' v-model='checked' @change='checkedChange'></el-checkbox>
                </el-form-item>
                <div>
                    <el-switch v-if='total!=imgIsNullCount' v-model='deletePic' active-text='快速删除图片' @change='switchChange'></el-switch>
                </div>
            </el-form>
        </table-page-template>
        <page-table :total='pageData.total' :page='pageData.page' :size='pageData.size' @pageChanged='pageChanged'>
            <el-table
                :data='pageData.tableData'
                border
                stripe
                slot='table'
                @selection-change='selectionChange'
                @select-all='selectAll'
                v-loading='loading'
            >
                <el-table-column prop label type='selection' :selectable='checkSelectable'></el-table-column>
                <el-table-column prop='space.localName||space.name' label='空间名称' sortable min-width='180'>
                    <template slot-scope='{row}'>
                        <div v-if='row.space.localName!=undefined'>{{row.space.localName}}</div>
                        <div v-if='row.space.localName==undefined'>{{row.space.name}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop label='空间位置' min-width='200'>
                    <template slot-scope='{row}'>
                        <div v-if='count==1'>{{row.floor?(row.floor.localName?row.floor.localName:row.floor.name):''}}</div>
                        <div
                            v-if='count!=1'
                        >{{(row.building?(row.building.localName?row.building.localName+'-':row.building.name+'-'):'')+(row.floor?(row.floor.localName?row.floor.localName:row.floor.name):'')}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop='space.localId' label='空间编号' sortable min-width='120'></el-table-column>
                <el-table-column prop label='是否有位置图片' min-width='120'>
                    <template slot-scope='{row}'>
                        <div v-if='row.space.positionImg!=undefined'>有</div>
                        <div v-if='row.space.positionImg==undefined' style='color:#f56c6c'>无</div>
                    </template>
                </el-table-column>
                <el-table-column prop label='自动/手动' width='135'>
                    <template slot-scope='{row}'>
                        <div v-if='row.space.positionImgUploadType=="1"'>手动上传</div>
                        <div v-if='row.space.positionImgUploadType=="0"'>自动上传</div>
                    </template>
                </el-table-column>
                <el-table-column prop label='生成时间' sortable width='150'>
                    <template slot-scope='{row}'>
                        <div v-if='row.space.positionImgCreateTime!=undefined'>{{formatDate(row.space.positionImgCreateTime)}}</div>
                        <div v-if='row.space.positionImgCreateTime==undefined'></div>
                    </template>
                </el-table-column>
                <el-table-column prop label='操作' width='170'>
                    <template slot-scope='{row}'>
                        <div class='operation'>
                            <a
                                v-if='row.space.positionImg!=undefined'
                                :href='`http://api.sagacloud.cn/dp-auxiliary/image-service/common/image_get?systemId=dev&secret=46f869eea8b31d14&key=${row.space.positionImg}`'
                                target='_blank'
                            >
                                <opt-button text='查看' class='o-button' />
                            </a>
                            <opt-button v-if='row.space.positionImg==undefined' text='无图片' class='o-button' type='danger' />
                            <opt-separator class='o-button' />
                            <opt-button v-if='row.space.positionImg!=undefined' text='删除' class='o-button' @click='Eventdelete(row)' />
                            <opt-separator v-if='row.space.positionImg!=undefined' class='o-button' />
                            <el-upload class='upload-image' action :show-file-list='false' accept='.xml' :http-request='uploadFileauto'>
                                <opt-button v-if='hasPermission("object:position:update")' text='手动上传位置图' @click='uploadChart(row)' />
                                <opt-button v-else text='手动上传位置图' disabled />
                            </el-upload>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </page-table>
        <pos-space-admin ref='PosSpaceAdmin' slot='dialog' :imgIsNullCount='imgIsNullCount' :total='total'></pos-space-admin>
        <status-upload ref='StatusUpload'></status-upload>
    </div>
</template>
<script>
var moment = require('moment')
import 'moment/locale/zh-cn'
import { mapGetters } from 'vuex'
import { deleteFile, DeleteEventReport } from '@/api/Plan/plan.js'
import { SearchSpacePosition, SearchSpaceTotal, querySpatial, manSpacelUpload, querySpace } from '@/api/Position/position.js'
import PosSpaceAdmin from './PosSpaceAdmin'
import { upload } from '@/api/Position/position.js'
import axios from 'axios'
import StatusUpload from './statusUpload'
export default {
    props: ['objArr', 'count'],
    data() {
        return {
            deletePic: false,
            searchValue: '',
            loading: true,
            checked: false,
            pageData: {
                page: 1,
                size: 10,
                total: 0,
                tableData: [] //查询
            },
            options1: [
                //生成方式选项
                {
                    value: null,
                    label: '全部生成方式'
                },
                {
                    value: '0',
                    label: '自动生成'
                },
                {
                    value: '1',
                    label: '手动上传'
                }
            ],
            typeValue: null, //生成方式
            imgIsNullCount: '', //无位置图片
            total: '', //总数
            values: {}, //对象位置
            objValue: [], //对象参数默认值
            devValue: [], //空间默认值
            losVal: [], //对象参数
            equVal: [], //空间参数
            configObj: {
                //对象位置
                label: 'name',
                value: 'id',
                checkStrictly: true
            },
            configObjlist: {
                //设备类
                label: 'name',
                value: 'code',
                children: 'content',
                checkStrictly: true
            },
            listArr: [], //空间类
            selectionVal: [],
            chartId: '',
            keyword: '',
            picStatus: []
        }
    },
    components: {
        PosSpaceAdmin,
        StatusUpload
    },
    computed: {
        ...mapGetters(['projectId', 'ssoToken'])
    },
    provide() {
        return {
            search: this.search
        }
    },
    methods: {
        // 快速删除图片
        switchChange(val) {
            this.deletePic = val
        },
        // 设备模糊查询
        searchButton() {
            if (this.searchValue) {
                this.keyword = this.searchValue
            } else {
                this.keyword = null
            }
            this.init()
        },
        // 手动上传
        uploadChart(row) {
            this.chartId = row.space.id
        },
        // 删除图片
        delectPicture(row) {
            let fileParams = {
                postParams: {
                    keys: [row.space.positionImg]
                }
            }
            deleteFile(fileParams).then(res => {
                this.delectPic(row.space.id)
                this.$message({
                    type: 'success',
                    message: '删除文件成功!'
                })
                this.search()
            })
        },
        // 删除服务器
        Eventdelete(row) {
            if (this.deletePic) {
                this.delectPicture(row)
            } else {
                this.$confirm('确定删除该图片吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                })
                    .then(() => {
                        this.delectPicture(row)
                    })
                    .catch(() => {})
            }
        },
        // 删除库里
        delectPic(id) {
            let params = {
                postParams: [
                    {
                        id: id,
                        positionImg: null,
                        positionImgUploadType: null,
                        positionImgCreateTime: null
                    }
                ]
            }
            manSpacelUpload(params).then(res => {})
        },

        // 批量上传
        uploadFile(e) {
            this.picStatus = []
            this.$refs.StatusUpload.open(null)
            var formData = new FormData()
            formData.append('file', e.file)
            formData.append('key', e.file.name)
            let config = {
                headers: {
                    'sso-token': this.ssoToken,
                    'Content-Type': 'multipart/form-data'
                }
            }
            axios.post('/server/upload', formData, config).then(res => {
                let params = {
                    postParams: [
                        {
                            id: e.file.name.substring(0, e.file.name.indexOf('_')),
                            positionImg: e.file.name,
                            positionImgUploadType: 0
                        }
                    ]
                }
                if (res.data.Result == 'success') {
                    manSpacelUpload(params).then(res => {
                        if (res.result == 'success') {
                            this.queryUpload(params.postParams[0].id, e.file.name, 1)
                            this.$message.success('文件上传成功')
                            this.search()
                        } else {
                            this.queryUpload(params.postParams[0].id, e.file.name, 0)
                            this.$message.error(res.message)
                        }
                    })
                } else {
                    this.queryUpload(params.postParams[0].id, e.file.name, 0)
                    this.$message.error('文件上传失败')
                }
            })
        },
        queryUpload(id, fileName, status) {
            let params = {
                postParams: {
                    criteria: {
                        id: id
                    }
                }
            }
            if (id) {
                querySpace(params).then(res => {
                    let row = res.content ? res.content[0] : {}
                    let name = null,
                        code = null
                    if (Object.keys(row).length > 0) {
                        if (row.localName) {
                            name = row.localName
                        } else if (row.name) {
                            name = row.name
                        } else {
                            name = null
                        }
                        if (row.localId) {
                            code = row.localId
                        } else {
                            code = null
                        }
                    }
                    let obj = {
                        name: name ? name : '--',
                        code: code ? code : '--',
                        fileName: fileName ? fileName : '--',
                        status: status
                    }
                    this.picStatus.push(obj)
                    this.$refs.StatusUpload.open(this.picStatus)
                })
            } else {
                let obj = {
                    name: '--',
                    code: '--',
                    fileName: fileName ? fileName : '--',
                    status: status
                }
                this.picStatus.push(obj)
                this.$refs.StatusUpload.open(this.picStatus)
            }
        },
        // 手动上传
        uploadFileauto(e) {
            let _this = this
            var formData = new FormData()
            formData.append('file', e.file)
            formData.append('key', e.file.name)
            let config = {
                headers: {
                    'sso-token': this.ssoToken,
                    'Content-Type': 'multipart/form-data'
                }
            }
            axios.post('/server/upload', formData, config).then(res => {
                if (res.data.Result == 'success') {
                    _this.$message.success('文件上传成功')
                    let params = {
                        postParams: [
                            {
                                id: this.chartId,
                                positionImg: e.file.name,
                                positionImgUploadType: 1
                            }
                        ]
                    }
                    manSpacelUpload(params)
                    this.search()
                } else {
                    _this.$message.error('文件上传失败')
                }
            })
        },
        // 单个选择位置图片
        selectionChange(selection) {
            this.selectionVal = selection
        },
        // 位置图片全选
        selectAll(selection) {
            this.selectionVal = selection
        },
        // 尚无位置图片的
        checkedChange(val) {
            this.init()
        },
        // 全部位置
        handleItemChange(val) {
            // this.losVal = val
            // this.init()
        },
        // 全部功能类型
        listArrChange(val) {
            // this.equVal = val
            // this.init()
        },
        // 全部位置
        change(val) {
            this.losVal = val
            this.init()
        },
        // 全部生成方式
        TypeChange(val) {
            this.typeValue = val
            this.init()
        },
        // 全部功能类型
        devChange(val) {
            this.equVal = val
            this.init()
        },
        // 查询空间功能类型
        getSpatial() {
            let params = {
                getParams: {}
            }
            querySpatial(params).then(res => {
                this.listArr = res.data
            })
        },
        //时间戳转换
        formatDate(date) {
            return moment.unix(date / 1000).format('YYYY-MM-DD HH:mm')
        },
        pageChanged(page, size) {
            this.pageData.page = page
            this.pageData.size = size
            this.init()
        },
        query() {
            this.pageData.size = 10
            this.pageData.page = 1
            this.init()
        },
        init() {
            this.loading = true
            let criteria = {
                projectId: this.projectId
            }
            if (this.losVal.length > 0) {
                switch (this.losVal.length) {
                    case 1:
                        criteria.buildingId = this.losVal[0]
                        this.loading = true
                        break
                    case 2:
                        criteria.buildingId = this.losVal[0]
                        criteria.floorId = this.losVal[1]
                        this.loading = true
                        break
                    case 3:
                        criteria.buildingId = this.losVal[0]
                        criteria.floorId = this.losVal[1]
                        criteria.id = this.losVal[2]
                        this.loading = true
                        break
                }
            }
            if (this.equVal.length > 0) {
                switch (this.equVal.length) {
                    case 1:
                        criteria.roomFuncType = this.equVal[0]
                        this.loading = true
                        break
                    case 2:
                        criteria.roomFuncType = this.equVal[1]
                        this.loading = true
                        break
                    case 3:
                        criteria.roomFuncType = this.equVal[2]
                        this.loading = true
                        break
                }
            }
            if (this.typeValue == '0' || this.typeValue == '1') {
                criteria.positionImgUploadType = this.typeValue
                this.loading = true
            }
            if (this.checked) {
                criteria.positionImg = {
                    $null: true
                }
                this.loading = true
            }
            if (this.keyword) {
                criteria.keyword = this.keyword
            }
            let params = {
                postParams: {
                    criteria: criteria,
                    page: this.pageData.page,
                    size: this.pageData.size,
                    orders: [
                        {
                            column: 'localName',
                            asc: true
                        }
                    ]
                }
            }
            SearchSpacePosition(params).then(res => {
                if (res.result == 'success') {
                    this.loading = false
                    this.pageData.tableData = res.content
                    this.pageData.total = res.count
                }
            })
        },
        search() {
            let params = {
                postParams: {
                    criteria: {
                        projectId: this.projectId
                    }
                }
            }
            SearchSpaceTotal(params).then(res => {
                this.total = res.total
                this.imgIsNullCount = res.imgIsNullCount
                this.query()
                this.getSpatial()
            })
        },
        automatic() {
            this.$refs.PosSpaceAdmin.open(this.selectionVal, this.pageData.total)
        },
        // 不能生成位置图片的默认不能勾选
        checkSelectable(row, index) {
            let flag = false
            if (row.space && row.floor) {
                if (row.floor.floorMap != undefined && row.space.outLine != undefined) {
                    flag = true
                }
            }
            return flag
        }
    }
}
</script>

<style lang="scss" scoped>
.pos-box {
    .pos-top {
        padding: 0 10px 10px 10px;
        margin-bottom: 10px;
        border-bottom: 1px dashed #606266;
        text-align: right;
    }
    .operation {
        display: flex;
        align-items: center;
        .o-button {
            margin-right: 5px;
        }
    }
}
</style>
