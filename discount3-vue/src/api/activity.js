import request from '@/utils/request'

export function createActivity(item) {
  const data = new FormData()
  for (const i in item) {
    if (item[i] !== null) {
      data.append(i, item[i])
    }
  }
  return request({
    url: '/api/items/',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    data
  })
}

export function fetchActivity(id) {
  return request({
    url: '/api/items/' + id + '/?_=' + Number(new Date()),
    method: 'get'
  })
}

export function updateActivity(item) {
  if (item.image_url === null || item.audio === null) {
    return request({
      url: '/api/items/' + item.id + '/',
      method: 'patch',
      // headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: item
    })
  } else {
    const data = new FormData()
    for (const i in item) {
      data.append(i, item[i])
    }
    console.log(data.get('audio'))
    return request({
      url: '/api/items/' + item.id + '/',
      method: 'patch',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data
    })
  }
}

export function fetchcategory() {
  return request({
    url: '/api/items/?type=category&_=' + Number(new Date())
  })
}

export function deleteActivity(id) {
  return request({
    url: '/api/items/' + id + '/',
    method: 'delete'
  })
}

export function changeWeight(item) {
  return request({
    url: '/api/items/' + item.id + '/',
    method: 'patch',
    data: item
  })
}

export function getActivity() {
  return request({
    url: '/api/items/?page_size=1000&is_open=1&_=' + Number(new Date())
  })
}
