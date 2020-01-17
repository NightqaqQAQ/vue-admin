import request from "@/api/request";
// 登陆
function goLogin(data) {
  return request({
    url: "/admin/login/doLogin",
    method: "post",
    data
  });
}

// 查看用户详情
function getUserInfo(data) {
    return request({
      url: "/admin/login/getUserInfo",
      method: "get",
      data
    });
  }
  // 退出登陆
  function loginOut(data) {
    return request({
      url: "/admin/login/doLogOut",
      method: "get",
      data
    });
  }
export default {
  goLogin,
  getUserInfo,
  loginOut
};
