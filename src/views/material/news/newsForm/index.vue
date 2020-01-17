<template>
  <div class="news-form">
    <el-card class="card-box" shadow="hover">
      <el-form :model="xyNews" ref="form" label-width="120px" :disabled="isCheck">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="文章标题">
              <el-input v-model="xyNews.title" size="small" placeholder="请输入文章标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者">
              <el-input v-model="xyNews.author" size="small" placeholder="请输入作者"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="文章摘要">
          <el-input
            v-model="xyNews.desc"
            size="small"
            type="textarea"
            :rows="2"
            placeholder="请输入内容描述"
          ></el-input>
        </el-form-item>
        <el-form-item class="banner-img" label="封面图片">
          <el-upload
            class="upload-demo"
            action="/admin/xy/upload/uploadImg"
            :show-file-list="false"
            :on-success="handleExceed"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <div class="fileImg">
            <img :src="xyNews.cover" alt />
          </div>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="是否热门">
              <el-switch
                v-model="xyNews.hot"
                size="small"
                active-color="#13ce66"
                inactive-color="#64615d"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="点赞数量">
              <el-input
                v-model="xyNews.zanCount"
                size="small"
                placeholder="请输入点赞数"
                style="width:100px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="浏览数量">
              <el-input
                v-model="xyNews.viewCount"
                size="small"
                placeholder="请输入浏览数"
                style="width:100px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="切换文本类型">
              <el-radio v-model="xyNews.type" label="0">富文本</el-radio>
              <el-radio v-model="xyNews.type" label="1">markdown</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="警告">
              <i class="el-icon-warning"></i>
              <el-link type="warning" size="mini">切换文本类型会清空文本内容 请谨慎!!!</el-link>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="isImgsShow" size="mini">插入图片⬇⬇⬇</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="!isCheck">
          <Tinymce ref="tinymce" v-show="xyNews.type==0"></Tinymce>
          <MarkdownEditor v-show="xyNews.type==1" ref="mkd"></MarkdownEditor>
          <div class="but-yes-no">
            <el-button type="primary" @click="yes">确认提交</el-button>
            <el-button @click="no">取消</el-button>
          </div>
        </div>
        <el-card v-else>
          <h3>富文本内容</h3>
          <div v-html="xyNews.content2"></div>
        </el-card>
      </el-form>
    </el-card>

    <!-- 打开的弹窗 -->
    <el-dialog class="dialog-imglist" title="图片列表" :visible.sync="isImgs" width="80%">
      <el-row :gutter="20">
        <el-col :span="6" class="dialog-item" v-for="item in imgListCom" :key="item.id">
          <el-card class="dialog-img">
            <img :src="item.fileNameF" alt />
            <div class="but">
              <el-button type="info" size="mini" @click="itemImgShow(item.fileNameF)">预览</el-button>
              <el-button type="primary" size="mini" @click="copy(item.fileNameF)">复制链接</el-button>
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
    </el-dialog>
    <el-dialog class="dialog-inner" :visible.sync="isItemImg">
      <img :src="itemImg" alt />
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce/index";
import config from "@/api/config";
import photoApi from "@/api/material/photo";
import MarkdownEditor from "@/components/MarkdownEditor/index";
import newsApi from "@/api/material/news";
import { resetData } from "@/utils/index";
export default {
  name: "NewsForm",
  components: {
    Tinymce,
    MarkdownEditor
  },
  data() {
    return {
      isCheck: false,
      short_url: "1231223122",
      isItemImg: false,
      isImgs: false,
      imgList: [],
      itemImg: "",
      xyNews: {
        type: "0",
        cover: ""
      },
      page: {
        start: 1,
        limit: 8
      }
    };
  },
  computed: {
    imgListCom() {
      this.imgList.map(ele => {
        if (ele.fileName)
          ele.fileNameF = config.host + "/media/" + ele.fileName;
      });
      return this.imgList;
    }
  },
  methods: {
    // 获取当前详情
    getDetailsNew(id) {
      newsApi
        .detailsNew({
          id
        })
        .then(res => {
          this.xyNews = res.data;
          if (!this.isCheck) {
            if (this.xyNews.type == 0) {
              this.setTinymceVal();
            } else {
              this.setMKDval();
            }
          }
        });
    },
    //   上传成功
    handleExceed(response, file, fileList) {
      this.xyNews.cover = config.host + "/" + response.url;
      this.$message("上传成功");
    },
    // 展示图片列表
    isImgsShow() {
      var data = {
        start: this.page.start,
        limit: this.page.limit
      };
      this.isImgs = true;
      photoApi.getPhotoList(data).then(res => {
        this.imgList = res.data.list;
        this.page.total = res.data.totalRow;
      });
    },
    // 图片列表预览
    itemImgShow(url) {
      this.itemImg = url;
      this.isItemImg = true;
    },
    // 复制图片链接
    copy(url) {
      var oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message({
        message: "复制成功!",
        type: "success"
      });
    },
    //获取富文本内容
    getTinymceVal() {
      this.xyNews.content1 = this.$refs.tinymce.getContent();
      this.xyNews.content2 = this.$refs.tinymce.getContent();
    },
    // 给富文本赋值
    setTinymceVal() {
      if (this.xyNews.content2) {
        this.$refs.tinymce.setContent(this.xyNews.content2);
      }
    },
    // 获取mk的方法
    getMKDval() {
      this.xyNews.content1 = this.$refs.mkd.getValue();
      this.xyNews.content2 = this.$refs.mkd.getHtml();
    },
    // gei mk赋值的方法
    setMKDval() {
      this.$nextTick(() => {
        if (this.xyNews.content2) {
          this.$refs.mkd.setHtml(this.xyNews.content2);
        }
      });
    },
    yes() {
      if (this.xyNews.type == 0) {
        this.getTinymceVal();
      } else {
        this.getMKDval();
      }
      this.xyNews.hot = this.xyNews.hot ? 1 : 0;
      if (this.xyNews.id) {
        //有id代表编辑模式
        newsApi
          .updataNew({
            xyNews: this.xyNews
          })
          .then(res => {
            this.$message("修改成功");
            this.no();
          });
      } else {
        newsApi
          .addNew({
            xyNews: this.xyNews
          })
          .then(res => {
            this.$message("添加成功");
            this.no();
          });
      }
    },
    no() {
      this.$router.push({ name: "news" });
      resetData(this, "xyNews");
    },
    // 分页器的方法
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page.start = val;
      this.isImgsShow();
    }
  },
  created() {
    var id = this.$route.query.id;
    if (this.$route.query.isCheck) {
      this.isCheck = true;
    }
    if (id) {
      //有id是编辑模
      this.getDetailsNew(id);
    }
  },
  mounted() {}
};
</script>

<style scoped lang="scss">
.news-form {
  .card-box {
    margin: 30px;
    padding-top: 20px;

    .banner-img {
      position: relative;

      .fileImg {
        position: absolute;
        left: 240px;
        top: 0;
        width: 200px;
        height: 100px;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }
  /deep/ .el-card__body {
    padding: 0;
  }
  .dialog-img {
    height: 250px;
    margin-top: 10px;
    img {
      width: 100%;
      height: 200px;
      object-fit: contain;
    }
    .but {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .dialog-inner {
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .page {
    float: right;
    margin: 15px;
  }
  /deep/ .el-dialog {
    padding-bottom: 50px;
  }
  .but-yes-no {
    display: flex;
    justify-content: space-around;
    width: 300px;
    margin: 20px auto;
  }
}
</style>