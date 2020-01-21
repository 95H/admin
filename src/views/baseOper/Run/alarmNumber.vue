<template>
    <div id='alarmNumber'></div>
</template>
<script>
var moment = require('moment')
import 'moment/locale/zh-cn'
import echarts from 'echarts'
import { mapGetters } from 'vuex'

export default {
    name: '',
    props: ['mouth', 'workAlarmObj'],
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
        this.$nextTick(function() {
            this.newMouth = this.mouth
            this.drawBill()
        })
    },
    methods: {
        drawBill() {
            let alarmNumber = echarts.init(document.getElementById('alarmNumber'))
            let option = {
                color: ['#ea605a', '#fed44d'],
                title: {
                    text: `${this.newMouth}月各类识别方法识别的报警条数统计`,
                    x: 'left',
                    y: 'top',
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'normal',
                        color: '#000'
                    },
                    subtext: '条数值',
                    subtextStyle: {
                        color: '#000'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['工单识别', '物联网识别'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisTick: {
                            //y轴刻度线
                            show: false
                        },
                        splitLine: {
                            //网格线
                            show: false
                        },
                        axisLabel: {
                            formatter: function() {
                                return ''
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '工单条数值',
                        type: 'bar',
                        barWidth: '10%',
                        data: [this.workAlarmObj.workorderAlarmSize, null],
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: 'black'
                                }
                            }
                        }
                    },
                    {
                        name: '物联网条数值',
                        type: 'bar',
                        barWidth: '10%',
                        data: [null, this.workAlarmObj.sensorAlarmSize],
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: 'black'
                                }
                            }
                        }
                    }
                ]
            }
            alarmNumber.setOption(option)
            setTimeout(() => {
                window.onresize = function() {
                    alarmNumber.resize()
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
        workAlarmObj: {
            immediate: true,
            handler(val, old) {
                if (old) {
                    this.workAlarmObj = val
                    this.drawBill()
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
#alarmNumber {
    width: 90%;
    height: 85%;
    padding: 5% 0 5% 5%;
}
</style>