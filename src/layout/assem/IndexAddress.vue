<template>
    <div class='address-box'>
        <div class='layout-left-jump' v-for='(item,index) in listArr' :key='index' :style='`  margin-bottom: ${jumpBottom}px`'>
            <div :class='`my-p my-p${index}`' :style='`margin-bottom: ${myBottom}px`'>
                <span></span>
                <span>{{item.title}}</span>
            </div>
            <div class='layout-left-text'>
                <div class='layout-left-text-img' v-for='(item2,index) in item.nameItem' :key='"r"+index'>
                    <span :style='`width:${widthIcon}px;height:${widthIcon}px`' @click='jumpWhere(item2)'>
                        <img :src='item2.itemImd' alt />
                    </span>
                    <span :style='` line-height: ${lineHeight}px;`' @click='jumpWhere(item2)'>{{item2.name}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            listArr: [
                {
                    title: '数字化映射',
                    nameItem: [
                        {
                            itemImd: require('../../assets/img/jiaofuguanli.svg'),
                            name: '交付管理',
                            path: '',
                            herfPath: 'http://adm.sagacloud.cn/'
                        },
                        {
                            itemImd: require('../../assets/img/shebeitaizhang.svg'),
                            name: '设备台帐',
                            path: '',
                            herfPath: `http://39.105.11.0:9900/frame/equipmentSpace?_t=0b5a1b49e72648b894acbd42f4395f68&_u=http://mng.sagacloud.cn/anon/user/checkToken&_l=http://sso.sagacloud.cn`
                        }
                    ]
                },
                {
                    title: '日常工作管理',
                    nameItem: [
                        { itemImd: require('../../assets/img/yunxingguanli.svg'), name: '运行管理', path: '/Run/index', herfPath: '' },
                        {
                            itemImd: require('../../assets/img/gongdanguanli.svg'),
                            name: '工单管理',
                            path: '',
                            herfPath: `http://39.105.11.0:9900/frame/groupWorkOrderManagement?_t=0b5a1b49e72648b894acbd42f4395f68&_u=http://mng.sagacloud.cn/anon/user/checkToken&_l=http://sso.sagacloud.cn`
                        },
                        { itemImd: require('../../assets/img/gongchengquexian.svg'), name: '工程缺陷', path: '', herfPath: '' },
                        {
                            itemImd: require('../../assets/img/jihuaguanli.svg'),
                            name: '计划管理',
                            path: '',
                            herfPath: `http://39.105.11.0:9900/frame/PlanManagement?_t=0b5a1b49e72648b894acbd42f4395f68&_u=http://mng.sagacloud.cn/anon/user/checkToken&_l=http://sso.sagacloud.cn`
                        }
                    ]
                },
                {
                    title: '安全/品质/能耗',
                    nameItem: [
                        {
                            itemImd: require('../../assets/img/anquanjiankong.svg'),
                            name: '安全监控',
                            path: '',
                            herfPath: 'http://hyy.sagacloud.cn/safety/summary'
                        },
                        {
                            itemImd: require('../../assets/img/huanjingguanli.svg'),
                            name: '环境管理',
                            path: '',
                            herfPath: 'http://hyy.sagacloud.cn/environment/main'
                        },
                        {
                            itemImd: require('../../assets/img/nengyuanguanli.svg'),
                            name: '能源管理',
                            path: '',
                            herfPath: 'http://101.200.32.13:9099/'
                        },
                        { itemImd: require('../../assets/img/lengzhanzhikong.svg'), name: '冷站智控', path: '/Directive/index', herfPath: '' }
                    ]
                },
                {
                    title: '数字化信用档案',
                    nameItem: [
                        { itemImd: require('../../assets/img/renyuanguanli.svg'), name: '人员管理', path: '/Plan/PlanPresentation', herfPath: '' },
                        { itemImd: require('../../assets/img/yingjiguanli.svg'), name: '应急管理', path: '/Plan/PlanAdministration', herfPath: '' },
                        { itemImd: require('../../assets/img/daguaishenji.svg'), name: '打怪升级', path: '/Integral/index', herfPath: '' }
                    ]
                },
                {
                    title: '业主交互界面',
                    nameItem: [
                        { itemImd: require('../../assets/img/yuebao.svg'), name: '月报', path: '/Report/index', herfPath: '' },
                        { itemImd: require('../../assets/img/dubanchi.svg'), name: '督办池', path: '', herfPath: '' }
                    ]
                }
            ]
        }
    },
    props: [''],
    computed: {
        ...mapGetters(['projectId', 'ssoToken']),
        widthIcon() {
            if (window.screen.height >= '1080') {
                return 18
            } else {
                return 15
            }
        },
        myBottom() {
            if (window.screen.height >= '1080') {
                return 10
            } else {
                return 2
            }
        },
        jumpBottom() {
            if (window.screen.height >= '1080') {
                return 20
            } else {
                return 7
            }
        },
        lineHeight() {
            if (window.screen.height >= '1080') {
                return 41
            } else {
                return 25
            }
        }
    },
    methods: {
        jumpWhere(item) {
            let permissions = this.$store.state.layout.permissions,
                fmServer = process.env.FM_SERVER,
                hyyServer = 'http://hyy.sagacloud.cn'
            if (item.name == '交付管理') {
                if (this.projectId != 'Pj4419000005') {
                    this.$message.error('当前项目，不支持直接跳转到运维平台，请联系管理员！')
                } else {
                    window.open('http://adm.sagacloud.cn/')
                }
            }
            if (item.name == '设备台帐') {
                if (this.projectId != 'Pj4419000005') {
                    this.$message.error('当前项目，不支持直接跳转到工程物业管理平台，请联系管理员！')
                } else {
                    window.open(
                        `${fmServer}/frame/equipmentSpace?_t=${this.ssoToken}&_u=http://mng.sagacloud.cn/anon/user/checkToken&_l=http://sso.sagacloud.cn`
                    )
                }
            }
            if (item.name == '工单管理') {
                if (this.projectId != 'Pj4419000005') {
                    this.$message.error('当前项目，不支持直接跳转到工程物业管理平台，请联系管理员！')
                } else {
                    window.open(
                        `${fmServer}/frame/groupWorkOrderManagement?_t=${this.ssoToken}&_u=http://mng.sagacloud.cn/anon/user/checkToken&_l=http://sso.sagacloud.cn`
                    )
                }
            }
            if (item.name == '计划管理') {
                if (this.projectId != 'Pj4419000005') {
                    this.$message.error('当前项目，不支持直接跳转到工程物业管理平台，请联系管理员！')
                } else {
                    window.open(
                        `${fmServer}/frame/PlanManagement?_t=${this.ssoToken}&_u=http://mng.sagacloud.cn/anon/user/checkToken&_l=http://sso.sagacloud.cn`
                    )
                }
            }
            if (item.name == '安全监控') {
                if (this.projectId != 'Pj4419000005') {
                    this.$message.error('当前项目，不支持直接跳转到慧云盈平台，请联系管理员！')
                } else {
                    window.open(`${hyyServer}/safety/summary`)
                }
            }
            if (item.name == '环境管理') {
                if (this.projectId != 'Pj4419000005') {
                    this.$message.error('当前项目，不支持直接跳转到慧云盈平台，请联系管理员！')
                } else {
                    window.open(`${hyyServer}/environment/main`)
                }
            }
            if (item.name == '能源管理') {
                if (this.projectId != 'Pj4419000005') {
                    this.$message.error('当前项目，不支持直接跳转到工程物业管理平台平台，请联系管理员！')
                } else {
                    window.open('http://101.200.32.13:9099/')
                }
            }
            if (item.name == '运行管理') {
                if (permissions['manage:runPandect:query']) {
                    this.$router.push('/baseOper/Run/index')
                } else {
                    this.$message.error('您无权限使用运行总览项目功能，请联系管理员！')
                }
            }
            if (item.name == '冷站智控') {
                if (permissions['transfer:command:query']) {
                    this.$router.push('/Directive/index')
                } else {
                    this.$message.error('您无权限使用智能自控指令甄选项目功能，请联系管理员！')
                }
            }
            if (item.name == '人员管理') {
                if (permissions['manage:master:query']) {
                    this.$router.push('/Plan/PlanPresentation')
                } else {
                    this.$message.error('您无权限使用应急预案掌握情况项目功能，请联系管理员！')
                }
            }
            if (item.name == '应急管理') {
                if (permissions['manage:plan:query']) {
                    this.$router.push('/Plan/PlanAdministration')
                } else {
                    this.$message.error('您无权限使用应急预案管理项目功能，请联系管理员！')
                }
            }
            if (item.name == '打怪升级') {
                if (permissions['manage:point:query']) {
                    this.$router.push('/Integral/index')
                } else {
                    this.$message.error('您无权限使用积分级别金币成就项目功能，请联系管理员！')
                }
            }
            if (item.name == '月报') {
                if (permissions['manage:monthreport:query']) {
                    this.$router.push('/MonthReport/index')
                } else {
                    this.$message.error('您无权限使用月报项目功能，请联系管理员！')
                }
            }
        }
    },
    mounted() {
        console.log(this.ssoToken)
    }
}
</script>
<style lang="scss" scoped>
.address-box {
    padding: 10px;
    height: 100%;
    .layout-left-jump {
        .my-p {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            span {
                display: block;
            }
            span:first-child {
                width: 3px;
                height: 14px;
                background: rgba(65, 158, 255, 1);
                margin-right: 8px;
            }
            span:last-child {
                font-size: 16px;
                font-family: MicrosoftYaHei;
                color: rgba(31, 35, 41, 1);
            }
        }
        .my-p1 {
            span:first-child {
                background: rgba(0, 214, 185, 1);
            }
        }
        .my-p2 {
            span:first-child {
                background: rgba(255, 165, 61, 1);
            }
        }
        .my-p3 {
            span:first-child {
                background: rgba(247, 107, 100, 1);
            }
        }
        .my-p4 {
            span:first-child {
                background: rgba(219, 102, 219, 1);
            }
        }
        .layout-left-text {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            padding: 0 10px;
            margin: 0 auto;
            .layout-left-text-img {
                width: 45%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                span:first-child {
                    cursor: pointer;
                    display: inline-block;
                    color: rgba(65, 158, 255, 1);
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                span:last-child {
                    cursor: pointer;
                    display: inline-block;
                    width: 80px;
                    text-align: center;
                    font-family: MicrosoftYaHei;
                    color: rgba(100, 106, 115, 1);
                }
            }
        }
    }
}
</style>