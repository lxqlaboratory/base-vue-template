const  timeCompareMinute = {}
timeCompareMinute.timeCompareMinute= function (time1, time2 ) {
  const begin1 = time1.substr(0, 10).split('-')
  const end1 = time2.substr(0, 10).split('-')
  const date1 = new Date(begin1[1] + -+begin1[2] + -+begin1[0])
  const date2 = new Date(end1[1] + -+end1[2] + -+end1[0])
  // 得到两个日期之间的差值m，以分钟为单位
  // Math.abs(date2-date1)计算出以毫秒为单位的差值
  // Math.abs(date2-date1)/1000得到以秒为单位的差值
  // Math.abs(date2-date1)/1000/60得到以分钟为单位的差值
  const m = parseInt(Math.abs(date2 - date1) / 1000 / 60)
  const min1 = parseInt(time1.substr(11, 2)) * 60 + parseInt(time1.substr(14, 2))
  const min2 = parseInt(time2.substr(11, 2)) * 60 + parseInt(time2.substr(14, 2))
  const n = min2 - min1
  const minutes = m + n
  return minutes
};
export default timeCompareMinute
