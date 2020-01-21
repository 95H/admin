<template>
    <div class='sgy-select' tabindex='0' @blur='show = false' :style='`width:${width}`'>
        <div class='fill' @click='show = !show' aria-placeholder='请选择缺陷类型'>
            <div class='tags'>
                <div>
                    <!-- <span v-if='value.length == list.length'>
                        全部
                        <i class='el-icon-error' @click='clearSelect("all")'></i>
                    </span> -->

                    <ul class='items'>
                        <span v-for='(item,index) in value' :key='index'>
                            {{getTextByValue(item)}}
                            <i class='el-icon-error' @click='clearSelect(index)'></i>
                        </span>
                    </ul>
                    <span v-if='value.length==0'>请选择缺陷类型</span>
                </div>
            </div>
            <i class='el-icon-arrow-down' :class='{rotate: show}'></i>
        </div>

        <div class='list' v-if='show'>
            <ul>
                <!-- <li class="clear" @click="clearSelect">清空选项</li> -->
                <li v-for='(item, index) in list' :class='{actived: active(item.value)}' :key='index' @click='onClick(item.value)'>
                    <i class='check-tag' v-show='!active(item.value)'></i>
                    <i class='el-icon-check' v-show='active(item.value)'></i>
                    {{item.label}}
                </li>
            </ul>
        </div>
    </div>
</template>


<script>
export default {
    props: {
        value: {},
        list: {
            type: Array,
            default: () => [{}]
        },
        label: '',
        width: {
            type: String,
            default: '350px'
        }
    },
    data() {
        return {
            show: false
        }
    },

    computed: {},

    mounted() {},

    methods: {
        active(val) {
            return this.value.includes(val)
        },
        onClick(val) {
            if (this.active(val)) {
                // 取消选中
                const index = this.value.indexOf(val)
                this.value.splice(index, 1)
            } else {
                this.value.push(val)
            }
            this.$emit('input', this.value)
        },
        clearSelect(index) {
            if (index == 'all') {
                this.$emit('input', [])
            } else {
                this.value.splice(index, 1)
            }
        },
        getTextByValue(value) {
            const item = this.list.find(i => i.value == value)
            return item ? item.label : ''
        }
    }
}
</script>

<style scoped lang="scss">
.rotate {
    transform: rotate(180deg);
    margin-right: 10px;
}
.sgy-select {
    outline: none;
    width: 350px;
    position: relative;
    z-index: 5;
    .fill {
        vertical-align: middle;
        width: 100%;
        height: 26px;
        border-radius: 4px;
        box-shadow: none;
        border: 1px solid #ccc;
        padding: 0 2px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover {
            border-color: #dcdfe6;
        }
        &:active,
        &:focus {
            outline: none;
            border-color: #2d8cf0;
        }
        i.rotate,
        .el-icon-arrow-down {
            font-size: 14px;
            margin-right: 10px;
            transition: transform 0.3s ease-in-out;
        }

        .tags {
            > div {
                display: flex;
                // margin-top: 9px;
                label {
                    font-size: 14px;
                    color: #212830;
                    padding-left: 3px;
                }
                span {
                    display: inline-block;
                    font-size: 14px;
                    padding-right: 5px;
                    padding-left: 5px;
                    border-radius: 2px;
                    color: #909399;
                }
                ul {
                    display: inline-block;
                    font-size: 12px;
                    color: #909399;
                    line-height: 18px;
                    padding-left: 5px;
                    list-style: none;
                    span {
                        background-color: #f4f4f5;
                        border: 1px solid #e9e9eb;
                        margin-right: 4px;
                    }
                    i {
                        font-size: 12px;
                        padding-left: 4px;
                        color: #c0c4cc;
                    }
                }
            }
        }
    }
    .list {
        //margin-top: 5px;
        z-index: 6;
        ul {
            padding-left: 20px;
            list-style: none;
            border: 1px solid #e0e0e0;
            box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.12);
            border-radius: 4px;
            background-color: #fff;
            width: 95%;
            position: absolute;
            max-height: 400px;
            overflow: auto;
            .clear {
                color: #728dee;
            }
            li {
                list-style: none;
                padding: 5px 0;
                cursor: pointer;
                &:hover {
                    background-color: #f5f7fa;
                }
                &.actived {
                    color: #2d8cf0;
                }
                i {
                    margin-right: 8px;
                    font-size: 14px;
                    float: right;
                    margin-right: 20px;
                }
            }
        }
    }
}
</style>
