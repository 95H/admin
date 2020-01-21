export default [{
        path: '/User/index',
        name: '通讯录',
        icon: 'el-icon-fa-bank',
        opts: [{
                name: '查询',
                basic: true,
                permission: 'manage:addressbook:query'
            },
            {
                name: '新增',
                permission: 'manage:addressbook:save'
            },
            {
                name: '修改',
                permission: 'manage:addressbook:update'
            },
            {
                name: '删除',
                permission: 'manage:addressbook:delete'
            }
        ]
    },
    {
        path: '/MonthReport/index',
        name: '月报',
        icon: 'el-icon-fa-bank',
        opts: [{
                name: '查询',
                basic: true,
                permission: 'manage:monthreport:query'
            },
            {
                name: '新增',
                permission: 'manage:monthreport:save'
            },
            {
                name: '删除',
                permission: 'manage:monthreport:delete'
            }

        ]
    },
    {
        path: '/disable/day_busi',
        name: '日常业务',
        disabled: true
    },
    {
        path: '/baseOper',
        name: '无偏运行',
        icon: 'el-icon-fa-bank',
        children: [{
                path: '/baseOper/Run/index',
                name: '运行总览',
                icon: 'el-icon-fa-user',
                opts: [{
                        name: '查询',
                        basic: true,
                        permission: 'manage:runPandect:query'
                    },

                ]
            },
            {
                path: '/baseOper/Warn/index',
                name: '偏差预警',
                icon: 'el-icon-fa-user',
                opts: [{
                    name: '查询',
                    basic: true,
                    permission: 'manage:alarm:query'
                }]
            }, {
                path: '/baseOper/Strate/index',
                name: '策略管理',
                icon: 'el-icon-fa-user',
                opts: [{
                        name: '查询',
                        basic: true,
                        permission: 'manage:strategy:query'
                    },
                    {
                        name: '添加',
                        permission: 'manage:strategy:create'
                    },
                    {
                        name: '修改',
                        permission: 'manage:strategy:update'
                    },
                    {
                        name: '删除',
                        permission: 'manage:strategy:delete'
                    }
                ]
            }
        ]
    },
    {
        path: '/EngDefect/index',
        name: '工程缺陷管理',
        icon: 'el-icon-fa-bank',
        opts: [{
                name: '查询',
                permission: 'workflow:projectDefectst:query'
            },
            {
                name: '创建',
                permission: 'workflow:projectDefectst:create'
            },
            {
                name: '修改',
                permission: 'workflow:projectDefectst:update'
            },
            {
                name: '删除',
                permission: 'workflow:projectDefectst:delete'
            }
        ]
    },
    {
        path: '/Directive/index',
        name: '智能自控指令甄选',
        icon: 'el-icon-fa-bank',
        opts: [{
                name: '查询',
                permission: 'transfer:command:query'
            },
            {
                name: '编辑',
                permission: 'transfer:command:update'
            }
        ]
    },
    {
        path: '/Personnel/index',
        name: '项目问题及建议',
        icon: 'el-icon-fa-bank',
        opts: [{
            name: '查询',
            permission: 'manage:proposal:query'
        }]
    },
    {
        path: '/Integral/index',
        name: '积分级别金币成就',
        icon: 'el-icon-fa-bank',
        opts: [{
            name: '查询',
            permission: 'manage:point:query'
        }]
    },
    {
        path: '/Plan',
        name: '应急管理',
        icon: 'el-icon-fa-bank',
        children: [{
                path: '/Plan/PlanAdministration',
                name: '应急预案管理',
                icon: 'el-icon-fa-user',
                opts: [{
                        name: '查询',
                        basic: true,
                        permission: 'manage:plan:query'
                    },
                    {
                        name: '保存',
                        permission: 'manage:plan:save'
                    },
                    {
                        name: '修改',
                        permission: 'manage:plan:update'
                    },
                    {
                        name: '删除',
                        permission: 'manage:plan:delete'
                    }
                ]
            },
            {
                path: '/Plan/PlanMaster',
                name: '应急事件报告',
                icon: 'el-icon-fa-user',
                opts: [{
                        name: '保存',
                        permission: 'manage:presentation:save'
                    },
                    {
                        name: '修改',
                        permission: 'manage:presentation:update'
                    },
                    {
                        name: '删除',
                        permission: 'manage:presentation:delete'
                    }
                ]
            },
            {
                path: '/Plan/PlanPresentation',
                name: '应急预案掌握情况',
                icon: 'el-icon-fa-user',
                opts: [{
                        name: '查询',
                        permission: 'manage:master:query'
                    },
                    {
                        name: '保存',
                        permission: 'manage:master:saveList'
                    }
                ]
            }
        ]
    },
    {
        path: '/disable/trus_basic',
        name: '托管业务基础设置',
        disabled: true
    },
    {
        path: '/Position/index',
        name: '设备及空间位置图',
        icon: 'el-icon-fa-bank',
        opts: [{
                name: '查询',
                permission: 'object:position:query'
            },
            {
                name: '修改',
                permission: 'object:position:update'
            }
        ]
    },
    {
        path: '/controlRisk/index',
        name: '风控项阈值设置',
        icon: 'el-icon-fa-bank',
        opts: [{
                name: '查询',
                permission: 'transfer:riskDefine:query'
            },
            {
                name: '修改',
                permission: 'transfer:riskDefine:update'
            }
        ]
    },
    {
        path: '/disable/dataplatform_knowlage',
        name: '平台专家知识库',
        disabled: true
    },
    {
        path: '/Patrol/index',
        name: '巡检有效期设定',
        icon: 'el-icon-fa-bank',
        opts: [{
                name: '查询',
                permission: 'fm:inspectionDuration:query'
            },
            {
                name: '修改',
                permission: 'fm:inspectionDuration:update'
            }
        ]
    },
    {
        path: '/Dimen/index',
        name: '维保质保期设定',
        icon: 'el-icon-fa-bank',
        opts: [{
                name: '查询',
                permission: 'fm:maintenanceDuration:query'
            },
            {
                name: '修改',
                permission: 'fm:maintenanceDuration:update'
            }
        ]
    },
    // {
    //     path: '/disable/running',
    //     name: '无偏运行',
    //     disabled: true
    // },
    // {
    //     path: '/Run/index',
    //     name: '运行总览',
    //     icon: 'el-icon-fa-bank',
    //     opts: [{
    //             name: '查询',
    //             basic: true,
    //             permission: 'manage:runPandect:query'
    //         },

    //     ]
    // },
    // {
    //     path: '/Warn/index',
    //     name: '偏差预警',
    //     icon: 'el-icon-fa-bank',
    //     opts: [{
    //         name: '查询',
    //         basic: true,
    //         permission: 'manage:alarm:query'
    //     }]
    // },
    // {
    //     path: '/Strate/index',
    //     name: '策略管理',
    //     icon: 'el-icon-fa-bank',
    //     opts: [{
    //             name: '查询',
    //             basic: true,
    //             permission: 'manage:strategy:query'
    //         },
    //         {
    //             name: '添加',
    //             permission: 'manage:strategy:create'
    //         },
    //         {
    //             name: '修改',
    //             permission: 'manage:strategy:update'
    //         },
    //         {
    //             name: '删除',
    //             permission: 'manage:strategy:delete'
    //         }
    //     ]
    // }
]
