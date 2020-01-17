import request from '@/api/request.js';
// 获取列表(初始化)
function getRoomList(data){
    return request({
        url: '/admin/xy/dorm/list',
        method: 'get',
        data
    })
}
function postAddRoom(data){
    return request({
        url: '/admin/xy/dorm/save',
        method: 'post',
        data
    })
}
function delRoom(data){
    return request({
        url: '/admin/xy/dorm/del',
        method: 'get',
        data
    })
}
function detailRoom(data){
    return request({
        url: '/admin/xy/dorm/detail',
        method: 'get',
        data
    })
}
function postUpdateRoom(data){
    return request({
        url: '/admin/xy/dorm/update',
        method: 'post',
        data
    })
}
export default {
    getRoomList,
    postAddRoom,
    delRoom,
    detailRoom,
    postUpdateRoom
}