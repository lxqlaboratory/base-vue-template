import request from '@/utils/request'

export function getMessageTemplateList() {
  return request({
    url: '/func/web/getMessageTemplateList',
    method: 'POST'
  })
}
export function saveMessageTemplateList(messageContent) {
  return request({
    url: '/func/web/saveMessageTemplateList',
    method: 'POST',
    data: {
      messageContent
    }
  })
}
export function deleteMessageTemplateList(id) {
  return request({
    url: '/func/web/deleteMessageTemplateList',
    method: 'POST',
    data: {
      id
    }
  })
}
export function editMessageTemplateList(id,messageContent) {
  return request({
    url: '/func/web/editMessageTemplateList',
    method: 'POST',
    data: {
      id,
      messageContent
    }
  })
}
