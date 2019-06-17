import axios from "axios";
export function getLocationDetailInfo({lng,lat}){
  let url = '/v2/?location='+lat+','+lng+'&output=json&pois=1&ak=YZk52XHYbwtDoWnnlDO53ysCNBHCG0v6'
  //console.log("这是url"+url)
  return axios.get(url).then(response => {
    return Promise.resolve(response.data)
  })
}
