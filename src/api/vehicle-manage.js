import request from '@/utils/request'

export function getCarList() {
  return request({
    url: '/func/web/getCarList',
    method: 'POST'
  })
}
export function insertViolation(terminalPhone, violationContent,longitude, latitude) {
  return request({
    url: '/func/web/saveVehicleViolationProcessInfo',
    method: 'POST',
    data: {
      terminalPhone,
      violationContent,
      longitude,
      latitude
    }
  })
}
