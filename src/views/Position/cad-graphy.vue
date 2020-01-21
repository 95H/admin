<template>
    <div>
        <canvas :id='"canvas"+indexs' :width='cadWidth' :height='cadHeight'></canvas>
    </div>
</template>

<script>
// import { SGraphyView, SGraphyScene, SGraphyClockItem } from '@saga-web/graphy/lib'
// import { SPoint } from '@saga-web/base/lib'
// import { SPen, SPainter, SColor } from '@saga-web/draw'
// import { SGraphyRectItem } from 'graphy-mainscene'
// import { LocationPointScene, SpaceItem, ZoneItem, FloorView, DivideFloorScene } from '@saga-web/cad-engine/lib'
export default {
    inject: ['search'],
    props: {
        cadWidth: {
            //图片宽度
            type: Number,
            default: 1000,
            required: false
        },
        cadHeight: {
            //图片高度
            type: Number,
            default: 800,
            required: false
        },
        dataUrl: {
            //url路径
            type: String,
            default: '',
            required: true
        },
        point: {
            //设备坐标
            type: Array,
            default: function() {
                return []
            },
            required: false
        },
        // 坐标的宽
        pointWidth: {
            type: Number,
            default: 2000,
            required: false
        },
        // 生成随机id
        indexs: {
            type: Number,
            default: 0,
            required: false
        },
        // 是否生成图片
        isUpdata: {
            type: true,
            default: 0,
            required: false
        },
        id: {
            type: String,
            default: '',
            required: true
        }
    },
    data() {
        return {
            drawMainScene: null,
            view: {}, //实例化的对象
            name: '' //生成图片的名称
        }
    },
    methods: {
        init() {
            this.creatImg(this.dataUrl, this.point)
        },
        // 生成图片
        // creatImg(dataUrl, point) {
        //     this.view = new SGraphyView('canvas' + this.indexs)
        //     this.drawMainScene = new mainScene(null)
        //     this.drawMainScene
        //         .urlGetData(dataUrl) //获取参数
        //         .then(res => {
        //             this.view.scene = this.drawMainScene
        //             this.view.scene.root.children.forEach(item => {
        //                 item.width = 100 //轮廓线的宽
        //             })
        //             if (point.length == 2) {
        //                 if (point[0] !== 0 || point[1] !== 0) {
        //                     // 新增坐标点位
        //                     let posPoint = new SGraphyRectItem(
        //                         null,
        //                         point[0],
        //                         -point[1],
        //                         this.pointWidth,
        //                         this.pointWidth,
        //                         new SColor('#F56C6C'),
        //                         new SColor('#F56C6C')
        //                     )
        //                     this.view.scene.addItem(posPoint)
        //                 }
        //             }
        //             // 调整比例
        //             this.view.fitSceneToView()
        //             // 下载
        //             this.upLoad()
        //         })
        //         .catch(err => {
        //             this.$message.error(err)
        //             this.$emit('close')
        //         })
        // },
        //
        // let tempArr = this.BSPRelaISPList.map((t, i) => {
        //     if (t.FloorId == this.floorList[this.activeFloor].FloorID && t.ObjectType == this.value) {
        //       return {
        //         RoomLocalName: t.RoomLocalName,
        //         OutLine: t.Outline,
        //         RoomID: t.RoomID,
        //         Color: colorArr[i % colorArr.length],
        //       }
        //     } else {
        //       console.log('internet slow')
        //       return undefined;
        //     }
        //   }).filter(item => item)
        //   this.scene.removeAllZone();
        //   this.scene.addZoneList(tempArr);
        //
        creatImg(dataUrl, point) {
            this.view = new SGraphyView('canvas' + this.indexs)
            if (typeof point[0] == 'string') {
                this.drawMainScene = new LocationPointScene()
            } else {
                this.drawMainScene = new DivideFloorScene()
            }
            this.drawMainScene
                .loadUrl(dataUrl) //获取参数
                .then(res => {
                    this.view.scene = this.drawMainScene
                    if (typeof point[0] == 'string') {
                        if (point[0] !== 0 || point[1] !== 0) {
                            // 新增坐标点位
                            this.drawMainScene.addMarkerList([{ X: 1 * point[0], Y: -point[1] }])
                        }
                    } else {
                        let zone = {
                            OutLine: point,
                            Color: '#3485d6',
                            RoomID: 1,
                            RoomLocalName: '1'
                        }
                        this.drawMainScene.addZoneList([zone])
                    }

                    // 调整比例
                    this.view.fitSceneToView()
                    // 下载
                    this.upLoad()
                })
                .catch(err => {
                    this.$message.error(err)
                    this.$emit('close')
                })
        },
        // 下载png图
        upLoad() {
            // this.name = this.id + '_BIMLocation' + '.png'
            // this.view.update() //至少绘制一次
            // this.view.saveImage(this.name, 'png')
            // this.$nextTick(() => {
            //     setTimeout(() => {
            //         this.$emit('close')
            //     }, 5000)
            //     this.search()
            // })
            this.name = this.id + '_BIMLocation'
            this.view.saveSceneSvg(`${this.name}.svg`, 6400, 4800)
            // this.view.saveSceneSvg(this.name, 3000, 3000)//下载xml
            // this.view.saveImage(this.name, 'png')//下载png
            this.$nextTick(() => {
                setTimeout(() => {
                    this.$emit('close')
                }, 5000)
                this.search()
            })
        }
    },
    watch: {
        isUpdata: function(val) {
            if (val) {
                this.init()
            }
        }
    }
}
</script>