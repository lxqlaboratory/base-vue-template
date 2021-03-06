import request from '@/utils/request'

export function getViolationQueryFormList() {
  return request({
    url: '/func/web/getVueAllViolationInfo',
    method: 'POST'
  })
}
export function getVehicleMonitoringViolationType() {
  return request({
    url: '/func/web/getVehicleMonitoringViolationType',
    method: 'POST'
  })
}
export function getViolationAlarmFormList() {
  return request({
    url: '/func/web/getVueAlarmProcessInfo',
    method: 'POST'
  })
}
export function getAlarmProcessContentInfo() {
  return request({
    url: '/func/web/getAlarmProcessContentInfo',
    method: 'POST'
  })
}

export function getUserMassageFormList() {
  return request({
    url: '/func/web/getVueUserMassageInfo',
    method: 'POST'
  })
}
export function getVueAllOnlineRecordingInfo() {
  return request({
    url: '/func/web/getVueAllOnlineRecordingInfo',
    method: 'POST'
  })
}
export function getAllVehicleTextMsgInfo() {
  return request({
    url: '/func/web/getAllVehicleTextMsgInfo',
    method: 'POST'
  })
}

