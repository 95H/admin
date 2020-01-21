<template>
  <div class="nextStrate">
    <div class="mod-header">(2/3) 请确定本次需要设置运行计划的运行单元？</div>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="`系统（${length1}个）`" name="first">
        <next-sy-table
          v-if="sysArr"
          :sysArr="sysArr"
          @setTableSy="setTableSy"
          :activeName="activeName"
        ></next-sy-table>
      </el-tab-pane>
      <el-tab-pane :label="`设备（${length2}个）`" name="second">
        <next-eq-table
          v-if="equipmentArr"
          :equipmentArr="equipmentArr"
          @setTableEq="setTableEq"
          :activeName="activeName"
        ></next-eq-table>
      </el-tab-pane>
    </el-tabs>
    <div class="next-center">
      <div class="mod-top">
        <el-dropdown v-if="id" split-button size="small" @click="savePlan" @command="handleCommand">
          更新所选到＜{{unitName}}＞
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @command="1">保存选择的运行单元到新计划组</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button v-else @click="dialogVisible=true" size="small">保存选择的运行单元到新计划组</el-button>
        <el-button type="primary" style="float:right" v-if='activeName=="first"' @click="add">添加系统</el-button>
        <el-button type="primary" style="float:right" v-if='activeName=="second"' @click="add">添加设备</el-button>
      </div>
      <div class="mod-footer">
        <el-button @click="quit">放弃本次设置</el-button>
        <div>
          <el-button @click="backSet">上一步</el-button>
          <el-button type="primary" @click="nextShow">下一步</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="新建计划组" :visible.sync="dialogVisible" width="500px">
      <el-input v-model="names"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </el-dialog>
    <add-strate ref="add" @select="select" :activeName="activeName"></add-strate>
  </div>
</template>

<script>
import strateTable from "./strateTable";
import addStrate from "./addStrate";
import nextEqTable from "./nextEqTable";
import nextSyTable from "./nextSyTable";
import { queryGroup, updateGroup, saveGroup } from "@/api/Strategy/strate.js";
import {
  SearchEquipmentPosition,
  querySystemManetPosition,
  queryCategory,
  queryArchitecture,
  querySpace,
  queryFloor
} from "@/api/Position/position.js";
import { mapGetters } from "vuex";
export default {
  components: { strateTable, addStrate, nextSyTable, nextEqTable },
  data() {
    return {
      activeName: "first",
      names: "",
      dialogVisible: false,
      unitName: "",
      objectList: [],
      saveData: [],
      id: "",
      ids: [],
      sysArr: [],
      equipmentArr: [],
      length1: 0,
      length2: 0,
      sysIdArr: [],
      equipmentIdArr: []
    };
  },
  methods: {
    select(arr) {
      arr.forEach(el => {
        this.ids.push({ objectId: el.equipment.id });
      });

      this.divisionEqAndSy(this.ids);
      //this.savePlan()
    },
    unique(arr) {
      return Array.from(new Set(arr));
    },
    confirm() {
      this.dialogVisible = false;
      let arr = [],
        arrNew = [];
      this.saveData.forEach(el => {
        arr.push(el.equipment.id);
      });
      arrNew = this.unique(arr);
      this.objectList = [];
      arrNew.forEach(item => {
        this.objectList.push({
          objectId: item
        });
      });
      let params = {
        postParams: {
          name: this.names,
          projectId: this.projectId,
          objectList: this.objectList
        }
      };
      saveGroup(params).then(res => {
        if (res.data.result == "success") {
          this.id = res.data.id;
          this.$message.success("保存成功！");
          this.query();
        }
      });
      this.saveData = [];
    },
    setTableEq(saveArr) {
      this.saveData = saveArr.concat(this.sysArr);
      console.log(this.saveData);
       
    },
    setTableSy(saveArr) {
      this.saveData = saveArr.concat(this.equipmentArr);
      console.log(this.saveData);
    },
    backSet() {
      this.$router.push({
        path: "/baseOper/Strate/modifyStrate",
        query: { planId: this.id ,names:this.names}
      });
    },
    quit() {
      this.$router.push("/baseOper/Strate/index");
      localStorage.removeItem("sysArr");
      localStorage.removeItem("equipmentArr");
    },
    nextShow() {
      this.$router.push({
        path: "/baseOper/Strate/nextSeconds",
        query: { planId: this.id }
      });
    },
    add() {
      this.$refs.add.open(this.activeName);
    },
    savePlan() {
      let arr = [],
        arrNew = [];
      this.saveData.forEach(el => {
        arr.push(el.equipment.id);
      });
      arrNew = this.unique(arr);
      this.objectList = [];
      arrNew.forEach(item => {
        this.objectList.push({
          objectId: item
        });
      });
      let params = {
        postParams: {
          id: this.id,
          name: this.unitName,
          projectId: this.projectId,
          objectList: this.objectList
        }
      };
      updateGroup(params).then(res => {
        if (res.data.result == "success") {
          this.$message.success("保存成功！");
          this.query();
        }
      });
      this.saveData = [];
    },
    handleCommand(command) {
      this.dialogVisible = true;
    },
    handleClick() {
      this.equipmentIdArr = JSON.parse(localStorage.getItem("equipmentArr"));
      this.sysArr = JSON.parse(localStorage.getItem("sysArr"));
    },
    query() {
      let params = {
        postParams: {
          criteria: {
            projectId: this.projectId,
            id: this.id
          }
        }
      };
      queryGroup(params).then(res => {
        if (res.data.content) {
          this.ids = res.data.content[0].objectList || [];
          this.unitName = res.data.content[0].name;
          this.divisionEqAndSy(this.ids);
        }
      });
    },
    divisionEqAndSy(ids) {
      this.equipmentIdArr = [];
      this.sysIdArr = [];
      ids.forEach(el => {
        if (el.objectId.slice(0, 2) == "Eq") {
          this.equipmentIdArr.push(el.objectId);
        } else {
          this.sysIdArr.push(el.objectId);
        }
      });
      let params = {
        postParams: {
          criteria: {
            projectId: this.projectId,
            id: this.equipmentIdArr
          },
          orders: [{ column: "localId" }]
        }
      };
      SearchEquipmentPosition(params).then(res => {
        this.equipmentArr = res.content || [];
        localStorage.setItem("equipmentArr", JSON.stringify(this.equipmentArr));
        this.length2 = this.equipmentArr.length;
      });
      let params1 = {
        postParams: {
          criteria: {
            projectId: this.projectId,
            id: this.sysIdArr
          },
          orders: [{ column: "localId" }]
        }
      };
      querySystemManetPosition(params1).then(res => {
        this.sysArr = res.content || [];
        localStorage.setItem("sysArr", JSON.stringify(this.sysArr));
        this.length1 = this.sysArr.length;
      });
      this.saveData = this.equipmentArr.concat(this.sysArr);
      console.log(this.saveData);
    },
    init() {
      if (this.$route.query.resource == 1) {
        this.sysArr = [];
        this.equipmentArr = [];
      }else if(this.$route.query.steps==-1){
        this.sysArr = JSON.parse(localStorage.getItem('sysArr'))
        this.length1 = this.sysArr.length;
        this.equipmentArr = JSON.parse(localStorage.getItem('equipmentArr'))
        this.length2 = this.equipmentArr.length;
      } else {
        if (this.$route.query.id) {
          this.unitName = this.$route.query.name;
          this.id = this.$route.query.id;
          if (this.id) {
            this.query();
          }
        }
      }
      if (this.length1 == 0 && this.length2 != 0) {
        this.activeName = "second";
      }
      if (this.length1 != 0 && this.length2 == 0) {
        this.activeName = "first";
      }
    }
  },
//   watch: {
//     saveData: {
//       deep: true,
//       handler(val, oldVal) {
//         console.log(val);
//         let ids = [];
//         val.forEach(el => {
//           ids.push({ objectId: el.equipment.id });
//         });
//         this.divisionEqAndSy(ids);
//       }
//     }
//   },
  computed: {
    ...mapGetters(["projectId"])
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.nextStrate {
  overflow-y: scroll;
  .mod-header {
    text-align: center;
    font-size: 32px;
    margin-bottom: 40px;
  }
  .next-center {
    .mod-top {
      margin-top: 20px;
    }
    .mod-footer {
      margin-top: 80px;
      display: flex;
      justify-content: space-evenly;
    }
  }
}
</style>
<style lang="scss" >
.nextStrate {
  .el-table__header-wrapper .el-table__header thead tr th {
    background-color: #d9d9d9 !important;
    color: #000;
  }
}
</style>