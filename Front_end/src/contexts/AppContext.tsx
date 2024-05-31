import React, {useContext, useState} from 'react';

import {useQuery} from "react-query";
import Toast from "../components/Toast";
import * as ApiClient  from "../Api/ApiClient"
import { Stripe, loadStripe } from '@stripe/stripe-js';

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

type ToastMes= {
    message: string,
    type: "SUCCESS" | "ERROR";
};

type AppContext = {
    showToast: (toastMessage: ToastMes) => void,
    isLoggedIn: boolean;
    stripePromise: Promise<Stripe | null>;
    role: string;
};

const AppContext = React.createContext<AppContext | undefined> (undefined);



const stripePromise = loadStripe(STRIPE_KEY);



export const  AppContextProvider = ({
  children,
} : {
  children : React.ReactNode;
}) => {
  const [toast, setToast ] = useState<ToastMes | undefined> (undefined);

  const { isError} = useQuery("validateToken", ApiClient.validateToken, {
    retry: false,
  });
  const {data: user} = useQuery("viewInfo", ApiClient.viewInfo);
  console.log(user);
  return (
    <AppContext.Provider value = {{
      showToast : (ToastMes) => {
        setToast(ToastMes);
      },
      isLoggedIn: !isError,
      stripePromise,
      role: user?.role || "",
    }}>
      {toast && (
        <Toast 
          message = {toast.message}
          type = {toast.type}
          onClose = {() => setToast(undefined)} 
      />
    )}
    {children}
    </AppContext.Provider>
  );
};

export const useAppContext =  () => {
  const  context = useContext(AppContext);
  return context as AppContext;
}