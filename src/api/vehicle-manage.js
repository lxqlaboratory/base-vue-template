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
export function editCarList(vehicleId,plateNum,simNum,fleetName,driverId,ownerName,ownerPhoneNum) {
  return request({
    url: '/func/web/editCarList',
    method: 'POST',
    data: {
      vehicleId,
      plateNum,
      simNum,
      fleetName,
      driverId,
      ownerName,
      ownerPhoneNum
    }
  })
}
export function saveCarList(plateNum,simNum,fleetName,driverId,ownerName,ownerPhoneNum) {
  return request({
    url: '/func/web/saveCarList',
    method: 'POST',
    data: {
      plateNum,
      simNum,
      fleetName,
      driverId,
      ownerName,
      ownerPhoneNum
    }
  })
}
export function deleteCarList(vehicleId) {
  return request({
    url: '/func/web/deleteCarList',
    method: 'POST',
    data: {
      vehicleId
    }
  })
}
