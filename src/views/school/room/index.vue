<template>
  <div class="room-main">
    <el-card class="box-card" shadow="hover">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="search.roomName" size="small" style="width:220px" placeholder="请输入宿舍名"></el-input>
        </el-col>
        <el-col :span="12">
          <el-date-picker
            size="small"
            v-model="search.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button @click="reset" size="small">重置</el-button>
          <el-button @click="getRoomList" type="primary" size="small">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <el-button type="primary" size="small" @click="addRoom(false)">新增宿舍</el-button>
      </div>
      <el-table :data="roomListCom" border style="width: 100%" v-loading="loading">
        <el-table-column fixed label="#" type="index"></el-table-column>
        <el-table-column prop="name" label="宿舍名字" width="120"></el-table-column>
        <el-table-column prop="type" label="宿舍类型" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.type==0? '男':'女' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="position" label="宿舍地址"></el-table-column>
        <el-table-column prop="startTimeF" label="开班时间"></el-table-column>
        <el-table-column prop="endTimeF" label="毕业时间"></el-table-column>
        <el-table-column prop="bak" label="宿舍描述"></el-table-column>
        <el-table-column fixed="right" label="操作" width="140">
          <template slot-scope="scope">
            <el-popconfirm title="确定删除吗" @onConfirm="delRoom(scope.row.id)">
              <el-button slot="reference" type="danger" size="small">删除</el-button>
            </el-popconfirm>
            <el-button type="primary" size="small" @click="addRoom(scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.start"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="page.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      ></el-pagination>
    </el-card>
    <Details ref="roomDetails" @com-fun="getRoomList"></Details>
  </div>
</template>

<script>
import roomApi from "@/api/school/room";
import Details from "./components/details";
import { resetData } from "@/utils/index";
import _ from "lodash";
export default {
  name: "room",
  data() {
    return {
      loading: false,
      search: {},
      roomList: [],
      page: {
        start: 1,
        limit: 10,
        total: 0
      }
    };
  },
  computed: {
    roomListCom() {
      // 处理数据的展示形态
      this.roomList.map(ele => {
        if (ele.startTime) {
          var arr = ele.startTime.split(" ")[0].split("-");
          ele.startTimeF = arr[0] + "年" + arr[1] + "月" + arr[2] + "日";
        }
        if (ele.endTime) {
          var arr = ele.endTime.split(" ")[0].split("-");
          ele.endTimeF = arr[0] + "年" + arr[1] + "月" + arr[2] + "日";
        }
      });
      return this.roomList;
    }
  },
  created() {
    this.getRoomList();
  },
  mounted() {},
  methods: {
    //   获取列表(初始化)
    getRoomList() {
      this.loading = true;
      var data = {
        start: this.page.start,
        limit: this.page.limit,
        name: this.search.roomName
      };
      data = _.pickBy(data, ele => ele); //清楚空的属性
      roomApi.getRoomList(data).then(res => {
        this.roomList = res.data.list;
        this.page.total = res.data.totalRow;
        this.loading = false;
      });
    },
    // 新增宿舍
    addRoom(id) {
      this.$refs.roomDetails.showForm(id);
    },
    // 删除宿舍
    delRoom(id) {
      roomApi
        .delRoom({
          id
        })
        .then(res => {
          this.$message("删除成功");
          this.getRoomList();
        });
    },
    // 翻页的方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page.limit = val;
      this.getRoomList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page.start = val;
      this.getRoomList();
    },
    reset() {
      resetData(this, "search");
    }
  },
  components: {
    Details
  }
};
</script>

<style scoped lang="scss">
.room-main {
  .box-card {
    margin: 30px;
    .page {
      float: right;
      margin: 20px;
    }
  }
}
</style>
