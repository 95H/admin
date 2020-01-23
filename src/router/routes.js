import LayoutMain from '@/layout/Main'
const Survey = () => import('@/views/survey/index')
const BookNumber = () => import('@/views/bookNumber/index')
const FinancialData = () => import('@/views/financialData/index')
const Balance = () => import('@/views/financialData/balance/index')
const Accepted = () => import('@/views/financialData/accepted')
const Paid = () => import('@/views/financialData/paid')
const CopeWith = () => import('@/views/financialData/copeWith')
const Receivable = () => import('@/views/financialData/receivable')
const Stock = () => import('@/views/stock/index')
const Book = () => import('@/views/stock/book')
const Raw = () => import('@/views/stock/raw')
const SelectedTopic = () => import('@/views/selectedTopic')
const CodeMaking = () => import('@/views/codeMaking')
const ToReport = () => import('@/views/toReport/index')
const RegularMeeting = () => import('@/views/regularMeeting')
const Media = () => import('@/views/media')
const Books = () => import('@/views/books')
const FixedAssets = () => import('@/views/fixedAssets')
const CheckWork = () => import('@/views/checkWork')
const Structure = () => import('@/views/structure')
const Issue = () => import('@/views/issue')


export default [{
    path: '*',
    redirect: '/layout/layoutIndex',
    name: 'LayoutMain',
    component: LayoutMain,
    children: [
        {
            path: '/survey/index',
            component: Survey,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    // label: '项目通讯录'
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
            path: '/financialData',
            component: FinancialData,
            children: [
                {
                    path: '/financialData/balance',
                    component: Balance,
                    meta: {
                        keepAlive: true,
                    }
                },
                {
                    path: '/financialData/accepted',
                    component: Accepted,
                    meta: {
                        keepAlive: true,
                    }
                },
                {
                    path: '/financialData/paid',
                    component: Paid,
                    meta: {
                        keepAlive: true,
                    }
                },
                {
                    path: '/financialData/receivable',
                    component: Receivable,
                    meta: {
                        keepAlive: true,
                    }
                },
                {
                    path: '/financialData/copeWith',
                    component: CopeWith,
                    meta: {
                        keepAlive: true,
                    }
                },

            ]
        },
        {
            path: '/issue/index',
            component: Issue,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    // label: '项目通讯录'
                }]
            }
        },
        {
            path: '/stock/index',
            component: Stock,
            children: [
                {
                    path: '/stock/book',
                    component: Book,
                    meta: {
                        breadcrumbs: [{
                            // label: '策略管理',
                            // path: "/Strate/index"
                        }, {
                            // label: '策略配置'
                        }]
                    }
                },
                {
                    path: '/stock/raw',
                    component: Raw,
                    meta: {
                        breadcrumbs: [{
                            // label: '策略管理',
                            // path: "/Strate/index"
                        }, {
                            // label: '策略配置'
                        }]
                    }
                }
            ]
        },
        {
            path: '/selectedTopic/index',
            component: SelectedTopic,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    // label: '项目通讯录'
                }]
            }
        },
        {
            path: '/codeMaking/index',
            component: CodeMaking,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    // label: '项目通讯录'
                }]
            }
        },
        {
            path: '/toReport/index',
            component: ToReport,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    // label: '项目通讯录'
                }]
            }
        },
        {
            path: '/regularMeeting/index',
            component: RegularMeeting,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    // label: '项目通讯录'
                }]
            }
        },
        {
            path: '/media/index',
            component: Media,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    // label: '项目通讯录'
                }]
            }
        },
        {
            path: '/books/index',
            component: Books,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    // label: '项目通讯录'
                }]
            }
        },
        {
            path: '/fixedAssets/index',
            component: FixedAssets,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    // label: '项目通讯录'
                }]
            }
        },
        {
            path: '/checkWork/index',
            component: CheckWork,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    // label: '项目通讯录'
                }]
            }
        },
        {
            path: '/structure/index',
            component: Structure,
            meta: {
                keepAlive: true,
                breadcrumbs: [{
                    // label: '项目通讯录'
                }]
            }
        }
    ]
}]
