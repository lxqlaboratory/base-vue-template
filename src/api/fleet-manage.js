import request from '@/utils/request'

export function getFleetList() {
  return request({
    url: '/func/web/getFleetList',
    method: 'POST'
  })
}
export function editFleet(companyId, companyName, address,
                          telephone,manager) {
  return request({
    url: '/func/web/editFleetList',
    method: 'POST',
    data: {
      companyId,
      companyName,
      address,
      telephone,
      manager
    }
  })
}
export function saveFleet(companyName, address, telephone, manager) {
  return request({
    url: '/func/web/saveFleetList',
    method: 'POST',
    data: {
      companyName,
      address,
      telephone,
      manager
    }
  })
}
export function deleteFleet(companyId) {
  return request({
    url: '/func/web/deleteFleetList',
    method: 'POST',
    data: {
      companyId
    }
  })
}
