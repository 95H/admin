<template>
  <div class="per-box">
    <table-page-template>
      <el-table :data="tableData" border stripe style="width: 100%;" slot='table'>
        <el-table-column prop="name" label="反馈人" align="center"></el-table-column>
        <el-table-column prop="lists" label="反馈内容" align="center"></el-table-column>
        <el-table-column prop="times" label="反馈时间" align="center"></el-table-column>
      </el-table>
    </table-page-template>
  </div>

</template>
<script>
export default {
    data() {
        return {
            tableData: [
                {
                    name: "张三",
                    lists: "公共空间遇火逃生应急预案",
                    times: "2019-04-30"
                },
                {
                    name: "张三",
                    lists: "公共空间遇火逃生应急预案",
                    times: "2019-04-30"
                }
            ]
        };
    },
    components: {},
    methods: {}
};
</script>
<style lang="scss">
.per-box {
    .query-form {
        display: none;
    }
}
</style>