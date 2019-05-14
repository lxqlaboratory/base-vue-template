import request from '@/utils/request'

export function getDriverList() {
  return request({
    url: '/func/web/getDriverList',
    method: 'POST'
  })
}
