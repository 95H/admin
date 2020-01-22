import LayoutMain from '@/layout/Main'
const Plan = () => import('@/views/Plan')
const PlanAdministration = () => import('@/views/Plan/PlanAdministration')
const PlanAdministrationAdmin = () => import('@/views/Plan/PlanAdministrationAdmin')
const PlanMaster = () => import('@/views/Plan/PlanMaster')
const PlanPresentation = () => import('@/views/Plan/PlanPresentation')
const PlanPresentationInput = () => import('@/views/Plan/PlanPresentationInput')








// const MonthReport = () => import("@/views/MonthReport/index.vue")
const Integral = () => import('@/views/Integral/index')
const Personnel = () => import('@/views/Personnel/index')
const Directive = () => import('@/views/Directive/index')
const Position = () => import('@/views/Position/index')
const Dimen = () => import('@/views/Dimen/index')
const Patrol = () => import('@/views/Patrol/index')
const ControlRisk = () => import('@/views/ControlRisk/index')
const baseOper = () => import('@/views/baseOper/index')
const Run = () => import('@/views/baseOper/Run/index')
const Warn = () => import('@/views/baseOper/Warn/index')
const RunDiag = () => import('@/views/baseOper/Warn/run')
const Strate = () => import('@/views/baseOper/Strate/index')
const ModifyStrate = () => import('@/views/baseOper/Strate/modifyStrate')
const NextStrate = () => import('@/views/baseOper/Strate/nextStrate')
const NextSeconds = () => import('@/views/baseOper/Strate/nextSeconds')
const EngDefect = () => import('@/views/EngDefect/index')
const EngCreateMatter = () => import('@/views/EngDefect/engCreateAndEdit')

const Survey = () => import('@/views/survey/index')
const BookNumber = () => import('@/views/bookNumber/index')

export default [{
    path: '*',
    redirect: '/layout/layoutIndex',
    name: 'LayoutMain',
    component: LayoutMain,
    children: [
        // {
        //     path: '/MonthReport/index',
        //     component: MonthReport,
        //     meta: {
        //         breadcrumbs: [{
        //             label: '月报'
        //         }]
        //     }
        // }, 
        {
            path: '/survey/index',
            component: Survey,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    label: '项目通讯录'
                }]
            }
        },
        {
            path: '/bookNumber/index',
            component: BookNumber,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    // label: '项目通讯录'
                }]
            }
        },








        {
            path: '/Directive/index',
            component: Directive,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    label: '智能自控指令甄选'
                }]
            }
        },
        {
            path: '/EngDefect/index',
            component: EngDefect,
            meta: {
                breadcrumbs: [{
                    label: '工程缺陷管理'
                }]
            }
        },
        {
            path: '/EngDefect/engCreateAndEdit',
            component: EngCreateMatter,
            meta: {
                // keepAlive: true,
                breadcrumbs: [{
                    label: '工程缺陷管理',
                    path: '/EngDefect/index'
                }, {
                    label: '新建工程缺陷',
                    path: '/EngDefect/engCreateAndEdit'
                }]
            }
        },
        // {
        //     path: '/EngDefect/engEdit',
        //     component: EngEditMatter,
        //     meta: {
        //         keepAlive: true,
        //         breadcrumbs: [{
        //             label: '工程缺陷管理',
        //             path: '/EngDefect/index'
        //         }, {
        //             label: '编辑工程缺陷',
        //             path: '/EngDefect/engEdit'
        //         }]
        //     }
        // },
        {
            path: '/Plan',
            component: Plan,
            children: [{
                    path: '/Plan/PlanAdministration',
                    component: PlanAdministration,
                    meta: {
                        keepAlive: true,
                        breadcrumbs: [{
                            label: '应急管理'
                        }, {
                            label: '应急预案管理'
                        }]
                    }
                },
                {
                    path: '/Plan/PlanAdministrationAdmin',
                    component: PlanAdministrationAdmin,
                    meta: {
                        keepAlive: true,
                        breadcrumbs: [{
                                label: '应急管理',
                                path: '/Plan/PlanAdministration'
                            },
                            {
                                label: '新增或修改预案'
                            }
                        ]
                    }
                },
                {
                    path: '/Plan/PlanMaster',
                    component: PlanMaster,
                    meta: {
                        keepAlive: true,
                        breadcrumbs: [{
                            label: '应急管理'
                        }, {
                            label: '应急事件报告'
                        }]
                    }
                },
                {
                    path: '/Plan/PlanPresentation',
                    component: PlanPresentation,
                    meta: {
                        keepAlive: true,
                        breadcrumbs: [{
                            label: '应急管理'
                        }, {
                            label: '应急预案掌握情况'
                        }]
                    }
                },
                {
                    path: '/Plan/PlanPresentationInput',
                    component: PlanPresentationInput,
                    meta: {
                        keepAlive: true,
                        breadcrumbs: [{
                                label: '应急预案',
                                path: '/Plan/PlanPresentation'
                            },
                            {
                                label: '录入考试成绩'
                            }
                        ]
                    }
                }
            ]
        },
        {
            path: '/Integral/index',
            component: Integral,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    label: '积分级别金币成就'
                }]
            }
        },
        {
            path: '/Personnel/index',
            component: Personnel,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    label: '项目问题及建议'
                }]
            }
        },
        {
            path: '/Position/index',
            component: Position,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    label: '设备及空间位置图'
                }]
            }
        },
        {
            path: '/Dimen/index',
            component: Dimen,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    label: '维保质保期设定'
                }]
            }
        },
        {
            path: '/Patrol/index',
            component: Patrol,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    label: '巡检有效期设定'
                }]
            }
        },
        {
            path: '/ControlRisk/index',
            component: ControlRisk,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    label: '风控项阈值设置'
                }]
            }
        },
        // 
        {
            path: '/baseOper',
            component: baseOper,
            children: [{
                path: '/baseOper/Run/index',
                component: Run,
                meta: {

                    breadcrumbs: [{
                        label: '无偏运行'
                    }, {
                        label: '运行总览'
                    }]
                }
            }, {
                path: '/baseOper/Warn/index',
                component: Warn,
                meta: {

                    breadcrumbs: [{
                        label: '无偏运行'
                    }, {
                        label: '偏差预警'
                    }]
                }
            }, {
                path: '/baseOper/Warn/runDiag',
                component: RunDiag,
                meta: {

                    breadcrumbs: [{
                        label: '无偏运行'
                    }, {
                        label: '运行诊断'
                    }]
                }
            }, {
                path: '/baseOper/Strate/index',
                component: Strate,
                meta: {
                    breadcrumbs: [{
                        label: '无偏运行'
                    }, {
                        label: '策略管理'
                    }]
                }
            }, {
                path: '/baseOper/Strate/modifyStrate',
                component: ModifyStrate,
                meta: {
                    breadcrumbs: [{
                            label: '策略管理',
                            path: "/Strate/index"
                        },
                        {
                            label: '修改策略'
                        }
                    ]
                }
            }, {
                path: '/baseOper/Strate/nextStrate',
                component: NextStrate,
                meta: {
                    breadcrumbs: [{
                        label: '策略管理',
                        path: "/Strate/index"
                    }, {
                        label: '策略配置'
                    }]
                }
            }, {
                path: '/baseOper/Strate/nextSeconds',
                component: NextSeconds,
                meta: {
                    breadcrumbs: [{
                        label: '策略管理',
                        path: "/Strate/index"
                    }, {
                        label: '策略配置'
                    }]
                }
            }]
        }

    ]
}]
