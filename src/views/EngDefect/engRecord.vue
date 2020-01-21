<template>
    <div class='timeline-box'>
        <el-timeline v-if='workId'>
            <el-timeline-item v-for='(item, index) in list' :key='index' :timestamp='item.timestamp' placement='top' :hide-timestamp='true'>
                <div class='timeline-left' v-if='item.fromTime'>
                    <div class='timeline-person'>
                        <span>修改时间：{{formatterS(item.changeTime)||'--'}}</span>
                        <span>修改人：{{formatterCode(item.userId,userArr1)}}</span>
                    </div>
                    <div class='timeline-time'>
                        <span>
                            {{formatterM(item.fromTime)}}
                            <i class='el-icon-right'></i>
                            {{formatterM(item.toTime)}}
                        </span>
                    </div>
                    <span class='timeline-cont'>{{item.note}}</span>
                </div>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>
<script>
import { updateRecord } from '@/api/EngDefect/EngDefect.js'
import { formatterCode } from '@/framework/utils/formatToClass'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            formatterCode,
            list: [],
            userArr1: []
        }
    },
    computed: {
        ...mapGetters([''])
    },
    props: ['workId'],
    methods: {
        formatterM(date) {
            if (date) {
                return date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)
            }
        },
        formatterS(date) {
            if (date) {
                return (
                    date.substring(0, 4) +
                    '-' +
                    date.substring(4, 6) +
                    '-' +
                    date.substring(6, 8) +
                    '  ' +
                    date.substring(8, 10) +
                    ':' +
                    date.substring(10, 12) +
                    ':' +
                    date.substring(12, 14)
                )
            }
        },
        queryRecord(workId) {
            let params = {
                postParams: {
                    criteria: {
                        workId: workId,
                        code: 'askFinishTime'
                    }
                }
            }
            this.list = []
            updateRecord(params).then(res => {
                this.list = res.content ? res.content : []
            })
        }
    },
    mounted() {
        this.queryRecord(this.workId)
        this.userArr1 = JSON.parse(sessionStorage.getItem('userArr'))
    }
}
</script>
<style lang="less" scoped>
.timeline-box {
    margin: 0 auto;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    height: 450px;
    .timeline-left {
        padding-right: 10px;
        width: 100%;
        .timeline-cont {
            margin-bottom: 30px;
            width: 96%;
            // margin-bottom: 15px;
            color: rgba(28, 29, 31, 1);
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        .timeline-person {
            display: flex;
            margin-bottom: 10px;
            span:nth-of-type(1) {
                width: 60%;
            }
            span:nth-of-type(2) {
                width: 38%;
            }
            span {
                font-size: 12px;
                color: rgba(122, 129, 141, 1);
            }
        }
        .timeline-time {
            // padding: 10px 20px;
            text-align: left;
            margin-bottom: 10px;
        }
    }
}
</style>
<style lang="scss">
.timeline-box {
    .el-timeline-item {
        padding-bottom: 0;
    }
    .timeline-cont {
        text-align: left;
        // padding-left: 5%;
    }
}
</style>