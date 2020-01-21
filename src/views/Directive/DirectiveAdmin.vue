<template>
    <div class="dialog">
        <el-dialog style="font-weight:bold;" v-if="this.num==2" :title="title" :visible.sync="dialogFormVisible" @close="close">
            <div class="content">
                <p class="p1">
                    <span class="span3">策略执行日期：</span>
                    <span v-if="ExhibitionData.date">{{`${ExhibitionData.date.substr(0,4)}-${ExhibitionData.date.substr(4,2)}-${ExhibitionData.date.substr(6,2)}`}}</span>
                </p>
                <p class="p1">
                    <span class="span3">策略执行时间：</span>{{row(ExhibitionData.time)}}
                </p>

                <div style="display:flex;">
                    <div style="width:50%">
                        <p>
                            <span class="span3 span2">冷水机组：</span>
                        </p>
                        <p>
                            <span class="span3">开启台数：</span>{{ExhibitionData.chillerNumSetL+'大'+ExhibitionData.chillerNumSetS+'小'}}</p>
                        <p>
                            <span class="span3">出水温度：</span>{{ExhibitionData.chillWaterOutTempSet}}℃</p>
                        <p v-if="ExhibitionData.meanTindoor">
                            <span class="span3">室内温度：</span>{{decimal(ExhibitionData.meanTindoor)}}℃
                        </p>
                    </div>
                    <div>
                        <p>
                            <span class="span1 span2">冷却水泵：</span>
                        </p>
                        <p>
                            <span class="span1">开启台数：</span>{{ExhibitionData.chillPumpNumSetL+'大'+ExhibitionData.chillPumpNumSetS+'小'}}</p>
                        <p>
                            <span class="span1">频率：</span>{{ExhibitionData.coolPumpFreqSet}}Hz</p>
                        <p v-if="ExhibitionData.chCdTDeltaFb">
                            <span class="span1">进出水温差：</span>{{decimal(ExhibitionData.chCdTDeltaFb)}}℃
                        </p>
                    </div>
                    <div></div>
                </div>

                <div style="display:flex;">
                    <div style="width:50%">
                        <p>
                            <span class="span3 span2">冷冻水泵：</span>
                        </p>
                        <p>
                            <span class="span3">开启台数：</span>{{ExhibitionData.coolPumpNumSetL+'大'+ExhibitionData.coolPumpNumSetS+'小'}}</p>
                        <p>
                            <span class="span3">频率：</span>{{ExhibitionData.coolPumpFreqSet}}Hz</p>
                        <p v-if="ExhibitionData.chEvTDeltaFb">
                            <span class="span3">进出水温差：</span>{{decimal(ExhibitionData.chEvTDeltaFb)}}℃
                        </p>
                    </div>
                    <div>
                        <p>
                            <span class="span1 span2">冷却塔：</span>
                        </p>
                        <p>
                            <span class="span1">开启台数：</span>{{ExhibitionData.coolTowerNumSetL+'大'+ExhibitionData.coolTowerNumSetS+'小'}}</p>
                        <p>
                            <span class="span1">频率：</span>{{ExhibitionData.coolTowerFreqSet}}Hz</p>
                        <p v-if="ExhibitionData.ctTOutDelta">
                            <span class="span1">出水温度-湿球温度：</span>{{decimal(ExhibitionData.ctTOutDelta)}}℃
                        </p>
                    </div>
                    <div></div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close" size="small">取消</el-button>
                <el-button type="primary" @click="save(ExhibitionData,num)" size="small">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog v-if="this.num==3" :visible.sync="dialogFormVisible" @close="close">
            <h2 style='text-align:center;padding:60px 0;'>
                确认不同意此条策略的执行？
            </h2>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close" size="small">取消</el-button>
                <el-button type="primary" @click="save(ExhibitionData,num)" size="small">确认</el-button>
            </div>
        </el-dialog>
    </div>

</template>
<script>
import { findQuery, updateQuery } from "@/api/Directive/directive.js";
import { mapGetters } from "vuex";
export default {
    name: "UserEdit",
    data() {
        return {
            title: "确认推送此条策略",
            dialogFormVisible: false,
            ExhibitionData: {},
            num: ""
        };
    },
    computed: {
        ...mapGetters(["projectId"])
    },
    methods: {
        decimal(str) {
            if (typeof str != "number" && typeof str != "string") {
                return str;
            } else {
                if (typeof str == "number") {
                    str = str.toString();
                }
                if (str.indexOf(".") != -1) {
                    return str.slice(0, str.indexOf(".") + 2);
                } else {
                    return str;
                }
            }
        },
        open(data, num) {
            this.dialogFormVisible = true;
            this.ExhibitionData = data;
            this.num = num;
        },
        row(str) {
            if (str == undefined) {
                return;
            } else if (/\./.test(str)) {
                return str
                    .replace(/\d(?=(\d{2})+\.)/g, "$&:")
                    .replace(/\d{2}(?![,.]|$)/g, "$&:");
            } else {
                return str.replace(/\d(?=(\d{2})+$)/g, "$&:");
            }
        },
        save(data, num) {
            // 修改
            let params = {
                postParams: {
                    projectId: data.projectId,
                    status: num,
                    id: data.id
                }
            };
            updateQuery(params).then(res => {
                if (res.result == "success") {
                    this.$message.success("推送此条策略" + "成功");
                    this.dialogFormVisible = false;
                } else if (res.result == "fail") {
                    this.$message.error(this.title + "失败 " + res.message);
                    this.dialogFormVisible = false;
                }
                this.$emit("query");
            });
        },
        close() {
            this.dialogFormVisible = false;
        }
    }
};
</script>
<style lang="scss" scoped>
.content {
    padding-left: 100px;
    .p1 {
        font-weight: bold;
        color: #000;
    }
    .span1 {
        width: 135px;
        display: inline-block;
    }
    .span2 {
        font-weight: bold;
        color: #000;
    }
    .span3 {
        width: 100px;
        display: inline-block;
    }
}
</style>
 