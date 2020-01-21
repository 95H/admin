<template>
  <div class="addStrate">
    <el-dialog :title="title" :visible.sync="dialogVisible" width="1200px" center>
      <div class="add-header">
        <div style="float:right">
          <el-button type="primary" size="mini" @click="getData">筛选</el-button>
        </div>
        <el-form :inline="true" slot="form" size="mini">
          <el-form-item label="专业/系统/设备类：">
            <el-cascader
              :options="$store.state.categoryArr.equipmentAll"
              v-model="devValue"
              :show-all-levels="false"
              placeholder="全部专业系统设备类"
              :props="configObj"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="所在建筑/楼层：">
            <el-cascader
              :options="objArr"
              :props="configObj"
              v-model="objValue"
              placeholder="全部位置"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-input v-model="keyword" style="width:300px" placeholder="请输入本地名称/本地编码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <strate-table v-if="activeName" :tableData="tableData" @multipleSelection="section" :activeName='activeName'></strate-table>
      <base-pagination :total="total" :page="page" :size="size" @pageChanged="pageChanged"></base-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确定所选</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import strateTable from "./strateTable";
import { queryEquipment, querySystem } from "@/api/Strategy/strate.js";
import {
  SearchEquipmentPosition,
  querySystemManetPosition,
  queryCategory,
  queryArchitecture,
  querySpace,
  queryFloor
} from "@/api/Position/position.js";
import { mapGetters} from "vuex";
export default {
  components: {
    strateTable
  },
  data() {
    return {
      page: 1,
      size: 10,
      total: 0,
      devValue: "",
      //categoryArr: [],
      values: "",
      objArr: [],
      objValue: "",
      keyword: null,
      tableData: [],
      dialogVisible: false,
      activeName: "first",
      multipleSelection: [],
      configObj: {
        label: "name",
        value: "id",
        checkStrictly: true
      },
      title:"添加系统",
      arr:[], // 当前页选择
      lastArr: [] //最终选择
    };
  },
  computed: {
    ...mapGetters(["projectId"])
  },
  mounted() {
    this.getQuery();
  },
  methods: {
    getData() {
      let criteria = {
        projectId: this.projectId
      };
      if(this.keyword){
        criteria.keyword = this.keyword
      }
      if (this.objValue.length > 0) {
        switch (this.objValue.length) {
          case 1:
            criteria.buildingId = this.objValue[0];
            this.loading = true;
            break;
          case 2:
            criteria.buildingId = this.objValue[0];
            criteria.floorId = this.objValue[1];
            this.loading = true;
            break;
          case 3:
            criteria.buildingId = this.objValue[0];
            criteria.floorId = this.objValue[1];
            criteria.spaceId = this.objValue[2];
            this.loading = true;
            break;
        }
      }
      if (this.devValue.length > 0) {
        switch (this.devValue.length) {
          case 1:
            criteria.majorCategory = this.devValue[0];
            this.loading = true;
            break;
          case 2:
            criteria.majorCategory = this.devValue[0];
            criteria.systemCategory = this.devValue[1];
            this.loading = true;
            break;
          case 3:
            criteria.majorCategory = this.devValue[0];
            criteria.systemCategory = this.devValue[1];
            criteria.equipmentCategory = this.devValue[2];
            this.loading = true;
            break;
        }
      }
      let params = {
        postParams: {
          criteria: criteria,
          orders: [{ column: "localId" }],
          page: this.page,
          size: this.size
        }
      };
      if (this.activeName == "first") {
        querySystemManetPosition(params).then(res => {
          this.tableData = res.content;
          this.total = res.count;
        });
      } else {
        SearchEquipmentPosition(params).then(res => {
          this.tableData = res.content;
          this.total = res.count;
        });
      }
    },
    pageChanged(page, size) {
      this.mergeSelect()
      this.page = page;
      this.size = size;
      this.getData();
    },
    open(activeName) {
      this.dialogVisible = true;
      this.tableData = []
      this.activeName = activeName;
      if(this.activeName=='first'){
        this.title="添加系统"
      }else{
        this.title="添加设备"
      }
    },
    section(arr) {
      this.arr = arr
    },
    mergeSelect() {
      this.lastArr = [...new Set([...this.lastArr, ...this.arr])]
    },
    save() {
      this.mergeSelect()
      this.dialogVisible = false;
      this.$emit("select", this.lastArr);
    },
    //查询位置
    getQuery() {
      let params = {
        postParams: {
          criteria: {
            projectId: this.projectId
          },
          orders: [
            {
              column: "name",
              asc: true
            }
          ]
        }
      };
      queryArchitecture(params).then(res => {
        if (res.content.length > 0) {
          let arr = [];
          res.content.forEach(item => {
            let obj = {
              id: item.id,
              name: item.localName,
              children: []
            };
            arr.push(obj);
            this.getFloor(item.id);
          });
          this.objArr = arr;
          this.count = res.count;
        }
      });
    },
    // 查询楼层
    getFloor(buildingId) {
      let params = {
        postParams: {
          criteria: {
            buildingId: buildingId
          },
          orders: [
            {
              column: "localName",
              asc: false
            }
          ]
        }
      };
      queryFloor(params).then(res => {
        if (res.content) {
          let arr = [];
          res.content.forEach(item => {
            let obj = {
              id: item.id,
              name: item.localName,
              children: []
            };
            arr.push(obj);
            this.getSpace(buildingId, item.id);
          });
          this.objArr.forEach(item => {
            if (item.id == buildingId) {
              item.children = arr;
            }
          });
        }
      });
    },
    // 查询空间
    getSpace(buildingId, floorId) {
      let params = {
        postParams: {
          criteria: {
            floorId: floorId
          },
          orders: [
            {
              column: "localName",
              asc: true
            }
          ]
        }
      };
      querySpace(params).then(res => {
        if (res.content) {
          let arr = [];
          res.content.forEach(item => {
            let obj = {
              id: item.id,
              name: item.localName
            };
            arr.push(obj);
          });
          this.objArr.forEach(item => {
            if (item.id == buildingId) {
              item.children.forEach(ele => {
                if (ele.id == floorId) {
                  ele.children = arr;
                }
              });
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.addStrate {
  .add-header {
    background: #fff;
    padding: 10px 10px 0 10px;
    border: 1px solid #d9d9d9;
    margin-bottom: 10px;
  }
}
</style>
<style lang="scss">
.addStrate {
  .el-dialog {
    height: 600px;
  }
  .el-form-item {
    margin-right: 15px !important;
  }
}
</style>