import request from '@/utils/request'

export function getViolationInfoByParameterAndMonth() {
  return request({
    url: '/func/web/getViolationInfoByParameterAndMonth',
    method: 'POST'
  })
}
