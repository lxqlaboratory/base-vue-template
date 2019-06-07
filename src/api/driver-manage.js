import request from '@/utils/request'

export function getDriverList() {
  return request({
    url: '/func/web/getDriverList',
    method: 'POST'
  })
}

export function editDriver(driverName, drivingLicenseNum, identificationCardNum,
                           driverBirth,driverAddress,driverPhoneNum) {
  return request({
    url: '/func/web/editDriverList',
    method: 'POST',
    data: {
      driverName,
      drivingLicenseNum,
      identificationCardNum,
      driverBirth,
      driverAddress,
      driverPhoneNum
    }
  })
}
export function saveDriver(driverName, drivingLicenseNum, identificationCardNum,
                             driverBirth,driverAddress,driverPhoneNum,plateNum) {
    return request({
      url: '/func/web/saveDriverList',
      method: 'POST',
      data: {
        driverName,
        drivingLicenseNum,
        identificationCardNum,
        driverBirth,
        driverAddress,
        driverPhoneNum,
        plateNum
      }
    })
}
export function deleteDriver(identificationCardNum) {
  return request({
    url: '/func/web/deleteDriverList',
    method: 'POST',
    data: {
      identificationCardNum
    }
  })
}
