import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/func/auth/webLogin',
    method: 'post',
    data: data
  })
}

export function getInfo(token) {
  return request({
    url: '/func/web/getUserInfo',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/func/web/logout',
    method: 'post'
  })
}
