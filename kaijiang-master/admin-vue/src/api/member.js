import request from '@/utils/request'

// 增
export function createMember(data) {
  return request({
    url: '/api/members/',
    method: 'post',
    data
  })
}
// 删
export function delteMember(id) {
  return request({
    url: '/api/members/' + id + '/',
    method: 'delete'
  })
}
// 改
export function updateMember(id, data) {
  return request({
    url: '/api/members/' + id + '/',
    method: 'patch',
    data
  })
}
// 查
export function getMember(params) {
  return request({
    url: '/api/members/',
    params
  })
}

