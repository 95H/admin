<template>
  <div class="warn-drawer" v-if="detailData">
    <p class="p-style">
      {{detailData.objectName}} {{date.slice(0,4)}}-{{date.slice(4,6)}}-{{date.slice(6,8)}} 偏差报警详情
      <i
        class="el-icon-close"
        style="float:right;"
        @click="close"
      ></i>
    </p>
    <div>
      <div class="text-style" v-if="statusData.length>0">
        <p v-for="(item,index) in statusData" :key="index+'a'">
          <i class="iconfont icon-warning"></i>
          {{item.description}}
          <span>{{formatTime(item.createTime) || "--"}}</span>
        </p>
      </div>
      <p class="text-style" v-else>
        <span>
          <i class="iconfont icon-warning"></i> 开启异常
          <span>2019-09-18 12:20:10</span>
        </span>
      </p>
      <div class="pad-style">
        <p class="title-style">1.设备计划运行时刻与实际运行时刻</p>
        <slider :list="list"></slider>
        <slider :list="list1"></slider>
      </div>
      <div class="pad-style">
        <p class="title-style">2.实际运行曲线</p>
        <div id="myCharts" style="width:100%;height:400px;"></div>
      </div>
      <div class="pad-style">
        <p class="title-style">3.运行工单信息</p>
        <el-table :data="work" style="width: 100%">
          <el-table-column prop="woNumber" label="工单编号" width="300"></el-table-column>
          <el-table-column prop="orderState" label="工单状态">
            <template
              slot-scope="{row}"
            >{{row.orderState==2?'抢单中':(row.orderState==4?'未开始':(row.orderState==5?'执行中':(row.orderState==6?'审核中':(row.orderState==7?'延期完成':(row.orderState==8?'按时完成':(row.orderState==9?'异常结束':(row.orderState==10?'撤销':"--")))))))}}</template>
          </el-table-column>
          <el-table-column prop="personList[0].name" label="执行人"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
var echarts = require("echarts");
import slider from "./slider";
import {
  queryWarn,
  queryWorkOrder,
  hisdataQueryPeriodData
} from "@/api/Warn/warn.js";
import { queryRunTime,queryRealRunTime} from "@/api/Strategy/strate.js";
import { mapGetters } from "vuex";
var moment = require("moment");
import "moment/locale/zh-cn";
export default {
  components: { slider },
  props: ["detailData", "date"],
  data() {
    return {
      //selectedDay 日历
      value: [4, 8],
      marks: {
        0: "00:00",
        4: "04:00",
        8: "08:00",
        15: "15:00",
        18: "18:00",
        24: "24:00"
      },
      statusData: [], //异常状态时间列表
      work: [], //工单表格
      planData: [], //计划
      raelData:[],
      list: [],
      list1:[],
      dataX: [],
      dataY: []
    };
  },
  computed: {
    ...mapGetters(["projectId"])
  },
  methods: {
    close() {
      this.$emit("close");
    },
    formatTime(time) {
      return (
        time.slice(0, 4) +
        "-" +
        time.slice(4, 6) +
        "-" +
        time.slice(6, 8) +
        " " +
        time.slice(8, 10) +
        ":" +
        time.slice(10, 12) +
        ":" +
        time.slice(12, 14)
      );
    },
    formatDay(day) {
      return day.slice(0, 4) + "-" + day.slice(4, 6) + "-" + day.slice(6, 8);
    },
    getStatusTime() {
      let params = {
        criteria: {
          projectId: this.projectId,
          objectId: this.detailData.objectId,
          typeCode:['10001','10002','10003','10004'],
          module:['1','2'],
          createTime: {
            $gte: this.date + "000000",
            $lt: moment
              .unix(
                (new Date(this.formatDay(this.date)).getTime() +
                  24 * 3600 * 1000) /
                  1000
              )
              .format("YYYYMMDDhhmmss")
          }
        }
      };
      queryWarn(params).then(res => {
        this.statusData = res.content;
      });
    },
    //查询工单状态表格
    getWorkOrder() {
      let params = {
        criteria: {
          projectId: this.projectId,
          objectId: this.detailData.objectId,
          scheduleTime: {
            $gte: this.date + "000000",
            $lt: moment
              .unix(
                (new Date(this.formatDay(this.date)).getTime() +
                  24 * 3600 * 1000) /
                  1000
              )
              .format("YYYYMMDDhhmmss")
          },
          orderId: {
            $null: false
          }
        },
        orders: [
          {
            column: "scheduleTime",
            asc: false
          }
        ]
      };
      queryWorkOrder(params).then(res => {
        console.log(res);
        this.work = res.content;
      });
    },
    //点能耗数据
    getPeriods() {
      let params = {
        projectId: this.projectId,
        objectId: this.detailData.objectId,
        // objectId:"Eq441900000580da892fad3811e9a1bd4f910b760287",
        period: "15min",
        startTime: this.date + "000000",
        // startTime:"20191107000000",
        // endTime:"20191108120500"
        endTime: moment
          .unix(
            (new Date(this.formatDay(this.date)).getTime() + 24 * 3600 * 1000) /
              1000
          )
          .format("YYYYMMDD000000")
      };
      hisdataQueryPeriodData(params).then(res => {
        res.data.shift();
        let seriesData = res.data;
        seriesData.forEach(el => {
          this.dataX.push(this.formatTime(el[0]));
          if (el[1] == "-9999") {
            el[1] = null;
          }
          this.dataY.push(el[1]);
        });
        this.drawIt();
      });
    },
    drawIt() {
      let myCharts = echarts.init(document.getElementById("myCharts"));
      var option = {
        tooltip : {
            trigger: 'axis',
            formatter:function(params){
              return params[0].name.slice(0,16) + '<br/>' + parseFloat(params[0].data).toFixed(2) +'KW'
            }
        },
        xAxis: {
          type: "category",
          data: this.dataX,
          axisLabel: {
            formatter: function(value) {
               return value.split(" ")[1].toString().slice(0,5);
            }
          }
        },
        yAxis: {
          type: "value",
          axisLabel:{
            formatter: '{value}KW'
          }
        },
        series: [
          {
            data: this.dataY,
            type: "line"
          }
        ]
      };
      myCharts.setOption(option);
    },
    //计划时间
    getPlanTime() {
      let params = {
        postParams: {
          criteria: {
            id: [this.detailData.objectId],
            date: this.date
          }
        }
      };
      queryRunTime(params).then(res => {
        res.content[0].activities.forEach(el => {
          this.planData.push({
            activityTime1: el.activityTime.slice(8, 14),
            activityType: el.activityType
          });
        });
        this.list = this.handleSegment(this.planData);
      });
    },
     getRealTime(){
      let params = {
        postParams:{
          criteria:{
            projectId:this.projectId,
            objectId:this.detailData.objectId,
            date: this.date
          }
        }
        
      }
      queryRealRunTime(params).then(res=>{
         res.content.forEach(el => {
          this.raelData.push({
            activityTime1: el.activityTime.slice(8, 14),
            activityType: el.activityType
          });
        });
        this.list1 = this.handleSegment(this.raelData);
      })
    },
    handleSegment(list) {
      // 防止后端不排序
      const _list = JSON.parse(JSON.stringify(list)).sort(
        (i, j) => Number(i.activityTime1) - Number(j.activityTime1)
      );
      let result = [];
      let pointer = 0; // 指针，每检测到一个停止，指针+1
      _list.forEach(i => {
        if (!Boolean(result[pointer])) {
          result[pointer] = [];
        }
        result[pointer].push(i);
        if (i.activityType === 2) {
          pointer++;
        }
      });
      return result;
    }
  },
  mounted() {
    this.getStatusTime();
    this.getWorkOrder();
    this.getRealTime();
    this.getPeriods();
    this.getPlanTime();
  }
};
</script>

<style lang="scss" scoped>
.warn-drawer {
  padding: 20px 10px;
  .p-style {
    font-size: 18px;
    font-weight: bold;
    color: #cecece;
  }
  .text-style {
    text-align: center;
  }
  .title-style {
    font-size: 16px;
    padding-top: 20px;
  }
  .block {
    padding: 0 20px;
  }
  .pad-style {
    padding-left: 20px;
  }
}
</style>
<style lang="scss" >
.warn-drawer {
  .el-drawer__header {
    font-size: 20px;
  }
  .el-drawer .rtl {
    width: 900px !important;
  }
  .el-slider__marks-text {
    color: #1989fa;
    font-size: 12px;
  }
  .block {
    margin-top: 20px;
    .el-slider {
      display: inline-block;
      width: 185px;
    }
  }
}
</style>