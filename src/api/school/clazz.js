import request from '@/api/request';
// 获取列表 //模糊查询
function getClazzList(data){
    return request({
        url: '/admin/xy/clazz/list',
        method: 'get',
        data
    })
}
// 添加信息
function postAddClazz(data){
    return request({
        url:'/admin/xy/clazz/save',
        method: 'post',
        data
    })
}
// 删除信息
function delClazz(data){
    return request({
        url:'/admin/xy/clazz/del',
        method: 'get',
        data
    })
}
// 详情
function detailClazz(data){
    return request({
        url:'/admin/xy/clazz/detail',
        method: 'get',
        data
    })
}
// 修改信息
function postUpdateClazz(data){
    return request({
        url:'/admin/xy/clazz/update',
        method: 'post',
        data
    })
}
export default {
    getClazzList,
    postAddClazz,
    delClazz,
    detailClazz,
    postUpdateClazz
}