<template>
    <div id='engDefectRing'></div>
</template>
<script>
import echarts from 'echarts'

export default {
    name: '',
    props: ['defectRing'],
    data() {
        return {}
    },
    mounted() {
        this.$nextTick(function() {
            this.drawBill()
        })
    },
    methods: {
        drawBill() {
            let engDefectRing = echarts.init(document.getElementById('engDefectRing'))
            let option = {
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
                color: ['#fed44d', '#5ad19e', '#66b1ff', '#ea605a'],
                stillShowZeroSum: false,
                graphic: [
                    {
                        type: 'text',
                        left: 'center',
                        top: '30%',
                        style: {
                            text: `待解决 \n${this.defectRing.total ? this.defectRing.total : 0} 项`,
                            textAlign: 'center',
                            fill: '#000',
                            fontSize: 14
                        }
                    }
                ],
                series: [
                    {
                        name: '待解决项',
                        type: 'pie',
                        radius: ['40%', '60%'],
                        center: ['50%', '35%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                textStyle: {
                                    // fontSize: '30',
                                    // fontWeight: 'bold'
                                }
                            }
                        },
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
                        },
                        data: [
                            { value: this.defectRing.toApprove, name: '待立项' },
                            { value: this.defectRing.running, name: '进行中' },
                            { value: this.defectRing.toCheck, name: '待审核' },
                            { value: this.defectRing.pausing, name: '暂停' }
                        ]
                    }
                ]
            }

            engDefectRing.setOption(option)
            setTimeout(() => {
                window.onresize = function() {
                    engDefectRing.resize()
                }
            }, 10)
        }
    }
}
</script>
<style lang="scss" scoped>
#engDefectRing {
    width: 100%;
    height: 100%;
}
</style>