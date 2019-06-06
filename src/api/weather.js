import axios from "axios";
export function getWeatherInfo({lng,lat}){
  let url = '/v3/weather?ak=3ktrkqQ4iISBiphzz8mkrZ68&output=json&location='+lng+','+lat+''
  return axios.get(url).then(response => {
    return Promise.resolve(response.data)
  })
}
