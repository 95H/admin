<template>
    <span class='enclosure-box'>
        <span class='enclosure'>
            <span v-for='(file,index) in distinctFile(files)' :key='index'>
                <a :href='`/image-service/common/file_get?systemId=saas&secret=46f869eea8b31d14&key=${file}`' target='_blank'>{{file}}</a>
                <i  v-if='types=="add"||permissionsData.includes("files")' class='el-icon-delete' @click='removeFile(file,index)'></i>
            </span>
            <el-upload  v-if='types=="add"||permissionsData.includes("files")' action='string' :on-change='getFile' >
                <i class='el-icon-upload'></i>
            </el-upload>
            <!-- <span>上传附件</span> -->
        </span>
    </span>
</template>

<script>
import { deleteFile } from '@/api/Plan/plan.js'
export default {
    data() {
        return {
            file: '',
            fileName: ''
        }
    },
    props: ['files','permissionsData','types'],
    methods: {
        distinctFile(a) {
            return Array.from(new Set(a))
        },
        // 上传图片或文件
        getFile(event) {
            this.file = event.name
            this.fileName = new Date().getTime() + '_' + event.name
            let url = `/image-service/common/file_upload?systemId=saas&secret=46f869eea8b31d14&key=${this.fileName}`
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
                            _this.files.push(_this.fileName)
                             _this.$emit('setFile', _this.files)
                        }
                    }
                }
            }
        },
        removeFile(file, ind) {
            this.$confirm('您确认删除此文件吗?', '确认删除', {
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
                        this.files.splice(ind, 2)
                        this.$emit('setFile', this.files)
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

<style lang="scss" scoped>
.enclosure-box {
    display: inline-block;
    .enclosure {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        span {
            display: flex;
            align-items: center;
            margin-right: 20px;
            i {
                cursor: pointer;
                font-size: 16px;
            }
        }
    }
}
</style>