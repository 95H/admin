<template>
    <div id='alarmContent'></div>
</template>
<script>
var moment = require('moment')
import 'moment/locale/zh-cn'
import echarts from 'echarts'
import { mapGetters } from 'vuex'

export default {
    name: '',
    props: ['mouth', 'alarmContentObj'],
    data() {
        return {
            newMouth: 0,
            newAlarmContentObj: {}
        }
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    components: {},
    mounted() {
        this.newMouth = this.mouth
        this.$nextTick(function() {
            this.newAlarmContentObj = this.alarmContentObj
            this.drawBill()
        })
    },
    methods: {
        drawBill() {
            let alarmContent = echarts.init(document.getElementById('alarmContent'))
            let option = {
                title: {
                    text: `${this.newMouth}月报警内容统计`,
                    x: 'left',
                    y: 'top',

                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'normal',
                        color: '#000',
                        position: ['10%']
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
                color: ['#ea605a', '#5ad19e', '#66b1ff', '#fed44d'],
                stillShowZeroSum: false,
                series: [
                    {
                        name: '报警内容统计',
                        type: 'pie',
                        radius: '50%',
                        center: ['50%', '43%'],
                        data: [
                            {
                                value: this.newAlarmContentObj.openExecptionalAlarmSize,
                                name: '开启异常',
                                percent: this.newAlarmContentObj.openExecptionalAlarmSizeRate
                            },
                            {
                                value: this.newAlarmContentObj.closeExecptionalAlarmSize,
                                name: '关闭异常',
                                percent: this.newAlarmContentObj.closeExecptionalAlarmSizeRate
                            },
                            {
                                value: this.newAlarmContentObj.execptionalOpenAlarmSize,
                                name: '异常开启',
                                percent: this.newAlarmContentObj.execptionalOpenAlarmSizeRate
                            },
                            {
                                value: this.newAlarmContentObj.execptionalCloseAlarmSize,
                                name: '异常关闭',
                                percent: this.newAlarmContentObj.execptionalCloseAlarmSizeRate
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
                                    formatter: ' {c} '
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
            alarmContent.setOption(option)
            setTimeout(() => {
                window.onresize = function() {
                    alarmContent.resize()
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
        alarmContentObj: {
            immediate: true,
            handler(val, old) {
                if (old) {
                    this.newAlarmContentObj = val
                    this.drawBill()
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
#alarmContent {
    width: 90%;
    height: 85%;
    padding: 5% 0 5% 5%;
}
</style>