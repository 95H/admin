export default [{
    path: '/survey/index',
    name: '概况',
    icon: 'el-icon-fa-bank',
},
{
    path: '/bookNumber/index',
    name: '书号申报管理',
    icon: 'el-icon-fa-bank',
},
{
    path: '/financialData',
    name: '财务数据管理',
    icon: 'el-icon-fa-bank',
    children: [
        {
            path: '/financialData/balance/index',
            name: '余额管理',
            icon: 'el-icon-fa-user',
        },
        {
            path: '/financialData/accepted/index',
            name: '已收管理',
            icon: 'el-icon-fa-user',
        },
        {
            path: '/financialData/paid/index',
            name: '已付管理',
            icon: 'el-icon-fa-user',
        },
        {
            path: '/financialData/receivable/index',
            name: '应收管理',
            icon: 'el-icon-fa-user',
        },
        {
            path: '/financialData/copeWith/index',
            name: '应付管理',
            icon: 'el-icon-fa-user',
        },
    ]
},
{
    path: '/issue/index',
    name: '发行管理',
    icon: 'el-icon-fa-bank',
},
{
    path: '/stock',
    name: '库存管理',
    icon: 'el-icon-fa-bank',
    children: [
        {
            path: '/stock/book/index',
            name: '图书库存',
            icon: 'el-icon-fa-user',
        },
        {
            path: '/stock/raw/index',
            name: '原材料库存',
            icon: 'el-icon-fa-user',
        }]
},
{
    path: '/selectedTopic/index',
    name: '选题管理',
    icon: 'el-icon-fa-bank',
},
{
    path: '/codeMaking/index',
    name: '造货码洋',
    icon: 'el-icon-fa-bank',
},
{
    path: '/toReport/index',
    name: '要报管理',
    icon: 'el-icon-fa-bank',
},
{
    path: '/regularMeeting/index',
    name: '例会事项管理',
    icon: 'el-icon-fa-bank',
},
{
    path: '/media/index',
    name: '媒体管理',
    icon: 'el-icon-fa-bank',
},
{
    path: '/books/index',
    name: '图书管理',
    icon: 'el-icon-fa-bank',
},
{
    path: '/fixedAssets/index',
    name: '固定资产管理',
    icon: 'el-icon-fa-bank',
},
{
    path: '/checkWork/index',
    name: '考勤管理',
    icon: 'el-icon-fa-bank',
},
{
    path: '/structure/index',
    name: '组织架构',
    icon: 'el-icon-fa-bank',
}
]
