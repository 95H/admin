import Vue from 'vue'
import Vuex from 'vuex'
import storage from '@/framework/utils/storage'
import layout from '@/layout/store'
import {
    queryCategory,
} from "@/api/Position/position.js";
Vue.use(Vuex)

const KEY_LAST_ROUTE = 'last_route'
const KEY_PROJECT_SELECTED = 'global_project_selected'

export default new Vuex.Store({
    state: {
        ssoToken: null,
        lastRoute: null,
        projectId: null,
        lodingNum: 0,
        categoryArr: [],
        userArr: [],
        statusArr: []
    },
    getters: {
        ssoToken: state => state.ssoToken,
        projectId: state => {
            if (!state.projectId) {
                let pid = storage.get(KEY_PROJECT_SELECTED)
                if (pid) {
                    state.projectId = pid
                }
            }
            return state.projectId
        },
        lastRoute: state => {
            if (!state.lastRoute) {
                let lastRoute = storage.get(KEY_LAST_ROUTE)
                if (lastRoute) {
                    state.lastRoute = lastRoute
                }
            }
            return state.lastRoute
        },
        userArr: state => state.userArr,
        statusArr: state => state.statusArr
    },
    mutations: {
        setSsoToken: (state, val) => (state.ssoToken = val),
        setLastRoute: (state, val) => {
            state.lastRoute = val
            storage.set(KEY_LAST_ROUTE, val)
        },
        setProjectId: (state, val) => {
            state.projectId = val
            storage.set(KEY_PROJECT_SELECTED, val)
        },
        setNum: (state, val) => {
            state.lodingNum += 1
        },
        setEquipmentAll: (state, val) => {
            state.categoryArr = val
        },
        setStatusArr(state, data) {
            state.statusArr = data
        },
        setUserArr(state, data) {
            state.userArr = data
        }
    },
    actions: {
        lodingNumAdd(state) {
            state.commit('setNum')
        },
        loadEquipmentAll(context) {
            let params1 = {
                postParams: {
                    criteria: {
                        level: 1
                    },
                    orders: [{
                        column: "majorName",
                        asc: true
                    }]
                }
            };
            let params2 = {
                postParams: {
                    criteria: {
                        level: 2
                    }
                }
            };
            let params3 = {
                postParams: {
                    criteria: {
                        level: 3
                    }
                }
            };
            queryCategory(params1).then(res1 => {
                let datalist1 = res1.content;
                let arr = [];
                datalist1.forEach(item => {
                    let obj = {
                        id: item.id,
                        name: item.majorName,
                        children: []
                    };
                    arr.push(obj);
                });
                queryCategory(params2).then(res2 => {
                    let datalist2 = res2.content;
                    arr.forEach(val => {
                        datalist2.forEach(item => {
                            let obj = {
                                id: item.id,
                                name: item.systemName,
                                children: []
                            };
                            if (val.id == item.id.substr(0, 2)) {
                                val.children.push(obj);
                            }
                        });
                    });
                    queryCategory(params3).then(res3 => {
                        let datalist3 = res3.content;
                        arr.forEach(val => {
                            val.children.forEach(item => {
                                datalist3.forEach(value => {
                                    let obj = {
                                        id: value.id,
                                        name: value.equipName
                                    };
                                    if (item.id == value.id.substr(0, 4)) {
                                        item.children.push(obj);
                                    }
                                });
                            });
                        });
                        let categoryArr = arr;
                        categoryArr.forEach(val => {
                            if (val.children.length == 0) {
                                val.children = null;
                            } else {
                                val.children.forEach(val2 => {
                                    if (val2.children.length == 0) {
                                        val2.children = null;
                                    }
                                });
                            }
                        });
                        context.commit('setEquipmentAll', {
                            equipmentAll: categoryArr
                        })
                    });
                });
            });
        }
    },
    modules: {
        layout
    }
})
