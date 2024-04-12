import React, {useContext, useState} from 'react';
import {loadStripe, Stripe} from "@stripe/stripe-js";
import {useQuery} from "react-query";
import Toast from "../components/Toast";
import apiClient  from "../Api/ApiClient"

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

type ToastMes= {
    message: string,
    type: "SUCCESS" | "ERROR";
};

type AppContext = {
    showToast: (toastMessage: ToastMes) => void,
    isLoggedIn: boolean;
    stripePromise: Promise<Stripe | null>;
};

const AppContext = React.createContext<AppContext | undefined> (undefined);



const stripePromise = loadStripe(STRIPE_KEY);



export const  AppContextProvider = ({
  children,
} : {
  children : React.ReactNode;
}) => {
  const [toast, setToast ] = useState<ToastMes | undefined> (undefined);

  const { isError} = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  });

  return (
    <AppContext.Provider value = {{
      showToast : (ToastMes) => {
        setToast(ToastMes);
      },
      isLoggedIn: !isError,
      stripePromise,
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