<template>
  <div>
    <el-dialog :title="isTitle" :visible.sync="isForm" width="50%" :before-close="no">
      <!-- :before-close="no"点击别mask执行 -->
      <!-- label-width可以让标题和内容一行 -->
      <el-form :model="xyClassInfo" :rules="rules" ref="formName" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="班级名称" prop="className">
              <el-input v-model="xyClassInfo.className"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程类型" prop="type">
              <el-select v-model="xyClassInfo.type" placeholder="请选择课程">
                <el-option label="前端" :value="0"></el-option>
                <el-option label="UI" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="开班时间" prop="startTime">
          <el-date-picker
            v-model="xyClassInfo.startTime"
            type="date"
            placeholder="选择开始日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="毕业时间" prop="endTime">
          <el-date-picker
            v-model="xyClassInfo.endTime"
            type="date"
            placeholder="选择结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="班级描述" prop="desc">
          <el-input
            type="textarea"
            :rows="2"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="班级描述"
            v-model="xyClassInfo.desc"
          ></el-input>
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
import clazzApi from "@/api/school/clazz";
export default {
  data() {
    return {
      isForm: false,
      isTitle: "",
      xyClassInfo: {
        type: 0
      },
      rules: {
        className: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择课程", trigger: "change" }],
        startTime: [
          {
            required: true,
            message: "请选择日期",
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
        desc: [{ required: true, message: "请填写详情", trigger: "blur" }]
      }
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    // 开启弹窗

    formShow(id) {
      this.isTitle = "新增班级";
      // 如果id有值 说明是编辑状态 需要给form附上默认值
      if (id) {
        this.isTitle = "编辑班级";
        clazzApi
          .detailClazz({
            id
          })
          .then(res => {
            console.log(res);
            this.xyClassInfo = res.data;
          });
      }
      this.isForm = true;
    },
    //点击确定事件
    yes() {
      this.$refs.formName.validate(valid => { //所有验证是否通过
        if (valid) { //如果通过
          // 如果有id 说明是编辑状态
          if (this.xyClassInfo.id) {
            clazzApi
              .postUpdateClazz({
                xyClassInfo: this.xyClassInfo
              })
              .then(res => {
                this.$message("修改成功");
                //清空form表单
                this.no();
                //刷新table表格
                this.$emit("refresh-list");
              });
          } else {
            //没有则是添加状态
            clazzApi
              .postAddClazz({
                xyClassInfo: this.xyClassInfo
              })
              .then(res => {
                this.$message("添加成功");
                //清空form表单
                this.no();
                //刷新table表格
                this.$emit("refresh-list");
              });
          }
        } else { //验证未通过
          console.log("error submit!!");
          return false;
        }
      });
    },
    no() {
      //点击取消事件
      this.isForm = false;
      // console.log(this.$options.data()) //可以获取到当前页面的初始数据
      // 还原form表单数据到初始状态
      resetData(this, "xyClassInfo"); //封装时 用的obj[xxx] 这里要加引号
      this.$refs.formName.resetFields(); //初始化验证提示
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
</style>
