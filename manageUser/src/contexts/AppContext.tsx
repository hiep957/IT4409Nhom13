import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as ApiClient from "../ApiClient";
import { set } from "react-hook-form";
type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  // currentUser: ApiClient.UserType;
  validationData: any;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentUser, setCurrentUser] = useState<
    ApiClient.UserType | undefined
  >(undefined);
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const { error, data: validationData } = useQuery(
    "validateToken",
    ApiClient.validateToken,
    {
      retry: false,
    }
  );

  console.log(validationData);

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !error,

        validationData: validationData,
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};
