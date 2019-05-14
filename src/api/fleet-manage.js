import request from '@/utils/request'

export function getFleetList() {
  return request({
    url: '/func/web/getFleetList',
    method: 'POST'
  })
}
