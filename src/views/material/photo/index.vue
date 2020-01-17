<template>
  <div class="photo-main">
    <el-card class="box-card" shadow="hover">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-upload
            :show-file-list="false"
            ref="upload"
            class="upload-demo"
            action="/admin/xy/upload/uploadImg"
            :on-success="handleExceed"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-col>
        <el-col :span="8">
          <el-input v-model="fileName" size="small" placeholder="请输入图片名"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button @click="fileName=''" size="small">重置</el-button>
          <el-button type="primary" @click="getPhotoList" size="small">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <span>图片列表</span>
      </div>
      <el-row :gutter="20" v-loading="loading">
        <el-col :span="6" v-for="item in fileList" :key="item.id">
          <el-card class="img-box" shadow="hover">
            <img :src="host+item.fileName" alt />
            <div>
              <div class="img-t-i">
                <span
                  class="img-title"
                  v-show="isID != item.id"
                  @dblclick="checkPhoto(item.id,$event)"
                >{{ item.title||'双击修改标题' }}</span>
                <el-input
                  v-show="isID == item.id"
                  class="check"
                  v-model="title"
                  placeholder="请输入图片名"
                  size="mini"
                  @blur="checkAjax"
                ></el-input>
              </div>
              <div class="bottom clearfix">
                <time class="time">{{ item.addTime }}</time>
                <div class="img-btn">
                  <el-popconfirm title="确定删除吗？" @onConfirm="delPhoto(item.id)">
                    <el-button type="danger" slot="reference" class="button" size="mini">删除</el-button>
                  </el-popconfirm>
                  <el-button
                    type="primary"
                    @click="detailsPhoto(item.id)"
                    class="button"
                    size="mini"
                  >预览</el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-pagination
        class="page"
        @current-change="handleCurrentChange"
        :current-page="page.start"
        layout="total, prev, pager, next, jumper"
        :total="page.total"
        :page-size="page.limit"
      ></el-pagination>
    </el-card>
    <el-dialog class="details-img" title="图片" :visible.sync="isShow">
      <img :src="detailsUrl" />
    </el-dialog>
  </div>
</template>

<script>
import photoApi from "@/api/material/photo";
import config from "@/api/config";
import _ from "lodash";
export default {
  name: "photo",
  data() {
    return {
      loading: false,
      isShow: false,
      isID: "",
      title: "",
      fileList: [],
      fileName: "",
      host: config.host + "/media/",
      detailsUrl: "",
      page: {
        start: 1,
        limit: 4
      }
    };
  },
  computed: {},
  created() {
    this.getPhotoList();
  },
  mounted() {},
  methods: {
    //   获取图片列表
    getPhotoList() {
      this.loading = true;
      var data = {
        start: this.page.start,
        limit: this.page.limit,
        title: this.fileName
      };
      data = _.pickBy(data, ele => ele);
      photoApi.getPhotoList(data).then(res => {
        this.fileList = res.data.list;
        this.page.total = res.data.totalRow;
        this.loading = false;
      });
    },
    // 增
    handleExceed(response, file, fileList) {
      this.$refs.upload.clearFiles();
      this.getPhotoList();
      this.$message("添加成功");
    },
    // 删
    delPhoto(id) {
      photoApi
        .delPhoto({
          id
        })
        .then(res => {
          this.$message("删除成功");
          this.getPhotoList();
        });
    },
    // 改
    checkPhoto(id, $event) {
      this.isID = id;
      var ele = $event.target.nextElementSibling.children[0];
      this.$nextTick(() => {
        //当dom发生变化 如果要在变后的节点上操作 要加nextTick
        ele.focus();
      });
    },
    checkAjax() {
      photoApi
        .checkPhoto({
          title: this.title,
          id: this.isID
        })
        .then(res => {
          this.isID = "";
          this.title = "";
          this.getPhotoList();
          this.$message("修改成功");
        });
    },
    // 预览
    detailsPhoto(id) {
      this.isShow = true;
      var index = this.fileList.findIndex(ele => ele.id == id);
      this.detailsUrl = this.host + this.fileList[index].fileName;
    },
    // 分页器
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page.start = val;
      this.getPhotoList();
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.photo-main {
  .box-card {
    margin: 30px;
    .img-box {
      margin-top: 10px;
      img {
        height: 200px;
        width: 100%;
        object-fit: contain;
      }
    }
    .time {
      font-size: 13px;
      color: #999;
    }
    .img-btn {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .img-t-i {
      width: 100%;
      height: 30px;
      /deep/ .check input {
        border: none;
      }
      .img-title {
        font-size: 14px;
      }
    }
  }
  .details-img {
    img {
      width: 100%;
    }
  }
  .page {
    float: right;
    margin: 20px;
  }
}
</style>
