<template>
  <div>
    <el-dialog :title="fromTitle" :visible.sync="isForm" :before-close="no">
      <!-- :before-close弹窗关闭时的回调 -->
      <el-form :model="xyDormInfo" :rules="rules" label-width="80px" ref="formRoom">
        <el-row>
          <el-col :span="12">
            <el-form-item label="宿舍名称" prop="name">
              <el-input v-model="xyDormInfo.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="type">
              <el-select v-model="xyDormInfo.type" placeholder="请选则性别">
                <el-option label="男" :value="0"></el-option>
                <el-option label="女" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="宿舍地址" prop="position">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="xyDormInfo.position"></el-input>
        </el-form-item>
        <el-form-item label="开班时间" prop="startTime">
          <el-date-picker
            v-model="xyDormInfo.startTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="毕业时间" prop="endTime">
          <el-date-picker
            v-model="xyDormInfo.endTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="班级描述" prop="bak">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="xyDormInfo.bak"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="no">取 消</el-button>
        <el-button type="primary" @click="yes">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { resetData } from "@/utils/index";
import roomApi from "@/api/school/room";
export default {
  data() {
    return {
      fromTitle: "新增宿舍",
      isForm: false,
      xyDormInfo: {},
      rules: {
        //表单验证
        name: [
          { required: true, message: "请输入宿舍名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择性别", trigger: "change" }],
        position: [
          {
            required: true,
            message: "请填写地址",
            trigger: "blur"
          }
        ],
        startTime: [
          {
            required: true, //不能加type: 'data' 因为 value-format="yyyy-MM-dd"
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        endTime: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: "change"
          }
        ],
        bak: [{ required: true, message: "请填写详情", trigger: "blur" }]
      }
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    //   显示弹窗
    showForm(id) {
      //    如果有id代表是编辑状态
      this.fromTitle = "新增宿舍";
      if (id) {
        this.fromTitle = "编辑宿舍";
        roomApi
          .detailRoom({
            id
          })
          .then(res => {
            this.xyDormInfo = res.data;
          });
      }
      this.isForm = true;
    },
    yes() {
      this.$refs.formRoom.validate(valid => {
        if (valid) {
          if (this.xyDormInfo.id) {
            //如果有id 是编辑状态
            roomApi
              .postUpdateRoom({
                xyDormInfo: this.xyDormInfo
              })
              .then(res => {
                this.$emit("com-fun");
                this.$message("更改成功");
                this.no();
              });
          } else {
            roomApi
              .postAddRoom({
                xyDormInfo: this.xyDormInfo
              })
              .then(res => {
                this.$emit("com-fun");
                this.$message("添加成功");
                this.no();
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    no() {
      console.log(1);
      resetData(this, "xyDormInfo");
      this.isForm = false;
      this.$refs.formRoom.resetFields();
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
</style>
