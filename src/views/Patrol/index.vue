<template>
  <div :style="contentStyleObj" class="patrol">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        :label="item.name"
        v-for="(item,index) in tab"
        :key="index"
        :name="item.name"
        :data-objType="item.objType"
      >
        <patrol-equipment ref="PatrolEquipment"></patrol-equipment>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import PatrolEquipment from "./PatrolEquipment"; //设备
export default {
  data() {
    return {
      activeName: "设备",
      contentStyleObj: {
        width: ""
      },
      tab: [
        { name: "设备", objType: ["equip", "equip_class"] },
        { name: "空间", objType: ["space", "space_class"] },
        { name: "系统", objType: ["system", "system_class"] },
        { name: "楼层", objType: ["floor"] },
        { name: "建筑", objType: ["build"] }
      ]
    };
  },
  components: {
    "patrol-equipment": PatrolEquipment
  },
  methods: {
    getWight() {
      this.contentStyleObj.width =
        document.body.clientWidth > 1000
          ? document.body.clientWidth - 255 + "px"
          : document.body.clientWidth - 75 + "px";
    },
    handleClick(tab, event) {
      this.$refs.PatrolEquipment[tab.index].init(tab.$attrs["data-objType"]);
    }
  },
  mounted() {
    this.getWight();
    window.addEventListener("resize", this.getWight);
    this.$refs.PatrolEquipment[0].init(this.tab[0].objType);
  }
};
</script>
