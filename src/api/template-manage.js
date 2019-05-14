import request from '@/utils/request'

export function getMessageTemplateList() {
  return request({
    url: '/func/web/getMessageTemplateList',
    method: 'POST'
  })
}
