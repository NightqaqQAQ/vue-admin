import request from "@/api/request";

function getStudentList(data) {
  return request({
    url: "/admin/xy/student/list",
    method: "get",
    data
  });
}
function postAddStudent(data) {
  return request({
    url: "/admin/xy/student/save",
    method: "post",
    data
  });
}
function delStudent(data) {
  return request({
    url: "/admin/xy/student/del",
    method: "get",
    data
  });
}
function detailStudent(data) {
  return request({
    url: "/admin/xy/student/detail",
    method: "get",
    data
  });
}
function postUpdataStudent(data) {
    return request({
      url: "/admin/xy/student/update",
      method: "post",
      data
    });
  }
  // 收费接口
function costStudent(data){
  return request({
    url: "/admin/xy/cost/list",
    method: "get",
    data
  });
}

export default {
  getStudentList,
  postAddStudent,
  delStudent,
  detailStudent,
  postUpdataStudent,
  costStudent
};
