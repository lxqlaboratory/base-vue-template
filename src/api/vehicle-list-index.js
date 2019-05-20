import request from '@/utils/request'

export function getTreeVehicleFormList() {
  return request({
    url: '/func/web/getTreeVehicleFormList',
    method: 'POST'
  })
}
