import cookie from "js-cookie";
 
export const SetCookie = (key:any, value:any) => cookie.set(key, value, { expires: 7 });
 
export const GetCookie = (name:any) => cookie.get(name);
 
export const RemoveCookie = (name:any)=> cookie.remove(name);