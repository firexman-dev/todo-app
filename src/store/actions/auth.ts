
export const SET_TOKEN = "SET_TOKEN";
export const setToken = (data:any) => ({
  type: SET_TOKEN,
  payload: data,
});

export const SET_USER = "SET_USER";
export const setUser = (data:any) => ({
  type: SET_USER,
  payload: data,
});