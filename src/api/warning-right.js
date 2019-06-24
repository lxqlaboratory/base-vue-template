import request from '@/utils/request'

export function getViolationTodayList() {
  return request({
    url: '/func/web/getViolationTodayList',
    method: 'POST'
  })
}
export function getOfflineList(messageContent) {
  return request({
    url: '/func/web/getOfflineList',
    method: 'POST',
  })
}
export function getVehicleTextMsgInfo(messageContent) {
  return request({
    url: '/func/web/getVehicleTextMsgInfo',
    method: 'POST',
  })
}
