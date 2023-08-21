import { createContext, useReducer } from "react";

export const Store = createContext();
const initialState = {
  vendorInfo: localStorage.getItem("vendorInfo")
    ? JSON.parse(localStorage.getItem("vendorInfo"))
    : null,
};
function reducer(state, action) {
  switch (action.type) {
    case "VENDOR_SIGNIN":
      return { ...state, vendorInfo: action.payload };
    case "VENDOR_SIGNOUT":
      return { ...state, vendorInfo: null };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
