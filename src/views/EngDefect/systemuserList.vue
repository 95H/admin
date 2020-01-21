<template>
    <div>
        <el-option v-for='item in userList' :key='item.value' :label='item.label' :value='item.value'></el-option>
    </div>
</template>
<script>
import userapi from '@/api/system/user'
export default {
    data() {
        return {
            userList: []
        }
    },

    computed: {},

    mounted() {
        this.query()
    },

    methods: {
        query() {
            let params = {
                criteria: {}
            }
            userapi.list(params).then(res => {
                let listArr = [],
                    userArr = []
                listArr = res.content ? res.content : []
                if (listArr.length > 0) {
                    listArr.forEach(el => {
                        let obj = {
                            value: el.ssoId,
                            label: el.realname
                        }
                        this.userList.push(obj)
                    })
                }
            })
        }
    }
}
</script>