<template>
    <div id='numberOperationOrders'></div>
</template>
<script>
var moment = require('moment')
import 'moment/locale/zh-cn'
import echarts from 'echarts'
import { mapGetters } from 'vuex'

export default {
    name: '',
    props: ['mouth', 'workorderList'],
    data() {
        return {
            newMouth: 0,
            newWorkorderList: {}
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
            let numberOperationOrders = echarts.init(document.getElementById('numberOperationOrders'))
            let option = {
                color: ['#5ad19e'],
                title: {
                    text: `${this.newMouth}月运行工单数统计`,
                    x: 'left',
                    y: 'top',
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'normal',
                        color: '#000'
                    },
                    subtext: '工单数',
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
                        data: ['第一周', '第二周', '第三周', '第四周', '第五周', '第六周'],
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
                        name: '工单数',
                        type: 'bar',
                        barWidth: '30%',
                        data: this.workorderList,
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
            numberOperationOrders.setOption(option)
            setTimeout(() => {
                window.onresize = function() {
                    numberOperationOrders.resize()
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
        workorderList: {
            immediate: true,
            handler(val, old) {
                if (old) {
                    this.workorderList = val
                    this.drawBill()
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
#numberOperationOrders {
    width: 90%;
    height: 85%;
    padding: 5% 0 5% 5%;
}
</style>