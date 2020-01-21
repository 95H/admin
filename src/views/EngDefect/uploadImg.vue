<template>
    <div>
        <div class='detail-enclosure-img'>
            <div v-if='souseArr.length>0'>
                <div class='img-box' v-for='(image,ind) in distinctFile(souseArr)' :key='ind'>
                    <zoom-image :url='`/image-service/common/image_get?systemId=saas&secret=46f869eea8b31d14&key=${image}`'></zoom-image>
                    <i v-if='showTrue && types=="add" || permissionsData.includes("pics")' class='el-icon-delete' @click='handleRemove(image,ind)'></i>
                </div>
                <!-- <div class='img-box' v-if="tempArr.length>0" v-for='(image,ind) in distinctFile(tempArr)' :key='ind+"e"'>
                    <zoom-image :url='`/image-service/common/image_get?systemId=saas&secret=46f869eea8b31d14&key=${image}`'></zoom-image>
                    <i v-if='showTrue' class='el-icon-delete' @click='handleRemove(image,ind)'></i>
                </div>-->
            </div>
            <div v-if='loading' class='img-bg'>
                <i class='el-icon-loading'></i>
            </div>
            <el-upload  v-if="types=='add' || permissionsData.includes('pics')" :on-change='getImage' action='string' list-type='picture-card' accept='image/*' capture='camera'>
                <img src='../../assets/addimg.png' alt />
            </el-upload>
        </div>
    </div>
</template>
<script>
import zoomImage from './zoomImage'
import { deleteFile } from '@/api/Plan/plan.js'
export default {
    data() {
        return {
            showTrue: true,
            loading: false,
            tempArr: []
        }
    },
    components: { zoomImage },
    props: ['souseArr','permissionsData','types'],
    mounted() {},
    methods: {
        distinctFile(a) {
            return Array.from(new Set(a))
        },
        getImage(event) {
            this.loading = true
            this.fileName = new Date().getTime() + '_' + event.name
            let url = '/image-service/common/image_upload?systemId=saas&secret=46f869eea8b31d14&key=' + this.fileName
            let _this = this
            let reader = new FileReader()
            reader.readAsArrayBuffer(event.raw)
            reader.onload = function(e) {
                var xhr = new XMLHttpRequest()
                xhr.open('POST', url)
                xhr.send(reader.result)
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            let src = _this.getPreviewSrc(event.raw)
                            _this.tempArr.push(_this.fileName)
                            _this.souseArr.push(_this.fileName)
                            _this.$emit('setPic', this.souseArr)
                            _this.loading = false
                            _this.showTrue = true
                        }
                    }
                }
            }
        },
        getPreviewSrc(file) {
            if ('URL' in window) {
                var src = window.URL.createObjectURL(file)
                return src
            }
        },
        handleRemove(file, ind) {
            this.$confirm('您确认删除此图片吗?', '确认删除', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'text',
                center: true,
                showClose: false,
                closeOnClickModal: false
            })
                .then(() => {
                    let fileParams = {
                        postParams: {
                            keys: [file]
                        }
                    }
                    deleteFile(fileParams).then(res => {
                        this.souseArr.splice(ind, 1)
                        this.$emit('setPic', this.souseArr)
                        if (res.result == 'success') {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                        } else {
                            this.$message({
                                type: 'error',
                                message: '删除失败'
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
        }
    }
}
</script>
<style lang="less" scoped>
.detail-enclosure-img {
    // margin-left: 32px;
    display: flex;
    flex-wrap: wrap;
    .img-box {
        width: 80px;
        height: 80px;
        display: inline-block;
        margin-right: 15px;
        margin-bottom: 15px;
        border-radius: 12px;
        position: relative;
        .bigImg {
            width: 80px;
            height: 80px;
        }
        i {
            border-radius: 3px;
            cursor: pointer;
        }
        .el-icon-delete {
            font-size: 20px;
            position: absolute;
            top: 0;
            right: 0;
            background: #ffffff;
        }
    }
    .img-bg {
        width: 78px;
        height: 78px;
        line-height: 78px;
        text-align: center;
        display: inline-block;
        i {
            font-size: 40px;
        }
    }
    div {
        display: inline-block;
    }
}
</style>
<style lang="less">
.detail-enclosure-img {
    .el-upload--picture-card {
        width: 80px;
        height: 80px;
        background: #ececf0;
        position: relative;
        .el-icon-plus {
            padding-bottom: 20px;
            position: absolute;
            top: 80px;
            left: 80px;
        }
        img {
            width: 100%;
            height: 100%;
        }
    }
    .is-uploading {
        display: none;
    }
}
</style>