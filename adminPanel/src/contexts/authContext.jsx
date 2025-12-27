import {createContext, useContext} from "react";
import { useNavigate } from "react-router-dom";

//api calls
import { signUpReq, signInReq , logOutReq} from "../apiCalls/authCalls";


//redux
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure, errorStart,setAccessToken, defaultState } from '../redux/user/userSlice';
//context
const authContext = createContext();

export const AuthContextProvider = ({children})=>{
    const {error, loading} = useSelector((state)=> state.user)
    const dispatch = useDispatch();


    const signUp = async (user) => {
      dispatch(errorStart());
      dispatch(signInStart());
      const res = await signUpReq(user);

      if (res.ok) {
          dispatch(signInSuccess(res.payload.user));
          dispatch(setAccessToken(res.payload.accessToken))
      }else {
          console.log(res.status, res.message);
          dispatch(signInFailure(res.message));
      }
      return res;
    };

    const signIn = async (user) =>{
      dispatch(errorStart());
      dispatch(signInStart());
      const res = await signInReq(user);
      if(res.ok){
        dispatch(signInSuccess(res.payload.user));
        dispatch(setAccessToken(res.payload.accessToken))
      }else {
          console.log(res.status, res.message);
          dispatch(signInFailure(res.message));
      }
      return res;
    }

    const logOut = async () => {

      dispatch(defaultState());
      const res = await logOutReq();
    };


    return (
        <authContext.Provider value={{signUp, signIn, logOut, error, loading}}>
            {children}
        </authContext.Provider>
    )
      
}


export const useAuthContext = ()=>{
    const context = useContext(authContext)
    if(!context){
        throw new Error("useAuthContext must be used within a provider")
    }
    return context;
}