import request from '@/utils/request'

// 增
export function createUser(data) {
  return request({
    url: '/api/admins/',
    method: 'post',
    data
  })
}
// 删
export function delteUser(id) {
  return request({
    url: '/api/admins/' + id + '/',
    method: 'delete'
  })
}
// 改
export function updateUser(id, data) {
  return request({
    url: '/api/admins/' + id + '/',
    method: 'patch',
    data
  })
}
// 查
export function getUser(params) {
  return request({
    url: '/api/admins/?_=' + Number(new Date()),
    params
  })
}

