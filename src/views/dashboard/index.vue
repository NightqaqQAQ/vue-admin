<template>
  <div class="dashboard-main">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card class="box-card one" shadow="hover">
          <div slot="header" class="clearfix">
            <span>图片数据</span>
            <el-divider></el-divider>
            <p>总数:{{baseData.imgCount.count}}</p>
            <p>今日增长:{{baseData.imgCountToday.count}}</p>
          </div>
          <div class="box" id="img-echarts"></div>
          <router-link class="btn" :to="{name:'photo'}">详情<i class="el-icon-arrow-right"></i></router-link>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card tow" shadow="hover">
          <div slot="header" class="clearfix">
            <span>学员数据</span>
            <el-divider></el-divider>
            <p>总数:{{baseData.userCount.count}}</p>
            <p>今日入学:{{baseData.userCountToday.count}}</p>
          </div>
          <div class="box" id="user-echarts"></div>
          <router-link class="btn" :to="{name:'student'}">详情<i class="el-icon-arrow-right"></i></router-link>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card three" shadow="hover">
          <div slot="header" class="clearfix">
            <span>新闻数据</span>
            <el-divider></el-divider>
            <p>总数:{{baseData.newsCount.count}}</p>
            <p>今日增长:{{baseData.newsCountToday.count}}</p>
          </div>
          <div class="box" id="news-echarts"></div>
          <router-link class="btn" :to="{name:'news'}">详情<i class="el-icon-arrow-right"></i></router-link>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
var echarts = require("echarts");

import dashboardApi from "@/api/dashboard/index";
export default {
  name: "dasgboard",
  components: {},
  data() {
    return {
      baseData: {
        imgCount: {},
        imgCountToday: {},
        imgCountByDay: [],
        userCount: {},
        userCountToday: {},
        userCountByDay: [],
        newsCount: {},
        newsCountToday: {},
        newsCountByDay: []
      }
    };
  },
  computed: {},
  methods: {
    getDB() {
      dashboardApi.getDashboard().then(res => {
        console.log(res);
        this.baseData = res;
        this.initImg();
        this.initUser();
        this.initnews();
      });
    },
    initImg() {
      //初始化img数据
      var dateArr = this.utilsArr(this.baseData.imgCountByDay)[0];
      var countArr = this.utilsArr(this.baseData.imgCountByDay)[1];
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("img-echarts"));
      // 绘制图表
      myChart.setOption({
        color: "#b92b27",
        title: {
          text: "最近3个月数据图"
        },
        tooltip: {},
        xAxis: {
          data: dateArr,
          axisLabel: {
            rotate: 30
          }
        },
        yAxis: {},
        series: [
          {
            name: "时间",
            type: "bar",
            data: countArr
          }
        ]
      });
    },
    initUser() {
      //初始化学员数据
      var dateArr = this.utilsArr(this.baseData.userCountByDay)[0];
      var countArr = this.utilsArr(this.baseData.userCountByDay)[1];
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("user-echarts"));
      // 绘制图表
      myChart.setOption({
        color: "#71B280",
        title: {
          text: "最近3个月数据图"
        },
        tooltip: {},
        xAxis: {
          data: dateArr,
          axisLabel: {
            rotate: 30
          }
        },
        yAxis: {},
        series: [
          {
            name: "时间",
            type: "line",
            data: countArr
          }
        ]
      });
    },
    initnews() {
      //初始化新闻数据
      var dateArr = this.utilsArr(this.baseData.userCountByDay)[0];
      var countArr = this.utilsArr(this.baseData.userCountByDay)[1];
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("news-echarts"));
      // 绘制图表
      myChart.setOption({
        color: "#20BDFF",
        title: {
          text: "最近3个月数据图"
        },
        tooltip: {},
        xAxis: {
          data: dateArr,
          axisLabel: {
            rotate: 30
          }
        },
        yAxis: {},
        series: [
          {
            name: "时间",
            type: "bar",
            data: countArr
          }
        ]
      });
    },
    utilsArr(data) {
      //修改数据的工具方法
      var dateArr = [];
      var countArr = [];
      data.map(ele => {
        if (ele.date) {
          var arr = ele.date.split("-");
          if (arr.length > 1) {
            var mouth = arr[1].replace("0", "") + "月";
            var date = arr[2].replace("0", "") + "日";
            ele.date = mouth + date;
          }
        }
        dateArr.push(ele.date);
        countArr.push(ele.count);
      });
      return [dateArr, countArr];
    }
  },
  created() {
    this.getDB();
  },
  mounted() {}
};
</script>

<style scoped lang="scss">
.dashboard-main {
  .box-card {
    position: relative;
    margin: 10px;
    color: #fff;
    &.one {
      background-image: linear-gradient(-90deg, #b92b27 0%, #1565c0 100%);
    }
    &.tow {
      background-image: linear-gradient(-90deg, #134e5e 0%, #71b280 100%);
    }
    &.three {
      background-image: linear-gradient(-90deg, #6dd5fa, #2980b9);
    }
    .box {
      background-color: #fff;
      height: 400px;
    }
    .btn {
      position: absolute;
      top: 20px;
      right: 30px;
    }
  }
}
</style>

