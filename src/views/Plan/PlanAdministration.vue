<template>
    <div :style='contentStyleObj'>
        <div class='bgImg' v-if='this.cardData.length<=0'>
            <table-page-template v-if='this.cardData.length<=0'>
                <el-form :inline='true' slot='form' size='mini' v-if='hasPermission("manage:plan:save")'>
                    <el-form-item>
                        <el-button type='primary' @click='CaseAdd()'>新增预案</el-button>
                    </el-form-item>
                </el-form>
            </table-page-template>
            <div class='bgImg-box'>
                <img src='../../../static/images/no.jpg' alt />
                <p>暂无数据</p>
            </div>
        </div>
        <div class='planadmin' v-if='this.cardData.length>0'>
            <table-page-template v-if='this.cardData.length>0'>
                <el-form :inline='true' slot='form' size='mini' v-if='hasPermission("manage:plan:save")'>
                    <el-form-item>
                        <el-button type='primary' @click='CaseAdd()'>新增预案</el-button>
                    </el-form-item>
                </el-form>
            </table-page-template>
            <div class='box-out'>
                <el-card class='box-card' v-for='(item,index) in cardData' :key='index'>
                    <div slot='header' class='clearfix'>
                        <span class='span1'>
                            {{item.planName}}
                            <span class='span1-1'>简称：{{item.planShortName}}</span>
                        </span>
                        <span class='span2' type='text'>
                            <a
                                class='down'
                                :href='`/image-service/common/file_get?systemId=saas&secret=46f869eea8b31d14&key=${item.fileName}`'
                                target='_blank'
                                v-if='hasPermission("manage:plan:query")'
                            >
                                <i class='el-icon-reading'></i>
                            </a>

                            <a
                                class='down'
                                :href='`/image-service/common/file_get?systemId=saas&secret=46f869eea8b31d14&key=${item.fileName}`'
                                :download='`${item.fileName}`'
                                v-if='hasPermission("manage:plan:update")'
                            >
                                <i class='el-icon-download'></i>
                            </a>
                            <i class='el-icon-edit' v-if='hasPermission("manage:plan:update")' @click='CaseEdit(cardData[index])'></i>
                            <i class='el-icon-delete' v-if='hasPermission("manage:plan:delete")' @click='Casedelete(cardData[index])'></i>
                        </span>
                    </div>
                    <div>
                        <span>上传时间：{{formatDate(item.updateTime)}}</span>
                        <p v-for='(items,index) in item.planAddressBooks' :key='index' v-show='index<3'>
                            <span style='display:inline-block;width:90px;'>{{items.addressBooksName}}</span>
                            <span>{{items.addressBooksPhone}}</span>
                            <span>{{(items.planName+' '+items.role).slice(0,10)}}</span>
                            <span>
                                <el-popover style='display:block' v-if='index==2' placement='top-start' width='340' title='全部联系人' trigger='hover'>
                                    <el-button class='reference' slot='reference' v-show='item.planAddressBooks.length>3'>...</el-button>
                                    <el-table class='textItem' :data='item.planAddressBooks'>
                                        <el-table-column width='100' property='addressBooksName'></el-table-column>
                                        <el-table-column width='120' property='addressBooksPhone'></el-table-column>
                                        <el-table-column property='role'>
                                            <template slot-scope='{row}'>{{(row.planName+' '+row.role).slice(0,10)}}</template>
                                        </el-table-column>
                                    </el-table>
                                </el-popover>
                            </span>
                        </p>
                        <p class='p1' v-if='item.planAddressBooks==""'>
                            <span>联系人已被作废，请重新指定</span>
                            <span @click='CaseEdit(cardData[index])'>前往设定&nbsp;></span>
                        </p>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>
<script>
var moment = require('moment')
import 'moment/locale/zh-cn'
import { mapGetters } from 'vuex'
import { InquiryCase, DeleteCase, deleteFile } from '@/api/Plan/plan.js'
export default {
    data() {
        return {
            contentStyleObj: {
                width: ''
            }, //页面宽度
            cardData: [],
            row: [],
            planAddBooks: []
        }
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    methods: {
        getWight() {
            this.contentStyleObj.width =
                document.body.clientWidth > 1000 ? document.body.clientWidth - 255 + 'px' : document.body.clientWidth - 75 + 'px'
        },
        //时间戳转换
        formatDate(date) {
            return moment.unix(date / 1000).format('YYYY-MM-DD')
        },
        // 查询应急预案
        CaseMeet() {
            this.row = this.$route.query.row
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
                if (res.result == 'success') {
                    if (res.content) {
                        this.cardData = res.content
                    }
                }
            })
        },
        // 编辑--前往设定
        CaseEdit(row) {
            this.$router.push({
                path: 'PlanAdministrationAdmin',
                query: {
                    planName: row.planName,
                    planShortName: row.planShortName,
                    fileName: row.fileName,
                    id: row.id,
                    from: 'isEdit',
                    planAddressBooks: JSON.stringify(row.planAddressBooks)
                }
            })
        },
        // 添加应急预案
        CaseAdd() {
            this.$router.push({
                path: 'PlanAdministrationAdmin',
                query: {
                    from: 'isAdd'
                }
            })
        },
        // 删除应急预案
        Casedelete(item) {
            this.$confirm('确定删除该应急报告吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            })
                .then(() => {
                    let fileParams = {
                        postParams: {
                            keys: [item.fileName]
                        }
                    }
                    deleteFile(fileParams).then(res => {
                        console.log('删除文件成功')
                    })
                    let params = {
                        postParams: {
                            id: item.id
                        }
                    }
                    DeleteCase(params).then(res => {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        })
                        this.CaseMeet()
                    })
                })
                .catch(() => {})
        }
    },
    mounted() {
        this.CaseMeet()
        window.addEventListener('resize', this.getWight)
    }
}
</script>
 <style lang="scss" scoped>
.bgImg {
    width: 100%;
    height: 100%;
    background: #fff;
    position: relative;
    overflow: hidden;
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
.box-out {
    // display: grid;
    // grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    // grid-gap: 10px;
    // grid-template-rows: repeat(4, 260px);
    display: flex;
    flex-wrap: wrap;
    .box-card {
        width: 32.5%;
        min-width: 540px;
        // max-width: 600px;
        // flex: 1;
        margin-right: 10px;
        margin-bottom: 10px;
        // min-width: 500px;
        // height: 280px;
        .clearfix:before,
        .clearfix:after {
            display: table;
            content: '';
        }
        .clearfix:after {
            clear: both;
        }
        .clearfix {
            .span1 {
                font-size: 26px;
                font-weight: bold;
                .span1-1 {
                    font-size: 12px;
                    font-weight: normal;
                }
            }
            .span2 {
                float: right;
                padding: 3px 0;
                i {
                    margin: 0 10px;
                    cursor: pointer;
                }
            }
        }
    }
    .box-card:nth-of-type(3n) {
        // margin-right: 0;
    }
    .p1 {
        display: flex;
        justify-content: space-between;
        margin-top: 40px;
        span:nth-of-type(1) {
            color: red;
        }
        span:nth-of-type(2) {
            color: #459efc;
            cursor: pointer;
        }
    }
}

.reference {
    border: none;
    padding: 0;
}
i {
    margin-right: 20px;
    font-size: 16px;
    cursor: pointer;
}
.down {
    color: #606266;
}
</style>
<style lang="scss">
.el-card__body {
    padding-top: 10px !important;
    padding-bottom: 0 !important;
    font-size: 10px;
    p {
        font-size: 16px;
        span {
            margin-right: 10px;
        }
    }
}
.textItem {
    thead {
        display: none;
    }
}
</style>
