<template>
  <div class="warn">
    <div class="warn-top">
      <el-button type="primary" style="float: right;" size="small" @click="drump">查看所有运行设备</el-button>
    </div>
    <div class="warn-box">
      <div class="box-left">
        <div>
          <p>
            <el-radio v-model="radio" label="1" @change="getData">选择时间段（精确到小时）</el-radio>
          </p>
          <p v-if="radio=='1'" class="pad-style">
            <el-date-picker
              v-model="value1"
              type="datetimerange"
              range-separator="至"
              format="yyyy/MM/dd HH:mm"
              value-format="yyyyMMddHHmm00"
              style="width:360px"
              @change="getData"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </p>
        </div>
        <div>
          <p>
            <el-radio v-model="radio" label="2" @change="getData">选择具体日期</el-radio>
          </p>
          <p v-if="radio=='2'">
            <el-calendar v-model="value2" ref="calendar">
              <template slot="dateCell" slot-scope="{date, data}">
                <p>
                  {{ data.day.split('-').slice(2).join("")}}
                  <br />
                  <span
                    :class="alarmList.includes(data.day)?'isSelected':''"
                    v-if="alarmList.includes(data.day)"
                  >
                    <i class="iconfont icon-yuandianxiao"></i>
                  </span>
                </p>
              </template>
            </el-calendar>
          </p>
        </div>
      </div>
      <div class="box-right">
        <table-page-template>
          <el-form :inline="true" slot="form" size="mini">
            <el-form-item>
              <el-input placeholder="运行单元名称" v-model="unitValue" class="input-with-select">
                <el-button slot="append" @click="getData">筛选</el-button>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="warnValue" placeholder="报警内容" @change="getData" clearable>
                <el-option
                  v-for="item in warnOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="typeValue" placeholder="监测方式" @change="getData" clearable>
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </table-page-template>
        <div class="box" v-for="(item,index) in data" :key="index+'h'">
          <p
            class="textStyle"
            style="color:#ababab"
          >{{item.date.slice(0,4)+'-'+item.date.slice(4,6)+"-"+item.date.slice(6,8)}}</p>
          <div class="card-box">
            <div
              class="smallBox"
              v-for="(eve,ind) in item.itmes"
              :key="ind"
              @click="detail(item.date,eve)"
            >
              <p style="font-size:20px;height:30px;line-height:20px;">{{eve.objectName}}</p>
              <span class="span-style">{{eve.module=='1'?'工单':"传感器"}}</span>
              <p style="height:30px;" v-if="Array.isArray(eve.description)">
                <span
                  class="type"
                  v-for="(item,index) in (new Set(eve.description))"
                  :key="index"
                >{{item}}</span>
              </p>
              <p style="height:30px;" v-else>
                <span class="type">{{eve.description}}</span>
              </p>
              <div style="color:#ababab;margin-top:20px;">
                <p v-if="Array.isArray(eve.createTime)">{{formatTime(eve.createTime[0])}}</p>
                <p v-else>{{formatTime(eve.createTime)}}</p>
                <p v-if="Array.isArray(eve.createTime) && eve.createTime.length>1">...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="drawer-layout" v-if="showDrawer" @click="closeDrawer"></div>
      <div class="drawer" v-if="showDrawer">
        <drawer-warn :detailData="detailData" :date="date" @close="closeDrawer" ref="drawer"></drawer-warn>
      </div>
    </div>
  </div>
</template>

<script>
import drawerWarn from "./drawerWarn";
import { mapGetters } from "vuex";
import { queryWarn, queryDailyCount } from "@/api/Warn/warn.js";
export default {
  components: { drawerWarn },
  data() {
    return {
      alarmList: ["2019-09-30", "2019-10-02", "2019-10-03"],
      value1: [],
      value2: new Date(),
      warnValue: "",
      warnOptions: [
        { label: "开启异常", value: "10003" },
        { label: "关闭异常", value: "10004" },
        { label: "异常开启", value: "10001" },
        { label: "异常关闭", value: "10002" }
      ],
      typeValue: "",
      typeOptions: [
        { label: "传感器", value: "2" },
        { label: "工单", value: "1" }
      ],
      unitValue: null,
      showDrawer: false,
      detailData: {},
      data: [],
      radio: "2",
      date: "",
      curMonthDatePrefix:""
    };
  },
  computed: {
    ...mapGetters(["projectId"])
  },
  watch:{
    value2(){
      this.getData();
      this.curMonthDatePrefix = this.$refs.calendar.curMonthDatePrefix
    },
    curMonthDatePrefix(){
      this.getAlarmDays()
    }
  },
  methods: {
    drump() {
      this.$router.push({ path: "/baseOper/warn/runDiag" });
    },
    getAlarmDays() {
      let params = {
        criteria: {
          projectId: this.projectId,
          startTime: this.createdTimeFormat(this.value2).slice(0,6)+"01",
          endTime: this.createdTimeFormat(this.value2).slice(0,6)+"31",
        }
      };
      this.alarmList = [];
      queryDailyCount(params).then(res => {
        let data = res.content;
        data.forEach(el => {
          if (el.count > 0) {
            this.alarmList.push(this.formatDay(el.date));
          }
        });
      });
    },
    getData() {
      let time1, time2;
      if (this.radio == "1") {
        time1 = this.value1[0];
        time2 = this.value1[1];
      } else {
        time1 = this.createdTimeFormat(this.value2);
        time2 = this.createdTimeFormat(
          new Date(this.value2.getTime() + 24 * 3600 * 1000)
        );
      }
      let params = {
        criteria: {
          projectId: this.projectId,
          createTime: {
            $gte: time1,
            $lt: time2
          },
          typeCode: this.warnValue
            ? this.warnValue
            : ["10001", "10002", "10003", "10004"],
          module: this.typeValue ? this.typeValue : ["1", "2"]
        }
      };
       if(this.unitValue){
        params.criteria.objectName = this.unitValue
      }
      queryWarn(params).then(res => {
        if (res.result == "success") {
          if (res.content) {
            this.data = this.handleData(res.content);
          } else {
            this.data = [];
          }
        }
      });
    },
    handleData(list) {
      let obj = {};
      // 先排序
      const _list = list.sort(
        (i, j) => Number(i.createTime) - Number(j.createTime)
      );
      _list.forEach(i => {
        const date = i.createTime.substr(0, 8);
        if (obj[date]) {
          // 查找 objectId 相等的那一项
          const index = obj[date].findIndex(p => p.objectId === i.objectId);
          if (index > -1) {
            obj[date][index].createTime = [
              ...this.toArray(obj[date][index].createTime),
              i.createTime
            ];
            obj[date][index].description = [
              ...this.toArray(obj[date][index].description),
              i.description
            ];
          } else {
            obj[date].push(i);
          }
        } else {
          obj[date] = [i];
        }
      });
      return Object.entries(obj).map(([key, value]) => {
        return {
          date: key,
          itmes: value
        };
      });
    },
    toArray(val) {
      return Array.isArray(val) ? val : [val];
    },
    detail(date, eve) {
      this.detailData = eve;
      this.date = date;
      this.showDrawer = true;
    },
    closeDrawer() {
      this.showDrawer = false;
    },
    createdTimeFormat(timestamp) {
      let date = timestamp;
      let Y = date.getFullYear();
      let M = date.getMonth() + 1;
      M = M < 10 ? "0" + M : M;
      let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return Y + "" + M + "" + D + "000000";
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
    formatDay(time) {
      return time.slice(0, 4) + "-" + time.slice(4, 6) + "-" + time.slice(6, 8);
    }
  },
  mounted() {
    this.getData();
    this.getAlarmDays();
  }
};
</script>

<style lang="scss" scoped>
.warn {
  width: 100%;
  .warn-top {
    margin-bottom: 10px;
    padding: 10px;
    background: #fff;
    height: 30px;
  }
  .warn-box {
    clear: both;
    display: flex;
    position: relative;
    .box-left {
      width: 400px;
      padding-left: 20px;
      background: #fff;
      .pad-style {
        padding-left: 30px;
      }
      .isSelected {
        color: red;
      }
    }
    .box-right {
      flex: 1;
      margin-left: 10px;
      padding-top: 20px;
      padding-left: 20px;
      background: #fff;
      overflow-y: auto;
      .box {
        .textStyle {
          text-align: center;
        }
        .card-box {
          display: flex;
          flex-wrap: wrap;
          .smallBox {
            width: 220px;
            padding: 20px;
            border: 1px solid #d9d9d9;
            background: #f2f2f2;
            display: inline-block;
            border-radius: 8px;
            text-align: center;
            position: relative;
            margin: 10px;
            .span-style {
              position: absolute;
              top: 10px;
              right: 12px;
            }
            p {
              line-height: 15px;
            }
            .type {
              display: inline-block;
              width: 80px;
            }
          }
        }
      }
    }
    .drawer-layout {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 235px;
      right: 0;
      z-index: 99;
    }
    .drawer {
      position: fixed;
      background: #fff;
      top: 0;
      bottom: 0;
      right: 0;
      width: 600px;
      z-index: 999;
      box-shadow: 0 7px 15px 0 rgba(0, 0, 0, 0.2);
      transition: all 0.5s ease-in-out;
      overflow-y: scroll;
    }
  }
}
</style>
<style lang="scss">
.warn {
  .is-selected {
    color: #1989fa;
  }
  .el-picker-panel {
    width: 500px !important;
  }
  .el-calendar-table .el-calendar-day {
    height: 60px;
    text-align: center;
  }
}
</style>