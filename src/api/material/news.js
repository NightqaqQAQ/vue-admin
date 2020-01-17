import request from "@/api/request";
// 获取列表 //模糊查询
function getNewList(data) {
  return request({
    url: "/admin/xy/news/list",
    method: "get",
    data
  });
}
function addNew(data) {
  return request({
    url: "/admin/xy/news/save",
    method: "post",
    data
  });
}
function delNew(data) {
  return request({
    url: "/admin/xy/news/del",
    method: "get",
    data
  });
}
function detailsNew(data) {
  return request({
    url: "/admin/xy/news/detail",
    method: "get",
    data
  });
}
function updataNew(data) {
  return request({
    url: "/admin/xy/news/update",
    method: "post",
    data
  });
}

export default {
  getNewList,
  addNew,
  delNew,
  detailsNew,
  updataNew
};
