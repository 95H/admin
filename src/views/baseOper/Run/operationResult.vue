<template>
    <div id='operationResult'></div>
</template>
<script>
var moment = require('moment')
import 'moment/locale/zh-cn'
import echarts from 'echarts'
import { mapGetters } from 'vuex'

export default {
    name: '',
    props: ['mouth', 'operatiObj'],
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
            let operationResult = echarts.init(document.getElementById('operationResult'))
            let option = {
                title: {
                    text: `${this.newMouth}月运行单元运行结果统计`,
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
                    },
                    position: 'right'
                },
                legend: {
                    bottom: 0,
                    left: 'center'
                },
                color: ['#ea605a', '#5ad19e'],
                stillShowZeroSum: false,
                series: [
                    {
                        name: '单元运行结果统计',
                        type: 'pie',
                        radius: '50%',
                        center: ['50%', '50%'],
                        data: [
                            {
                                value: this.operatiObj.isAlarmRunSize,
                                name: '发生过异常实例数',
                                percent: this.operatiObj.isAlarmRunSizeRate
                            },
                            {
                                value: this.operatiObj.isNotAlarmRunSize,
                                name: '未发生过异常实例数',
                                percent: this.operatiObj.isNotAlarmRunSizeRate
                            }
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
            operationResult.setOption(option)
            setTimeout(() => {
                window.onresize = function() {
                    operationResult.resize()
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
        operatiObj: {
            immediate: true,
            handler(val, old) {
                if (old) {
                    this.operatiObj = val
                    this.drawBill()
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
#operationResult {
    z-index: 99;
    width: 90%;
    height: 85%;
    padding: 5% 0 5% 5%;
}
</style>