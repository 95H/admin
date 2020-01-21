<template>
  <div class="Inter">
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      @close="close"
      v-if="dialogFormVisible"
    >
      <page-table
        :total="pageData.total"
        :page="pageData.page"
        :size="pageData.size"
        @pageChanged="pageChanged"
        v-loading="loading"
      >
        <el-table :data="pageData.LogData" border stripe slot="table"  height="450">
          <el-table-column prop="workOrderId" label="工单／事件 ID" width="150" show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="workOrderNumber" label="工单／事件 编号" width="220">
            <template slot-scope="{row}">{{row.workOrderNumber?row.workOrderNumber:''}}</template>
          </el-table-column>
          <el-table-column prop="workOrderTypeName" label="工单／事件 类型" min-width="120"></el-table-column>
          <el-table-column prop="point" label="获得积分" min-width="120"></el-table-column>
          <el-table-column prop="createTime" label="获得时间" width="140">
            <template slot-scope="{row}">{{formatDate(row.createTime)}}</template>
          </el-table-column>
          <el-table-column prop="totalPoint" label="累计积分"></el-table-column>
        </el-table>
      </page-table>
    </el-dialog>
  </div>
</template>
<script>
var moment = require("moment");
import "moment/locale/zh-cn";
import { IntegralLog } from "@/api/Integral/Integral.js";
import { mapGetters } from "vuex";
export default {
  name: "IntegralAcquisition",
  data() {
    return {
      pageData: {
        page: 1,
        size: 20,
        total: 0,
        LogData: []
      },
      title: "积分获取记录",
      dialogFormVisible: false,
      row: {}, //传过来的
      item1: {}, //传过来的
      loading: true
    };
  },
  computed: {
    ...mapGetters(["projectId"])
  },
  methods: {
    pageChanged(page, size) {
      this.pageData.page = page;
      this.pageData.size = size;
      this.init(page, size);
    },
    query() {
      this.pageData.size = 20;
      this.pageData.page = 1;
      this.init();
    },
    //时间戳转换
    formatDate(date) {
      return moment.unix(date / 1000).format("YYYY-MM-DD HH:mm");
    },
    open(row, item1) {
      this.dialogFormVisible = true;
      this.row = row;
      this.item1 = item1;
      this.query();
    },
    // 积分日志查询
    init() {
      let params = {
        postParams: {
          criteria: {
            personId: this.row.personId,
            major: this.item1.code
          },
          orders: [
            {
              column: "createTime",
              asc: false
            }
          ],
          page: this.pageData.page,
          size: this.pageData.size
        }
      };
      IntegralLog(params).then(res => {
        if (res.result == "success") {
          if (res.content) {
            this.loading = false;
            this.pageData.LogData = res.content;
            this.pageData.total = res.count;
          }
        }
      });
    },
    close() {
      this.dialogFormVisible = false;
      this.loading = true;
      this.pageData.LogData = [];
    }
  }
};
</script>
<style lang="scss">
.Inter {
  .el-dialog {
    width: 900px;
    height: 600px;
  }
}
</style>