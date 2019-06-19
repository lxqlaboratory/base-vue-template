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

timeCompareMinute.diffTime= function (startDate, endDate) {
  let date3=endDate.getTime() - startDate.getTime()//时间差的毫秒数
  let days=Math.floor(date3/(24*3600*1000))
  //计算出小时数
  let leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
  let hours=Math.floor(leave1/(3600*1000))
  //计算相差分钟数
  let leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
  let minutes=Math.floor(leave2/(60*1000))
  //计算相差秒数
  let leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
  let seconds=Math.round(leave3/1000)
  console.log(days)
  console.log(hours)
  console.log(seconds)
  let returnStr =''
  if(days>0) {
    returnStr = returnStr+'day:'+days
  }
  if(hours>0) {
    returnStr =returnStr+'h:'+hours
  }
  if(minutes>0) {
    returnStr = returnStr+'m:'+minutes
  }
  if(seconds>0) {
    returnStr = returnStr + 's:' + seconds
  }
  console.log('returnStr'+returnStr)
  console.log(returnStr)
  return returnStr
};
timeCompareMinute.strDateToDate= function (strDate){
  let st = strDate;
  let a = st.split(" ");
  let b = a[0].split("-");
  let c = a[1].split(":");
  let date = new Date(b[0], b[1], b[2], c[0], c[1], c[2]);
  return date;
};
export default timeCompareMinute
