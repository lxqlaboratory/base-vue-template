import request from '@/utils/request'

export function getTreeVehicleFormList() {
  return request({
    url: '/func/web/getTreeVehicleFormList',
    method: 'POST'
  })
}

export function getVehiclePositionFromList(phoneNum, trackPlaybackStartTime, trackPlaybackEndTime) {
  return request({
    url: '/func/web/getVehiclePositionFromList',
    method: 'POST',
    data: {
      phoneNum,
      trackPlaybackStartTime,
      trackPlaybackEndTime
    }
  })
}
export function getSelectedVehiclePosition(plateNum) {
  return request({
    url: '/func/web/getSelectedVehiclePosition',
    method: 'POST',
    data: {
      plateNum
    }
  })
}
