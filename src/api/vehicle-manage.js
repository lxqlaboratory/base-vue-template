import request from '@/utils/request'

export function getCarList() {
  return request({
    url: '/func/web/getCarList',
    method: 'POST'
  })
}
