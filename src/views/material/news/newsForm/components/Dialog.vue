<template>
  <div>
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
    <el-dialog class="dialog-inner" :visible.sync="isItemImg">
      <img :src="itemImg" alt />
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      isItemImg: false,
      imgList: [],
      itemImg: ""
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
    itemImgShow(url) {
      this.itemImg = url;
      this.isItemImg = true;
    },
    // 分页器的方法
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page.start = val;
      this.isImgsShow();
    }
  },
  created() {},
  mounted() {}
};
</script>

<style scoped lang="scss">
</style>
