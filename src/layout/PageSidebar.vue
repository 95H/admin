<template>
    <div id='page-sidebar-wrapper' class='page-sidebar-wrapper'>
        <el-scrollbar style='height:100%'>
            <el-menu
                :collapse='sidebarClosed'
                :default-active='sidebarSelected'
                @open='handleOpen'
                @close='handleClose'
                @select='menuSelect'
                background-color='#364150'
                text-color='#fff'
                active-text-color='#ffd04b'
                unique-opened
                router
                class='sidebar-menu'
            >
                <template v-for='menu in menus'>
                    <el-submenu v-if='menu.children' :index='menu.path' :key='menu.path' class='sidebar-menu-submenu' :disabled='menu.disabled'>
                        <template slot='title'>
                            <i v-if='menu.icon' :class='"el-icon-fa "+ menu.icon'></i>
                            <span>{{menu.name}}</span>
                        </template>
                        <template v-for='submenu in menu.children'>
                            <el-menu-item :index='submenu.path' :key='submenu.path' class='sidebar-menu-item' :disabled='menu.disabled'>
                                <i v-if='submenu.icon' :class='"el-icon-fa "+ submenu.icon'></i>
                                <span slot='title'>{{submenu.name}}</span>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                    <el-menu-item v-else :index='menu.path' :key='menu.path' class='sidebar-menu-item' :disabled='menu.disabled'>
                        <i v-if='menu.icon' :class='"el-icon-fa "+ menu.icon'></i>
                        <span slot='title' v-if='menu.path != null'>{{menu.name}}</span>
                        <span slot='title' v-else style='color:#909399'>{{menu.name}}</span>
                    </el-menu-item>
                </template>
            </el-menu>
        </el-scrollbar>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
    name: 'PageSidebar',
    props: [],
    data() {
        return {}
    },
    computed: {
        ...mapGetters('layout', ['sidebarClosed', 'sidebarSelected', 'permissions', 'menus'])
    },
    methods: {
        ...mapMutations('layout', ['setSidebarSelected']),
        handleOpen(val) {},
        handleClose(val) {},
        menuSelect(index, indexPath) {
            this.setSidebarSelected(index)
        }
    }
}
</script>
<style lang="scss">
.page-sidebar-wrapper {
    .el-scrollbar__wrap {
        overflow-x: hidden;
        overflow: auto !important;
    }
}
</style>