'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // SSO_SERVER: '"http://192.168.20.102:8080"'
    SSO_SERVER: '"http://sso.sagacloud.cn"'
})
