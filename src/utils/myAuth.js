import Cookies from "js-cookie";

const TokenKey = "1909";

export function getToken() {
  var token = localStorage.getItem(TokenKey); //获取token
  if(token==null&&token=='undefined'){ 
      return null
  }
  return JSON.parse(token)
}

export function setToken(token) {
  //存入token
  window.localStorage.setItem(TokenKey, JSON.stringify(token));
}

export function removeToken() {
  window.localStorage.removeItem(TokenKey)
}
