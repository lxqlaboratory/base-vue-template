const  getCurrentTime = {}
getCurrentTime.getCurrentTime= function (time1, time2 ) {
  // 得到的样式是 2019-06-10 10:08:35
  const now = new Date()
  const year = now.getFullYear() // 年
  const month = now.getMonth() + 1 // 月
  const day = now.getDate() // 日
  const hh = now.getHours() // 时
  const mm = now.getMinutes() // 分
  const ss = now.getSeconds() // 秒
  let clock = year + '-'
  if (month < 10) { clock += '0' }
  clock += month + '-'
  if (day < 10) { clock += '0' }
  clock += day + ' '
  if (hh < 10) { clock += '0' }
  clock += hh + ':'
  if (mm < 10) clock += '0'
  clock += mm + ':'
  if (ss < 10) clock += '0'
  clock += ss
  return (clock)
};
export default getCurrentTime
