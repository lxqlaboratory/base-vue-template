import request from '@/utils/request'

export function getViolationInfoByParameters() {
  return request({
    url: '/func/web/getViolationInfoByParameters',
    method: 'POST'
  })
}
