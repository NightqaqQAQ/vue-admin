<template>
  <div class="student-main">
    <el-card class="box-card" shadow="hover">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="search.inpVal"
            class="input-with-select"
            size="small"
          >
            <el-select
              style="width:100px"
              v-model="search.searchKey"
              slot="prepend"
              placeholder="请选择"
            >
              <el-option label="学员姓名" value="name"></el-option>
              <el-option label="班级id" value="classId"></el-option>
              <el-option label="宿舍id" value="dormId"></el-option>
            </el-select>
          </el-input>
        </el-col>
        <el-col :span="8">
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
        <el-col :span="5">
          <el-select v-model="search.status" placeholder="请选择" size="small">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-button @click="reset" size="small">重置</el-button>
          <el-button @click="getStudentList" type="primary" size="small">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <el-button type="primary" size="small" @click="addStudent(false)">新增学员</el-button>
      </div>
      <el-table :data="studentListCom" border style="width: 100%" v-loading="loading">
        <el-table-column fixed type="index" label="#" width="30px"></el-table-column>
        <el-table-column prop="name" label="姓名" width="100"></el-table-column>
        <el-table-column prop="sexF" label="性别" width="100"></el-table-column>
        <el-table-column prop="manID" label="身份证" width="120"></el-table-column>
        <el-table-column prop="tel" label="电话" width="100"></el-table-column>
        <el-table-column prop="cityF" label="城市" width="200"></el-table-column>
        <el-table-column prop="dormStartTimeF" label="宿舍入住时间" width="130"></el-table-column>
        <el-table-column prop="dormEndTimeF" label="离开宿舍时间" width="130"></el-table-column>
        <el-table-column prop="school" label="毕业学校"></el-table-column>
        <el-table-column prop="job" label="当前公司"></el-table-column>
        <el-table-column fixed="right" label="操作" width="140">
          <template slot-scope="scope">
            <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="delStudent(scope.row.id)">
              <el-button slot="reference" type="danger" size="small">删除</el-button>
            </el-popconfirm>
            <el-button type="primary" size="small" @click="addStudent(scope.row.id)">编辑</el-button>
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
    <Details ref="studentCom" @com-fun="getStudentList"></Details>
  </div>
</template>

<script>
import { CodeToText } from "element-china-area-data";
import studentApi from "@/api/school/student";
import Details from "./components/Details";
import { resetData } from "@/utils/index";
import _ from "lodash";
export default {
  name: "student",
  data() {
    return {
      loading: false,
      search: {
        searchKey: "name"
      },
      status: [
        {
          value: 0,
          label: "在学"
        },
        {
          value: 1,
          label: "工作"
        },
        {
          value: 2,
          label: "在找工作"
        }
      ],
      //   表格数据
      studentList: [],
      page: {
        start: 1,
        limit: 10,
        total: 0
      }
    };
  },
  computed: {
    studentListCom() {
      this.studentList.map(ele => {
        if (ele.city) {
          var one = CodeToText[ele.city.split(",")[0]];
          var tow = "空";
          if (CodeToText[ele.city.split(",")[1]]) {
            tow = CodeToText[ele.city.split(",")[1]];
          }
          var three = "空";
          if (CodeToText[ele.city.split(",")[2]]) {
            var three = CodeToText[ele.city.split(",")[2]];
          }
          ele.cityF = one + " " + tow + " " + three;
        }
        if (ele.dormStartTime) {
          var arr = ele.dormStartTime.split(" ")[0].split("-");
          ele.dormStartTimeF = arr[0] + "年" + arr[1] + "月" + arr[2] + "日";
        }
        if (ele.dormEndTime) {
          var arr = ele.dormEndTime.split(" ")[0].split("-");
          ele.dormEndTimeF = arr[0] + "年" + arr[1] + "月" + arr[2] + "日";
        }
        if (ele.sex == 0) {
          ele.sexF = "男";
        }else if(ele.sex == 1){
          ele.sexF = "女";
        }
      });
      return this.studentList;
    }
  },
  created() {
    this.getStudentList();
  },
  mounted() {},
  methods: {
    //   获取数据
    getStudentList() {
      this.loading = true;
      var data = {
        start: this.page.start,
        limit: this.page.limit,
        [this.search.searchKey]: this.search.inpVal,
        status: this.search.status
      };
      if (this.search.time) {
        data.startTime = this.search.time[0];
        data.endTime = this.search.time[1];
      }
      if (data.status === 0) {
      } else {
        data = _.pickBy(data, ele => ele); //清楚空的属性
      }
      studentApi.getStudentList(data).then(res => {
        this.studentList = res.data.list;
        this.page.total = res.data.totalRow;
        this.loading = false;
      });
    },
    // 新增学员
    addStudent(id) {
      this.$refs.studentCom.showForm(id);
    },
    // 删除学员
    delStudent(id) {
      studentApi
        .delStudent({
          id
        })
        .then(res => {
          this.$message("删除成功");
          this.getStudentList();
        });
    },
    // 分页器的方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page.limit = val;
      this.getStudentList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page.start = val;
      this.getStudentList();
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
.student-main {
  .box-card {
    margin: 30px;
    .input-with-select {
      width: 300px;
    }
    .page {
      float: right;
      margin: 20px;
    }
  }
  /deep/.el-table th.gutter { 
  /* 取消表格错位 */
  display: table-cell !important;
}

}
</style>
