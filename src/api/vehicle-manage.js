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
export function saveCarList(plateNum,simNum,fleetName,driverId,ownerName,ownerPhoneNum,businessScope1, lineType1,transportCertificateNum1,nameplateType1
  ,boolSleeper,vehicleType1,fuelType1,plateColor1 , nameplateBrand1 , busRank1 , transportCertificateWord1 , operationStatus1
  ,vehicleLength , vehicleWidth, vehicleHeight,  vehicleTonnage,  availableRice,  availableVolume, availableWeight) {
  return request({
    url: '/func/web/saveCarList',
    method: 'POST',
    data: {
      plateNum,
      simNum,
      fleetName,
      driverId,
      ownerName,
      ownerPhoneNum,businessScope1, lineType1,
      transportCertificateNum1,nameplateType1
      ,boolSleeper,vehicleType1,fuelType1,plateColor1 ,
      nameplateBrand1 , busRank1 ,
      transportCertificateWord1 , operationStatus1
      ,vehicleLength , vehicleWidth, vehicleHeight,
      vehicleTonnage,  availableRice,
      availableVolume, availableWeight
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
