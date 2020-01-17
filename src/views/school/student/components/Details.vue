<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="isForm"
      width="60%"
      :close-on-click-modal="false"
      :before-close="no"
    >
      <!-- :label-position="labelPosition" //控制表单标题左右 和law一起生效-->
      <el-form :model="xyUser" label-width="90px" :rules="rules" ref="studentForm">
        <!-- 第一段 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="基本信息" name="first">
            <el-card class="box-card" shadow="hover">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="姓名" prop="name">
                    <el-input size="small" v-model="xyUser.name" autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="性别">
                    <el-select v-model="xyUser.sex" size="small" placeholder="请选择性别">
                      <el-option label="男" :value="0"></el-option>
                      <el-option label="女" :value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="班级" prop="classId">
                    <el-select v-model="xyUser.classId" size="small" placeholder="请选择班级">
                      <el-option
                        v-for="item in classListCom"
                        :key="item.id"
                        :label="item.classNameF"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="电话" prop="tel">
                    <el-input size="small" v-model="xyUser.tel" autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="身份证">
                    <el-input size="small" v-model="xyUser.manID" autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="城市">
                    <el-cascader size="small" :options="options" v-model="xyUser.city"></el-cascader>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="宿舍">
                    <el-select v-model="xyUser.dormId" size="small" placeholder="请选择宿舍">
                      <el-option
                        v-for="item in roomListCom"
                        :key="item.id"
                        :label="item.nameF"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="入住时间">
                    <el-date-picker
                      size="small"
                      v-model="xyUser.dormStartTime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd"
                      style="width: 180px"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="离开事件">
                    <el-date-picker
                      size="small"
                      v-model="xyUser.dormEndTime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd"
                      style="width: 180px"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="补充信息" name="second">
            <el-card class="box-card" shadow="hover">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="紧急电话">
                    <el-input size="small" v-model="xyUser.tel2" autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="微信">
                    <el-input size="small" v-model="xyUser.wx" autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="qq">
                    <el-input size="small" v-model="xyUser.qq" autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="毕业院校">
                    <el-input size="small" v-model="xyUser.school" autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="工作">
                    <el-input size="small" v-model="xyUser.job" autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="缴费信息" name="third">
            <el-card v-show="!isShowPay" class="box-card" shadow="hover">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="类型">
                    <el-radio-group v-model="costForm.costType" size="small">
                      <el-radio :label="0">学费</el-radio>
                      <el-radio :label="1">宿舍</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="金额">
                    <el-input size="small" v-model="costForm.costValue" autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="缴费日期">
                    <el-date-picker
                      style="width: 180px"
                      size="small"
                      v-model="costForm.costTime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="备注">
                    <el-input
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      v-model="costForm.costBak"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="添加">
                    <el-button size="small" @click="costNo">取消</el-button>
                    <el-button size="small" @click="costAdd" type="primary">确认</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <el-card class="box-card" shadow="hover">
              <div slot="header" v-show="isShowPay" class="clearfix">
                <span>缴费记录</span>
                <el-button
                  @click="isShowPay=!isShowPay"
                  class="addbut"
                  style="float: right; padding: 3px 0"
                  type="text"
                >添加费用记录+</el-button>
              </div>
              <el-table v-loading="loading" :data="costListCom" border style="width: 100%">
                <el-table-column fixed prop="costTypeF" label="类型" width="100"></el-table-column>
                <el-table-column prop="costTimeF" label="缴费时间"></el-table-column>
                <el-table-column prop="costValueF" label="缴费金额"></el-table-column>
                <el-table-column prop="costBak" label="备注"></el-table-column>
                <el-table-column fixed="right" label="操作">
                  <template slot-scope="scope" v-if="scope.row.tempId">
                    <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="delCost(scope.row.tempId)">
                      <el-button slot="reference" type="danger" size="small">删除</el-button>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="no" size="small">取 消</el-button>
        <el-button type="primary" @click="yes" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import clazzApi from "@/api/school/clazz"; //获取班级信息填到表单中
import roomApi from "@/api/school/room"; //获取宿舍信息列表
import studentApi from "@/api/school/student"; //学员的操作
import { resetData } from "@/utils/index";
import Mock from "mockjs";
import _ from "lodash";
import {
  regionDataPlus,
  provinceAndCityDataPlus
} from "element-china-area-data"; //城市数据
export default {
  name: "studentCom",
  data() {
    return {
      loading: false,
      isShowPay: true,
      activeName: "first",
      // labelPosition:'left', //控制表单标题左右
      title: "新增学员",
      isForm: false,
      xyUser: {},
      classList: [],
      roomList: [],
      options: regionDataPlus,
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        classId: [{ required: true, message: "请选择班级", trigger: "change" }],
        tel: [{ required: true, message: "请输入电话", trigger: "blur" }]
      },
      // 缴费数据
      costForm: {
        costType: 0
      },
      costList: []
    };
  },
  computed: {
    //修改班级数据
    classListCom() {
      this.classList.map(ele => {
        if (!ele.className) {
          ele.classNameF = "空";
        } else {
          ele.classNameF = ele.className;
        }
      });
      return this.classList;
    },
    roomListCom() {
      this.roomList.map(ele => {
        if (!ele.name) {
          ele.nameF = "空";
        } else {
          ele.nameF = ele.name;
        }
      });
      return this.roomList;
    },
    // 修改缴费列表数据
    costListCom() {
      this.costList.map(ele => {
        if (ele.costType == 0) {
          ele.costTypeF = "学费";
        } else {
          ele.costTypeF = "住宿费";
        }
        if (ele.costTime) {
          var arr = ele.costTime.split(" ")[0].split("-");
          ele.costTimeF = arr[0] + "年" + arr[1] + "月" + arr[2] + "日";
        }
        if (ele.costValue) {
          ele.costValueF = ele.costValue + "元";
        }
      });
      return this.costList;
    }
  },
  created() {
    this.getClazzList();
    this.getRoomList();
  },
  mounted() {},
  methods: {
    showForm(id) {
      this.title = "新增学员";
      if (id) {
        //如果有id 是编辑模式
        this.title = "编辑学员";
        studentApi
          .detailStudent({
            id
          })
          .then(res => {
            this.xyUser = res.data;
            if (this.xyUser.city) {
              this.xyUser.city = this.xyUser.city.split(",");
              if (this.xyUser.city.length == 1) {
                this.xyUser.city[1] = "";
              }
            }
          });
        this.costStudent(id); //请求收费记录
      }
      this.isForm = true;
    },
    // 收费小表单确认添加到表格事件
    costAdd() {
      var Random = Mock.Random;
      var obj = _.clone(this.costForm);
      obj.tempId = Random.guid();
      this.costList.unshift(obj);
      this.$message("加入成功");
    },
    // 收费小表格删除事件
    delCost(tempId) {
      var index = this.costList.findIndex(ele => ele.tempId == tempId);
      this.costList.splice(index, 1);
      this.$message("删除成功");
    },
    // 收费小表单取消事件
    costNo() {
      this.isShowPay = !this.isShowPay;
      resetData(this, "costForm"); //清空缴费表单
    },
    // 获取收费记录
    costStudent(id) {
      this.loading = true;
      studentApi
        .costStudent({
          userId: id
        })
        .then(res => {
          this.costList = res.data.list;
          this.loading = false;
        });
    },
    // 取消事件
    no() {
      this.isForm = false;
      resetData(this, "xyUser"); //清空大表单
      resetData(this, "costList"); //清空缴费列表数据
      this.$refs.studentForm.resetFields();
      this.costNo();
    },
    // 确定事件
    yes() {
      this.$refs.studentForm.validate(valid => {
        //表单验证
        if (valid) {
          this.xyUser.city = "" + this.xyUser.city;
          if (this.xyUser.id) {
            //如果有id 代表是编辑模式
            var arr = this.costList.filter(ele=>ele.tempId);
            var costObj = {
              _size: arr.length
            };
            for (var i = 0; i < costObj._size; i++) {
              costObj["xyCostItems_" + i] = {
                costType: arr[i].costType,
                costTime:arr[i].costTime,
                costValue: arr[i].costValue,
                costBak: arr[i].costBak
              };
            }
            studentApi
              .postUpdataStudent({
                xyUser: this.xyUser,
                ...costObj
              })
              .then(res => {
                this.$emit("com-fun");
                this.$message("修改成功");
                this.no();
              });
          } else {
            studentApi
              .postAddStudent({
                xyUser: this.xyUser
              })
              .then(res => {
                this.$emit("com-fun");
                this.$message("添加成功");
                this.no();
              });
          }
        } else {
          this.$message.error("您的基本信息格式不正确");
          this.activeName = "first";
          return false;
        }
      });
    },
    // 获取班级信息
    getClazzList() {
      clazzApi.getClazzList().then(res => {
        this.classList = res.data.list;
      });
    },
    // 获取宿舍列表
    getRoomList() {
      roomApi.getRoomList().then(res => {
        this.roomList = res.data.list;
      });
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.box-card {
  margin: 20px;
  //   /deep/ .el-form-item__label{
  //       text-align: left;
  //   }
  .addbut {
    color: orange;
    font-size: 14px;
  }
}
</style>
