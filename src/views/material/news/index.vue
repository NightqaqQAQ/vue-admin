<template>
  <div class="news-main">
    <el-card class="card-box" shadow="hover">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="search.title" placeholder="请输入标题" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <el-input v-model="search.author" placeholder="请输入作者" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button @click="search={}" size="small">重置</el-button>
          <el-button @click="getNewsList" type="primary" size="small">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="card-box" shadow="hover">
      <div slot="header" class="clearfix">
        <el-button type="primary" size="small" @click="addNew">新增</el-button>
      </div>
      <el-row :gutter="10" v-loading="loading">
        <el-col :span="6" v-for="item in newsListCom" :key="item.id">
          <el-card class="card-item" shadow="hover">
            <div class="hot" v-if="item.hot==1">热</div>
            <img class="news-item-img" :src="item.coverF" />
            <div class="text">
              <h3>标题: {{ item.title }}</h3>
              <p class="author">作者: {{ item.author }}</p>
              <p class="zanCount">点赞数: {{ item.zanCount }}</p>
              <span class="content">{{ item.desc }}</span>
            </div>
            <div class="btn">
              <el-button type="primary" size="mini" @click="detailsNews(item.id)">编辑</el-button>
              <el-button @click="detailsNews(item.id,1)" size="mini">预览</el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="delNews(item.id)">
                <el-button type="danger" size="mini" slot="reference">删除</el-button>
              </el-popconfirm>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-pagination
        class="page"
        @current-change="handleCurrentChange"
        :current-page="page.start"
        layout="total, prev, pager, next, jumper"
        :page-size="page.limit"
        :total="page.total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import newsApi from "@/api/material/news";
import config from "@/api/config";
import _ from "lodash";
export default {
  name: "News",
  components: {},
  data() {
    return {
      loading: false,
      newsList: [],
      page: {
        start: 1,
        limit: 4
      },
      search: {}
    };
  },
  computed: {
    newsListCom() {
      this.newsList.map(ele => {
        if (ele.cover) {
          ele.coverF = ele.cover.replace("http://localhost", config.host);
        }
      });
      return this.newsList;
    }
  },
  methods: {
    // 获取列表
    getNewsList() {
      this.loading = true;
      var data = {
        start: this.page.start,
        limit: this.page.limit,
        ...this.search
      };
      data = _.pickBy(data, ele => ele);
      newsApi.getNewList(data).then(res => {
        this.newsList = res.data.list;
        this.page.total = res.data.totalRow;
        this.loading = false;
      });
    },
    // 增
    addNew() {
      this.$router.push({
        name: "newsForm"
      });
    },
    // 删除
    delNews(id) {
      newsApi
        .delNew({
          id
        })
        .then(res => {
          this.getNewsList();
          this.$message("删除成功");
        });
    },
    // 编辑(改)
    detailsNews(id,isCheck) {
      this.$router.push({
        name: "newsForm",
        query: {
          id,
          isCheck
        }
      });
    },
    // 分页器的方法
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page.start = val;
      this.getNewsList();
    }
  },
  created() {
    this.getNewsList();
  },
  mounted() {}
};
</script>

<style scoped lang="scss">
.news-main {
  .card-box {
    margin: 30px;
    .card-item {
      position: relative;
      height: 470px;
      margin-top: 10px;
      .hot {
        position: absolute;
        bottom: 0;
        left: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background-color: #ffc3b0;
        color: #fff;
      }
      p {
        color: #d2d6d8;
        font-size: 12px;
      }
    }
    .text {
      height: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .btn {
      padding-top: 10px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .news-item-img {
      width: 100%;
      height: 200px;
      object-fit: contain;
    }
  }
  .page {
    float: right;
    margin: 20px;
  }
}
</style>

