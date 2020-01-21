<template>
    <div id='alarmTimeMethod'></div>
</template>
<script>
var moment = require('moment')
import 'moment/locale/zh-cn'
import echarts from 'echarts'
import { mapGetters } from 'vuex'

export default {
    name: '',
    props: ['mouth'],
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
            let alarmTimeMethod = echarts.init(document.getElementById('alarmTimeMethod'))
            let option = {
                title: {
                    text: `${this.newMouth}月报警时执行方法统计`,
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
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    bottom: 0,
                    left: 'center'
                },
                color: ['#66b1ff', '#5ad19e', '#fed44d'],
                stillShowZeroSum: false,
                series: [
                    {
                        type: 'pie',
                        radius: '50%',
                        center: ['50%', '50%'],
                        data: [{ value: 1, name: '人员执行' }, { value: 2, name: '带工作历的BAx' }, { value: 3, name: '不带工作历的BAx' }],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(128, 128, 128, 0.5)'
                            },
                            normal: {
                                label: {
                                    show: true,
                                    formatter: '{b} : {c} ({d}%)'
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
            alarmTimeMethod.setOption(option)
            setTimeout(() => {
                window.onresize = function() {
                    alarmTimeMethod.resize()
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
        }
    }
}
</script>
<style lang="scss" scoped>
#alarmTimeMethod {
    width: 90%;
    height: 85%;
    padding: 5% 0 5% 5%;
}
</style>