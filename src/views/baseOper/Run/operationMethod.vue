<template>
    <div id='operationMethod'></div>
</template>
<script>
var moment = require('moment')
import 'moment/locale/zh-cn'
import echarts from 'echarts'
import { mapGetters } from 'vuex'

export default {
    name: '',
    props: ['mouth', 'staffExecuteObj'],
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
            let operationMethod = echarts.init(document.getElementById('operationMethod'))
            let option = {
                title: {
                    text: `${this.newMouth}月运行单元执行方法统计`,
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
                color: ['#fed44d', '#5ad19e', '#66b1ff'],
                stillShowZeroSum: false,
                series: [
                    {
                        name: '单元执行方法统计',
                        type: 'pie',
                        radius: '50%',
                        center: ['50%', '50%'],
                        data: [
                            {
                                value: this.staffExecuteObj.staffExecuteRunSize,
                                name: '人员执行',
                                percent: this.staffExecuteObj.staffExecuteRunSizeRate
                            },
                            {
                                value: this.staffExecuteObj.isBAExecuteRunSize,
                                name: '带工作历的BA系统执行',
                                percent: this.staffExecuteObj.isBAExecuteRunSizeRate
                            },
                            {
                                value: this.staffExecuteObj.isNotBAExecuteRunSize,
                                name: '不带工作历的BA系统执行',
                                percent: this.staffExecuteObj.isNotBAExecuteRunSizeRate
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

            operationMethod.setOption(option)
            setTimeout(() => {
                window.onresize = function() {
                    operationMethod.resize()
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
        staffExecuteObj: {
            immediate: true,
            handler(val, old) {
                if (old) {
                    this.staffExecuteObj = val
                    this.drawBill()
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
#operationMethod {
    width: 90%;
    height: 85%;
    padding: 5% 0 5% 5%;
}
</style>