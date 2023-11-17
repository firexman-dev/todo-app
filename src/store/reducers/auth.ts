import { SET_TOKEN, SET_USER } from "../actions/auth";

  const initialState = {
    token:"",
  };
  
  const reducer = (state = initialState, action:any) => {
    switch (action.type) {
        case SET_USER:
        return {
          ...state,
          user: action.payload,
        };
        case SET_TOKEN:
        return {
          ...state,
          token: action.payload,
        };
        default:
        return state;
    }
  };
  
  export default reducer;