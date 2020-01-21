<template>
    <div class='dialog'>
        <el-dialog title='自动生成位置图片' :visible.sync='dialogFormVisible' @close='close' :close-on-click-modal='false'>
            <el-form ref='form' :model='form'>
                <el-form-item label>
                    <el-radio-group v-model='form.resource'>
                        <el-radio class='radioStyle' label='1'>补全尚缺的位置图片</el-radio>
                        <el-radio class='radioStyle' label='2'>全部重新生成</el-radio>
                        <el-radio v-if='selectionAll.length<=0' class='radioStyle' disabled>为勾选的对象重新生成</el-radio>
                        <el-radio v-else class='radioStyle' label='3'>为勾选的对象重新生成</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div v-for='(item,index) in creatArr' :key='index'>
                <cad-graphy ref='cadgra' @close='close' v-show='cadGraphys' :isUpdata='isUpdata' :indexs='index' :cadWidth='cadWidth' :cadHeight='cadHeight' :dataUrl='`/image-service/common/file_get/${item.floor.floorMap}?systemId=revit`' :point='pointStr(item.equipment.bimLocation)' :id='item.equipment.id'></cad-graphy>
            </div>
            <div v-if='!fetching'>数据请求中，请耐心等待...</div>
            <div slot='footer' class='dialog-footer'>
                <el-button @click='close' size='small'>取消</el-button>
                <el-button @click='save' type='primary' size='small' v-if='fetching'>下载本地</el-button>
                <el-button type='primary' :loading='true' size='small' v-if='!fetching'>下载中</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import cadGraphy from './cad-graphy'
import { mapGetters } from 'vuex'
import { SearchEquipmentPosition } from '@/api/Position/position.js'
export default {
    name: 'posequipmentadmin',
    props: ['total', 'imgIsNullCount'],
    data() {
        return {
            isUpdata: false,
            cadGraphys: false,
            dialogFormVisible: false,
            form: {
                // delivery: false, //是否覆盖手动上传
                resource: '1', //默认生成图片
                xmlFile: '' //上传的文件
            },
            tableData: [],
            selectionAll: [], //传过来的选中的
            cadWidth: 800,
            cadHeight: 500,
            dataUrl: '',
            point: [],
            creatArr: [],
            count: '',
            fetching: true
        }
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    mounted() {},
    components: {
        cadGraphy
    },
    methods: {
        // 手动覆盖上传的图片
        // 需要生成的图片 进入页面需要调用
        async creatImg(num) {
            let criteria = {}
            if (num == 1) {
                criteria = {
                    projectId: this.projectId,
                    positionImg: {
                        $null: true
                    }
                }
            } else if (num == 2) {
                criteria = {
                    projectId: this.projectId
                }
            }
            let params = {
                postParams: {
                    criteria: criteria
                }
            }
            this.selectionVal = []
            let arr = []
            for (let i = 1; true; i++) {
                let resp = await SearchEquipmentPosition({ postParams: { criteria: criteria, page: i, size: 100 } })
                if (resp.content && resp.content.length > 0) {
                    resp.content.forEach(con => this.selectionVal.push(con))
                    if (resp.content.length < 1) {
                        break
                    }
                    let i = 0,
                        j = 0
                    if (this.selectionVal.length == this.imgIsNullCount || this.selectionVal.length == this.total) {
                        this.selectionVal.forEach((item, index) => {
                            if (item.floor && item.equipment) {
                                if (item.floor.floorMap && item.equipment.bimLocation) {
                                    arr.push(item)
                                } else {
                                    j += 1
                                }
                            } else {
                                i += 1
                            }
                        })
                        // 没有合适的生成条件提示一次
                        if (this.selectionVal.length == this.imgIsNullCount && this.selectionVal.length == i + j) {
                            this.$message({
                                showClose: true,
                                message: '不能生成位置图片',
                                type: 'error'
                            })
                            this.fetching = true
                            this.dialogFormVisible = false
                        } else if (this.selectionVal.length == this.total && this.selectionVal.length == i + j) {
                            this.$message({
                                showClose: true,
                                message: '不能生成位置图片',
                                type: 'error'
                            })
                            this.fetching = true
                            this.dialogFormVisible = false
                        }
                    } else {
                        console.log('正在请求数据')
                    }
                } else {
                    break
                }
            }
            this.creatArr = arr
            this.$nextTick(res => {
                this.isUpdata = true
            })
            this.fetching = true
        },
        // 打开本弹框
        open(selectRow, count) {
            this.dialogFormVisible = true
            this.selectionAll = selectRow
            this.count = count
            if (this.selectionAll.length > 0) {
                this.form.resource = '3'
                this.creatArr = this.selectionAll
            }
        },
        close() {
            if (this.fetching) {
                this.form.resource = '1'
                this.isUpdata = false
                this.dialogFormVisible = false
            } else {
                this.dialogFormVisible = false
            }
        },
        save() {
            if (this.form.resource == '1') {
                this.creatImg(1)
                this.fetching = false
            } else if (this.form.resource == '2') {
                this.creatImg(2)
                this.fetching = false
            } else if (this.form.resource == '3') {
                this.isUpdata = true
            }
        },
        // 坐标
        pointStr(str) {
            if (str) {
                return [str.split(',')[0], str.split(',')[1]]
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.dialog {
    .radioStyle {
        display: block;
        margin-bottom: 15px;
    }
}
</style>

 