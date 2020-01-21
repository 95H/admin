<template>
  <div id="my-month">
     <div class="month-left">
       <ul v-for="(item,index) in monthList" :key="index">
         <li :class="{active:categoryIndex==index}" @click="showReport(index,item)">{{item.month.slice(0,4)}}年{{item.month.slice(4,6)}}月</li>
       </ul>
       <div class="month-left-bottom">
        <el-button size="small " type="primary" icon="el-icon-upload" @click="manageMonth">月报管理</el-button>
       </div>
     </div>
     <div class="month-right">
       <iframe style="width:74vw;height:100%" :src="reportSrc" frameborder="0"></iframe>
     </div>
     <edit-month ref="editMonth" @confirm='getMonthList'></edit-month>
  </div>
</template>

<script>
import editMonth from './editMonth'
import {queryMonthReport,saveMonthReport,deleteMonthReport} from '@/api/Month/month.js'
import { mapGetters } from "vuex"
export default {
  data(){
      return{
        categoryIndex:0,
        monthList:[
        ],
        reportSrc:"",
        date:new Date().getFullYear()+''+(new Date().getMonth()+1),
      }
  },
  components:{editMonth},
  computed: {
      ...mapGetters(["projectId"]),
  },
  methods:{
    manageMonth(row){
       this.$refs.editMonth.open(row)
    },
    showReport(index,item){
      this.categoryIndex = index
      this.reportSrc = item.url
    },
    getMonthList(date){
      this.date = date?date:new Date().getFullYear()+''+(new Date().getMonth()+1)
      let params = {
        postParams:{
           criteria:{
            projectId:this.projectId
          },
          orders:[
            {
              column:"month",
               asc: true
            }
          ]
        }
      }
      queryMonthReport(params).then(res=>{
        if(res.result=='success'){
          this.monthList = res.content
         for(let i in this.monthList){
           if(this.monthList[i].month==this.date){
             this.categoryIndex = i;
             this.reportSrc = this.monthList[i].url
           }
         }
        }
      })
    }
  },
  mounted(){
    this.getMonthList()
  }
}
</script>

<style lang="less" scoped>
#my-month{
  display: flex;
  .month-left{
    width:200px;
    min-width: 200px;
    border:1px solid #ccc;
    position: relative;
    ul,li{
      list-style: none;
      padding:2px 10px;
    }
    ul:hover{
      background: #ccc;
    }
    .active{
      background: #ccc;
    }
    .month-left-bottom{
      position: absolute;
      bottom: 20px;
      left:54px;
    }
  }
  .month-right{
    margin-left:10px;
    border:1px solid #ccc;
  }

}
</style>