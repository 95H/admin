<template>
    <div>
        <h4>请稍候...</h4>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import admin from '@/api/system/admin'
import layout from '@/layout/layout'
export default {
    name: 'index',
    props: [],
    data() {
        return {}
    },
    created() {
        let token = this.$route.query.token
        if (token) {
            this.$store.commit('setSsoToken', token)
            admin.loadUserInfo().then(resp => {
                if (resp.result == 'success') {
                    let username = resp.username ? resp.username : '未知用户'
                    let userId = resp.userId
                    let fmPersonId = resp.fmPersonId
                    let roles = resp.roles? resp.roles:[]
                    this.$store.commit('layout/userInfo', { username: username, userId: userId, fmPersonId: fmPersonId,roles:roles })

                    let permissions = resp.permissions ? resp.permissions : []
                    let ps = {}
                    permissions.forEach(item => (ps[item] = true))
                    this.$store.commit('layout/permissions', ps)

                    let projects = resp.projects ? resp.projects : []
                    let pjs = []
                    projects.forEach(p => pjs.push({ id: p.id, name: p.localName }))
                    this.$store.commit('layout/projects', pjs)

                    let currProjectId = this.$store.getters['projectId']
                    if (!currProjectId && pjs.length > 0) {
                        this.$store.commit('setProjectId', pjs[0].id)
                    }

                    this.$store.commit('layout/menus', admin.getCheckedMenus(ps))

                    this.$store.commit('layout/logined', true)

                    let lastRoute = this.$store.getters['lastRoute']
                    if (lastRoute) {
                        this.$router.replace(lastRoute)
                    } else {
                        this.$router.replace('/')
                    }
                } else if (resp.result == 'nouser' || resp.result == 'invalidUser' || resp.result == 'no_app_permission') {
                    let username = '未授权用户'
                    this.$store.commit('layout/userInfo', { username: username })
                    this.$store.commit('layout/permissions', {})
                    this.$store.commit('layout/projects', [])
                    this.$store.commit('layout/menus', [])
                    this.$store.commit('layout/logined', true)
                    this.$router.replace('/system/nouser')
                } else if (resp.result == 'unauthc') {
                    layout.toLoginPage()
                } else {
                    layout.toLoginPage()
                }
            })
        } else {
            layout.toLoginPage()
        }
    },
    mounted() {},
    components: {}
}
</script>
