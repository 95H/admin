<template>
    <div id='engDefect'></div>
</template>
<script>
import echarts from 'echarts'

export default {
    props: ['defectList'],
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
            let engDefect = echarts.init(document.getElementById('engDefect'))
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
                color: ['#fed44d', '#5ad19e', '#66b1ff'],
                stillShowZeroSum: false,
                series: [
                    {
                        type: 'pie',
                        radius: '50%',
                        center: ['50%', '30%'],
                        data: [
                            {
                                value: this.defectList.construction,
                                name: '设计施工缺陷'
                            },
                            {
                                value: this.defectList.quality,
                                name: '设备质量缺陷'
                            },
                            {
                                value: this.defectList.manage,
                                name: '运营过程缺陷'
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
                        },
                        label: {
                            normal: {
                                position: 'outer'
                            }
                        }
                    }
                ]
            }

            engDefect.setOption(option)
            setTimeout(() => {
                window.onresize = function() {
                    engDefect.resize()
                }
            }, 10)
        }
    }
}
</script>
<style lang="scss" scoped>
#engDefect {
    width: 100%;
    height: 100%;
}
</style>