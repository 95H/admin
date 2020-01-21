<template>
    <div :style="contentStyleObj" class="Indel">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="等级和积分" name="first">
                <integral-achieve ref="IntegralAchieve"></integral-achieve>
            </el-tab-pane>
            <el-tab-pane label="金币" name="second">
                <integral-gold-coin ref="goldCoin"></integral-gold-coin>
            </el-tab-pane>
            <el-tab-pane label="成就" name="third">
                <integral-grade ref="IntegralGrade"></integral-grade>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import IntegralAchieve from './IntegralAchieve' //等级和积分
import IntegralGoldCoin from './IntegralGoldCoin' //金币
import IntegralGrade from './IntegralGrade' //成就
import { ListAch, ProjectAch } from '@/api/Integral/Integral.js'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            activeName: 'first',
            contentStyleObj: {
                width: ''
            }
        }
    },
    computed: {
        ...mapGetters(['projectId'])
    },
    components: {
        'integral-achieve': IntegralAchieve,
        'integral-gold-coin': IntegralGoldCoin,
        'integral-grade': IntegralGrade
    },
    mounted() {
        this.getWight()
        window.addEventListener('resize', this.getWight)
    },
    methods: {
        getWight() {
            this.contentStyleObj.width =
                document.body.clientWidth > 1000 ? document.body.clientWidth - 255 + 'px' : document.body.clientWidth - 75 + 'px'
        },
        handleClick(tab, event) {
            if (tab.label == '等级和积分') {
                this.$refs['IntegralAchieve'].init()
            } else if (tab.label == '金币') {
                this.$refs['goldCoin'].Coin()
            } else if (tab.label == '成就') {
                this.$refs['IntegralGrade'].init()
            }
        }
    }
}
</script>
<style lang="scss">
.Indel {
    .query-form {
        display: none;
    }
}
</style>
