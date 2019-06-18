const  gpsToBaiduPoint = {}
// 要全局的变量的话
gpsToBaiduPoint.resultPoint = []
// 定义方法
gpsToBaiduPoint.GpsToBaiduPoint= function (lat, lng ) {
  let _t = gpsToBaiduPoint.wgs2bd(lat, lng)
  gpsToBaiduPoint.resultPoint=_t
  return _t

};
gpsToBaiduPoint.wgs2bd= function (lat, lon) {
  let wgs2gcjR = gpsToBaiduPoint.wgs2gcj(lat, lon)
  let gcj2bdR = gpsToBaiduPoint.gcj2bd(wgs2gcjR[0], wgs2gcjR[1])
  return gcj2bdR
};
gpsToBaiduPoint.wgs2gcj= function(lat, lon){
  let pi = 3.14159265358979324
  let a = 6378245.0
  let ee = 0.00669342162296594323
  let x_pi = 3.14159265358979324 * 3000.0 / 180.0
  let dLat = gpsToBaiduPoint.transformLat(lon - 105.0, lat - 35.0)
  let dLon = gpsToBaiduPoint.transformLon(lon - 105.0, lat - 35.0)
  let radLat = lat / 180.0 * pi
  let magic = Math.sin(radLat)
  magic = 1 - ee * magic * magic
  let sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi)
  dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi)
  let mgLat = lat + dLat
  let mgLon = lon + dLon
  let result = []
  result.push(mgLat)
  result.push(mgLon)
  return result
};
gpsToBaiduPoint.transformLat= function(lat, lon){
  let pi = 3.14159265358979324
  let a = 6378245.0
  let ee = 0.00669342162296594323
  let x_pi = 3.14159265358979324 * 3000.0 / 180.0
  let ret = -100.0 + 2.0 * lat + 3.0 * lon + 0.2 * lon * lon + 0.1 * lat * lon + 0.2 * Math.sqrt(Math.abs(lat))
  ret += (20.0 * Math.sin(6.0 * lat * pi) + 20.0 * Math.sin(2.0 * lat * pi)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lon * pi) + 40.0 * Math.sin(lon / 3.0 * pi)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(lon / 12.0 * pi) + 320 * Math.sin(lon * pi / 30.0)) * 2.0 / 3.0
  return ret
};

gpsToBaiduPoint.transformLon= function(lat, lon){
  let pi = 3.14159265358979324
  let a = 6378245.0
  let ee = 0.00669342162296594323
  let x_pi = 3.14159265358979324 * 3000.0 / 180.0
  let ret = 300.0 + lat + 2.0 * lon + 0.1 * lat * lat + 0.1 * lat * lon + 0.1 * Math.sqrt(Math.abs(lat))
  ret += (20.0 * Math.sin(6.0 * lat * pi) + 20.0 * Math.sin(2.0 * lat * pi)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lat * pi) + 40.0 * Math.sin(lat / 3.0 * pi)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(lat / 12.0 * pi) + 300.0 * Math.sin(lat / 30.0 * pi)) * 2.0 / 3.0
  return ret
};
gpsToBaiduPoint.gcj2bd= function(lat, lon){
  let pi = 3.14159265358979324
  let a = 6378245.0
  let ee = 0.00669342162296594323
  let x_pi = 3.14159265358979324 * 3000.0 / 180.0
  let x = lon;
  let y = lat
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
  let bd_lon = z * Math.cos(theta) + 0.0065
  let bd_lat = z * Math.sin(theta) + 0.006
  let result = []
  result.push(bd_lat)
  result.push(bd_lon)
  return result
};
export default gpsToBaiduPoint
