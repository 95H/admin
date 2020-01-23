<template>
  <div class="survey-box">图书管理</div>
</template>
<script>
import { queryItems } from "@/api/User/User.js";

export default {
  data() {
    return {};
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let vm = this;
      let params = {
        postParams: {
          pageNum: 1,
          pageSize: 10
        }
      };
      queryItems(params).then(res => {
        console.log(res)
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.survey-box {
}
</style>