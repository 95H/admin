<template>
    <div class='timeLine-look'>
        <el-dialog :visible.sync='dialogFormVisible'>
            <div class='dia-content'>
                <div class='dia-content-left'>
                    <p>节点详情</p>
                    <el-form label-width='100px' class='demo-ruleForm'>
                        <el-form-item label='节点名称:'>
                            <span class='dia-name'>{{nodeObj.title||'--'}}</span>
                        </el-form-item>
                        <el-form-item label='节点说明:'>
                            <span class='dia-span'>{{nodeObj.description||'--'}}</span>
                        </el-form-item>
                        <el-form-item label='节点负责人:'>
                            <span>{{formatterCode(nodeObj.chargeUser,userArr1)||'--'}}</span>
                        </el-form-item>
                        <el-form-item label='要求完成日期:'>
                            <span>{{nodeObj.askFinishTime?formatDate(nodeObj.askFinishTime):'--'}}</span>
                        </el-form-item>
                        <el-form-item label='提醒日期:'>
                            <span>{{nodeObj.noticeTime?formatDate(nodeObj.noticeTime):'--'}}</span>
                        </el-form-item>
                        <el-form-item label='相关附件:'>
                            <span class='enclosure-box' v-for='(file,index) in distinctFile(nodeObj.files)' :key='index'>
                                <a
                                    :href='`/image-service/common/file_get?systemId=saas&secret=46f869eea8b31d14&key=${file}`'
                                    target='_blanck'
                                >{{file}}</a>
                            </span>
                        </el-form-item>
                        <el-form-item label='相关图片:'>
                            <span class='enclosure-box' v-for='(image,index) in distinctFile(nodeObj.pics)' :key='index'>
                                <zoom-image :url='`/image-service/common/image_get?systemId=saas&secret=46f869eea8b31d14&key=${image}`'></zoom-image>
                            </span>
                        </el-form-item>
                    </el-form>
                </div>
                <div class='dia-content-right'>
                    <p class='finish'>要求完成日期修改记录</p>
                    <eng-record v-if="nodeObj.id" ref='engRecord' :workId='nodeObj.id'></eng-record>
                </div>
            </div>
            <span slot='footer' class='dialog-footer'>
                <el-button size='mini' @click='close'>关闭</el-button>
                <el-button v-if='showFlagContinue && !nodeObj.isCheck' size='mini' @click='buttonFirm("continue")' type='primary'>重新打开</el-button>
                <el-button v-if="showFlagOver  && !nodeObj.isCheck" size='mini' @click='buttonFirm("over")' type='primary'>标记完成</el-button>
                <el-button v-if="showFlagOver && nodeObj.isCheck" size='mini' @click='buttonFirm("over")' type='primary'>申请验收</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
var moment = require('moment')
import 'moment/locale/zh-cn'
import { mapGetters } from 'vuex'
import engRecord from './engRecord'
import { formatterCode } from '@/framework/utils/formatToClass'
import { updateWork ,queryRouter} from '@/api/EngDefect/EngDefect.js'
import zoomImage from './zoomImage'
export default {
    name: 'IntegralAcquisition',
    data() {
        return {
            formatterCode,
            dialogFormVisible: false,
            nodeObj: {
                content: '',
                finishTime: '',
                remindTime: '',
                person: ''
            },
            actives: [],
            userArr1: [],
            showFlagOver:false,
            showFlagContinue:false,
        }
    },
    inject: ['init'],
    mounted() {
        this.userArr1 = JSON.parse(sessionStorage.getItem('userArr'))
    },
    computed: {
        ...mapGetters(['projectId']),
        ...mapGetters("layout", [
             "userInfo",
        ]),
    },
    components: { engRecord, zoomImage },
    methods: {
        getQuery(){
            let roles = []
            this.userInfo.roles.forEach(el=>{
                roles.push(el.id)
            })
            let params = {
                postParams:{
                    id:this.nodeObj.id,
                    roles:roles,
                    updateUser:this.userInfo.userId
                }
            }
            queryRouter(params).then(res=>{
                let data = res.content || []
                console.log(res)
                 this.showFlagOver = data.some(el => el.flag == 'over')
                 this.showFlagContinue = data.some(el=>el.flag == 'continue')
            })
        },
        //时间戳转换
        formatDate(date) {
            return moment.unix(date / 1000).format('YYYY-MM-DD')
        },
        open(row) {
            this.dialogFormVisible = true
            if (row) {
                this.nodeObj = row
                this.getQuery()
                if(this.$refs.engRecord){
                 this.$refs.engRecord.queryRecord(this.nodeObj.id)
                }
            }
        },
        distinctFile(a) {
            return Array.from(new Set(a))
        },
        close() {
            this.dialogFormVisible = false
        },
        buttonFirm(status) {
            let roles = []
              this.userInfo.roles.forEach(el=>{
                  roles.push(el.id)
              })
            let params = {
                postParams: {
                    id: this.nodeObj.id,
                    commit: status,
                    updateUser: this.$store.state.layout.userInfo.userId,
                    roles:roles
                }
            }
            updateWork(params).then(res => {
                if (res.result == 'success') {
                    this.$message({
                        type: 'success',
                        message: '设置成功!'
                    })
                    window.location.reload()
                }
            })
            this.init()
            this.dialogFormVisible = false
        }
    }
}
</script>
<style lang='scss' scoped>
.timeLine-look {
    .dia-content {
        width: 100%;
        display: flex;
        .dia-content-left {
            // overflow: auto;
            // height: 420px;
            width: 55%;
            text-align: left;
            p {
                text-align: center;
            }
            .enclosure-box {
                display: block;
            }
            .dia-name {
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                line-clamp: 1;
                -webkit-box-orient: vertical;
            }
            .dia-span {
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                line-clamp: 3;
                -webkit-box-orient: vertical;
            }
        }
        .dia-content-right {
            padding: 0 20px;
            width: 45%;
            height: 420px;
            .finish {
                text-align: center;
            }
        }
    }
}
</style>
<style lang="scss" >
.timeLine-look {
    .el-form-item {
        margin-bottom: 0;
    }
    .el-upload-dragger {
        width: 40px;
        height: 40px;
        border: none;
    }
    .el-dialog {
        width: 900px;
        height: 700px;
    }
    .el-dialog__header {
        display: none;
    }
    .el-upload-dragger .el-icon-upload {
        font-size: 40px;
        margin: 0;
    }
    .el-dialog--center .el-dialog__footer {
        clear: both;
    }
    .el-dialog__footer {
        text-align: center !important;
        margin-top: 120px;
    }
}
</style>