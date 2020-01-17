<template>
  <div class="clazz-main">
    <!-- 头部区域 -->
    <el-card class="box-card" shadow="hover">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            class="search-ipt"
            v-model="search.className"
            size="small"
            placeholder="请输入班级名称"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="search.startTime"
            size="small"
            type="date"
            placeholder="选择开始时间"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="search.endTime"
            size="small"
            type="date"
            placeholder="选择结束时间"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button @click="reset" size="small">重置</el-button>
          <el-button @click="getclazzList" type="primary" size="small">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 内容区域 -->
    <el-card class="box-card" shadow="hover">
      <template>
        <div slot="header" class="clearfix">
          <el-button type="primary" size="small" @click="addclazz">新增</el-button>
        </div>
        <el-table v-loading="loading" :data="clazzListCom" border style="width: 100%">
          <el-table-column fixed type="index" label="#" width="50"></el-table-column>
          <el-table-column prop="className" label="班级" width="120"></el-table-column>
          <el-table-column prop="desc" label="班级描述"></el-table-column>
          <el-table-column prop="type" label="课程类型" width="120">
            <template slot-scope="scope">{{ scope.row.type == 1 ? '前端' : 'UI' }}</template>
          </el-table-column>
          <el-table-column prop="startTimeF" label="开始时间" width="150"></el-table-column>
          <el-table-column prop="endTimeF" label="结束时间" width="150"></el-table-column>
          <el-table-column prop="addTimeF" label="添加时间" width="150"></el-table-column>
          <el-table-column fixed="right" label="操作" width="140">
            <template slot-scope="scope">
              <el-popconfirm @onConfirm="delClazz(scope.row.id)" title="这是一段行内容确定删除吗？">
                <el-button slot="reference" type="danger" size="small">删除</el-button>
              </el-popconfirm>
              <el-button type="primary" size="small" @click="edit(scope.row.id)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
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
    <Details ref="details" @refresh-list="getclazzList"></Details>
  </div>
</template>

<script>
import clazzApi from "@/api/school/clazz";
import _ from "lodash";
import Details from "./components/details/index";
import { resetData } from "@/utils/index";
export default {
  name: "clazz",
  data() {
    return {
      loding: false,
      //头部搜索数据
      search: {
        //使用对象绑定数据时 search.xxx 可以不用声明
        className: "",
        startTime: "",
        endTime: ""
      },
      //   列表数据
      clazzList: [],
      //   分页器数据
      page: {
        start: 1,
        limit: 10,
        total: 0
      }
    };
  },
  computed: {
    clazzListCom() {
      // 处理数据的展示形态
      this.clazzList.map(ele => {
        if (ele.startTime) {
          var arr = ele.startTime.split(" ")[0].split("-");
          ele.startTimeF = arr[0] + "年" + arr[1] + "月" + arr[2] + "日";
        }
        if (ele.endTime) {
          var arr = ele.endTime.split(" ")[0].split("-");
          ele.endTimeF = arr[0] + "年" + arr[1] + "月" + arr[2] + "日";
        }
        if (ele.addTime) {
          var arr = ele.addTime.split(" ")[0].split("-");
          ele.addTimeF = arr[0] + "年" + arr[1] + "月" + arr[2] + "日";
        }
      });
      return this.clazzList;
    }
  },
  created() {
    this.getclazzList();
  },
  mounted() {},
  methods: {
    // 获取(初始化)列表数据
    getclazzList() {
      this.loading = true; //打开loding弹窗
      var data = {
        start: this.page.start,
        limit: this.page.limit,
        className: this.search.className
      };
      data = _.pickBy(data, item => item); //把空的属性去掉 为了传参的格式 ?a=&b=1&c=2
      clazzApi.getClazzList(data).then(res => {
        this.clazzList = res.data.list;
        // 初始化分页器数据
        this.page.total = res.data.totalRow;
        this.loading = false;
      });
    },
    // 分页器变化的方法
    handleSizeChange(val) {
      this.page.limit = val;
      this.getclazzList();
    },
    handleCurrentChange(val) {
      this.page.start = val;
      this.getclazzList();
    },
    // 添加班级
    addclazz() {
      this.$refs.details.formShow();
    },
    // 删除班级
    delClazz(id) {
      clazzApi
        .delClazz({
          id
        })
        .then(res => {
          this.getclazzList();
          this.$message("删除成功");
        });
    },
    // 编辑班级信息
    edit(id) {
      this.$refs.details.formShow(id);
    },
    reset() {
      // 重置头部信息
      resetData(this, "search");
    }
  },
  components: {
    Details
  }
};
</script>

<style scoped lang="scss">
.clazz-main {
  .box-card {
    margin: 30px;
    .search-ipt {
      width: 220px;
    }
    .page {
      float: right;
      margin: 20px 10px;
    }
  }
}
</style>
