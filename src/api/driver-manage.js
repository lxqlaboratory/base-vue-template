import request from '@/utils/request'

export function getDriverList() {
  return request({
    url: '/func/web/getDriverList',
    method: 'POST'
  })
}

export function editDriver(driverName, drivingLicenseNum, driverPhoneNum) {
  return request({
    url: '/func/web/editDriverList',
    method: 'POST',
    data: {
      driverName,
      drivingLicenseNum,
      driverPhoneNum
    }
  })
}
