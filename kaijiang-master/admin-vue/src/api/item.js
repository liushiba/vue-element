import request from '@/utils/request'

// 增
export function createItem(data) {
  return request({
    url: '/api/items/',
    method: 'post',
    data
  })
}
// 删
export function delteItem(id, data = []) {
  return request({
    url: '/api/items/' + id + '/',
    method: 'delete',
    data: data
  })
}
// 改
export function updateItem(id, data) {
  return request({
    url: '/api/items/' + id + '/',
    method: 'patch',
    data
  })
}
// 查
export function getItem(params) {
  return request({
    url: '/api/items/',
    params
  })
}

