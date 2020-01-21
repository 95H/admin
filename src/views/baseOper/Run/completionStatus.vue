<template>
    <div id='completionStatus'></div>
</template>
<script>
var moment = require('moment')
import 'moment/locale/zh-cn'
import echarts from 'echarts'
import { mapGetters } from 'vuex'

export default {
    name: '',
    props: ['mouth', 'workOrderObj'],
    data() {
        return {
            newMouth: 0
        }
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    components: {},
    mounted() {
        this.newMouth = this.mouth
        this.$nextTick(function() {
            this.drawBill()
        })
    },
    methods: {
        drawBill() {
            let completionStatus = echarts.init(document.getElementById('completionStatus'))
            let option = {
                title: {
                    text: `${this.newMouth}月运行工单完成情况统计`,
                    x: 'left',
                    y: 'top',
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'normal',
                        color: '#000'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(data) {
                        return ` ${data.name}  ：${data.value}<br />  ${data.percent.toFixed(2)} %`
                    }
                },
                legend: {
                    bottom: 0,
                    left: 'center'
                },
                color: ['#5ad19e', '#66b1ff', '#fed44d'],
                stillShowZeroSum: false,
                series: [
                    {
                        name: '工单完成情况统计',
                        type: 'pie',
                        radius: '50%',
                        center: ['50%', '50%'],
                        data: [
                            { value: this.workOrderObj.finishWorkorderSize, name: '按时完成数', percent: this.workOrderObj.finishWorkorderSizeRate },
                            {
                                value: this.workOrderObj.delayFinishWorkorderSize,
                                name: '延期完成数',
                                percent: this.workOrderObj.delayFinishWorkorderSizeRate
                            },
                            { value: this.workOrderObj.restsWorkorderSize, name: '其他', percent: this.workOrderObj.restsWorkorderSizeRate }
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(128, 128, 128, 0.5)'
                            },
                            normal: {
                                label: {
                                    show: true,
                                    formatter: '{c}'
                                },
                                labelLine: {
                                    show: true
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                length: 2
                            }
                            // normal: {
                            //     show: true // show设置线是否显示，默认为true，可选值：true ¦ false
                            // }
                        },
                        label: {
                            normal: {
                                position: 'outer'
                                // show: false
                            }
                        }
                    }
                ]
            }
            completionStatus.setOption(option)
            setTimeout(() => {
                window.onresize = function() {
                    completionStatus.resize()
                }
            }, 10)
        }
    },
    watch: {
        mouth: {
            immediate: true,
            handler(val, old) {
                if (old) {
                    this.newMouth = val
                    this.drawBill()
                }
            }
        },
        workOrderObj: {
            immediate: true,
            handler(val, old) {
                if (old) {
                    this.workOrderObj = val
                    this.drawBill()
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
#completionStatus {
    width: 90%;
    height: 85%;
    padding: 5% 0 5% 5%;
}
</style>