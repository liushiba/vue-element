import request from '@/utils/request'

export function fetchRecord(params) {
  return request({
    url: '/api/records/?_=' + Number(new Date()),
    method: 'get',
    params
  })
}

export function multiRecord(data) {
  return request({
    url: '/api/records/',
    method: 'post',
    data
  })
}
export function updateRecord(id, data) {
  return request({
    url: '/api/records/' + id + '/',
    method: 'patch',
    data
  })
}

export function fetchNew(id) {
  return request({
    url: '/api/records/new/?_=' + Number(new Date()),
    method: 'get',
    params: id
  })
}

// 删
export function delteRecord(id, data = []) {
  return request({
    url: '/api/records/' + id + '/',
    method: 'delete',
    data: data
  })
}
