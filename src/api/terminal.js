import request from '@/utils/request'

// 实时音视频传输请求
export function mediaTransform(terminalPhone, channelId, dataType) {
  return request({
    url: '/func/web/mediaTransform',
    method: 'POST',
    data: {
      terminalPhone,
      channelId,
      dataType
    }
  })
}

// 实时音视频传输控制
export function realTimeMediaControl(terminalPhone, channelId, controlCode, closeMediaType, changeCode) {
  return request({
    url: '/func/web/mediaTransform',
    method: 'POST',
    data: {
      terminalPhone,
      channelId,
      controlCode,
      closeMediaType,
      changeCode
    }
  })
}

// 摄像头立即拍摄
export function cameraPhoto(terminalPhone, channelId) {
  return request({
    url: '/func/web/cameraPhoto',
    method: 'POST',
    data: {
      terminalPhone,
      channelId
    }
  })
}

// 录音开始
export function voiceRecord(terminalPhone, command, parameter, saveSign, audioSampleRate) {
  return request({
    url: '/func/web/voiceRecord',
    method: 'POST',
    data: {
      terminalPhone,
      command,
      parameter,
      saveSign,
      audioSampleRate
    }
  })
}

// 获取驾驶员信息
export function getTerminalDriverIdentityMsg(terminalPhone) {
  return request({
    url: '/func/web/getTerminalDriverIdentityMsg',
    method: 'POST',
    data: {
      terminalPhone
    }
  })
}

// 查询终端参数
export function getTerminalParam(terminalPhone) {
  return request({
    url: '/func/web/getTerminalParam',
    method: 'POST',
    data: {
      terminalPhone
    }
  })
}

// 查询指定终端参数
export function getTerminalAppointParamQuery(terminalPhone, list) {
  return request({
    url: '/func/web/getTerminalAppointParamQuery',
    method: 'POST',
    data: {
      terminalPhone,
      list
    }
  })
}

// 查询终端属性
export function getTerminalAttributeQuery(terminalPhone) {
  return request({
    url: '/func/web/getTerminalAttributeQuery',
    method: 'POST',
    data: {
      terminalPhone
    }
  })
}

// 设置终端参数
export function setTerminalParam(terminalPhone, list) {
  return request({
    url: '/func/web/setTerminalParam',
    method: 'POST',
    data: {
      terminalPhone,
      list
    }
  })
}

// 车辆控制
export function carControl(terminalPhone, flag) {
  return request({
    url: '/func/web/carControl',
    method: 'POST',
    data: {
      terminalPhone,
      flag
    }
  })
}

// 终端控制
export function terminalControl(terminalPhone, commandCode, commandParam) {
  return request({
    url: '/func/web/terminalControl',
    method: 'POST',
    data: {
      terminalPhone,
      commandCode,
      commandParam
    }
  })
}

// 位置信息查询
export function getTerminalLocationMsg(terminalPhone) {
  return request({
    url: '/func/web/getTerminalLocationMsg',
    method: 'POST',
    data: {
      terminalPhone
    }
  })
}

// 临时位置跟踪控制
export function tempLocationTrack(terminalPhone, interval, validityPeriod) {
  return request({
    url: '/func/web/tempLocationTrack',
    method: 'POST',
    data: {
      terminalPhone,
      interval,
      validityPeriod
    }
  })
}

// 人工确认报警消息
export function manualConfirmAlarm(terminalPhone, alarmFlowId, manualConfirmAlarmType) {
  return request({
    url: '/func/web/manualConfirmAlarm',
    method: 'POST',
    data: {
      terminalPhone,
      alarmFlowId,
      manualConfirmAlarmType
    }
  })
}

// 文本信息下发
export function textMsg(terminalPhone, sign, content) {
  return request({
    url: '/func/web/textMsg',
    method: 'POST',
    data: {
      terminalPhone,
      sign,
      content
    }
  })
}
