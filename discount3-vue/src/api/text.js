import request from '@/utils/request'

export function createText(item) {
  if (item.img === null) {
    return request({
      url: '/api/texts/',
      method: 'post',
      data: item
    })
  } else {
    const data = new FormData()
    for (const i in item) {
      if (!(item[i] === undefined)) {
        data.append(i, item[i])
      }
    }
    return request({
      url: '/api/texts/',
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data
    })
  }
}

export function fetchText(id) {
  return request({
    url: '/api/texts/' + id + '/?_=' + Number(new Date()),
    method: 'get'
  })
}

export function updateText(item) {
  if (item.img === null) {
    return request({
      url: '/api/texts/' + item.id + '/',
      method: 'patch',
      data: item
    })
  } else {
    const data = new FormData()
    for (const i in item) {
      data.append(i, item[i])
    }
    return request({
      url: '/api/texts/' + item.id + '/',
      method: 'patch',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data
    })
  }
}

export function fetchcategory() {
  return request({
    url: '/api/texts/?type=category&_=' + Number(new Date())
  })
}

export function deleteText(id) {
  return request({
    url: '/api/texts/' + id + '/',
    method: 'delete'
  })
}
