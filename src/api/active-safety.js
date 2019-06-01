import request from '@/utils/request'

export function getViolationInfoByParameterAndMonth() {
  return request({
    url: '/func/web/getViolationInfoByParameterAndMonth',
    method: 'POST'
  })
}
export function getViolationInfoByMonth() {
  return request({
    url: '/func/web/getViolationInfoByMonth',
    method: 'POST'
  })
}
export function getViolationInfoByEveryParameter() {
  return request({
    url: '/func/web/getViolationInfoByEveryParameter',
    method: 'POST'
  })
}
