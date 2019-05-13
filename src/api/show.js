import request from '@/utils/request'

export function getCarList(carName) {
  return request({
    url: '/func/web/getCarList',
    method: 'POST',
    carName
  })
}

