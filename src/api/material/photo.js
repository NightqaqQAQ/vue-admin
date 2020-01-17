import request from '@/api/request';
// 获取列表 //模糊查询
function getPhotoList(data){
    return request({
        url: '/admin/xy/upload/list',
        method: 'post',
        data
    })
}
function delPhoto(data){
    return request({
        url: '/admin/xy/upload/del',
        method: 'get',
        data
    })
}
function checkPhoto(data){
    return request({
        url: '/admin/xy/upload/updateTitle',
        method: 'post',
        data
    })
}
export default{
    getPhotoList,
    delPhoto,
    checkPhoto
}