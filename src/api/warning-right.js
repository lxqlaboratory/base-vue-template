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
export function getTodayVehicleTextMsgInfo(messageContent) {
  return request({
    url: '/func/web/getTodayVehicleTextMsgInfo',
    method: 'POST',
  })
}
export function getTodayAlarmProcessInfo(messageContent) {
  return request({
    url: '/func/web/getTodayAlarmProcessInfo',
    method: 'POST',
  })
}
