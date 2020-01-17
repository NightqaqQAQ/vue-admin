import request from "@/api/request";
// 登陆
function getDashboard(data) {
  return request({
    url: "/admin/xy/dashboard/base",
    method: "get",
    data
  });
}

export default {
    getDashboard
};
