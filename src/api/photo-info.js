import request from '@/utils/request'

export function getVehiclePhotoInfoList(terminalPhone, startTime, endTime) {
  return request({
    url: '/func/web/getVehiclePhotoInfoList',
    method: 'POST',
    data: {
      terminalPhone,
      startTime,
      endTime
    }
  })
}
