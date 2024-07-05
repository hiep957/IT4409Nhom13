import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOut from "./SignOut";
import { useQuery } from "react-query";
import * as ApiClient from "../ApiClient";
const Header = () => {
  const { isLoggedIn,validationData } = useAppContext();
  console.log(isLoggedIn);
  const { data: currentUser } = useQuery(
    "currentUser",
    () => ApiClient.fetchCurrentUser(validationData.userId as string),
    {
      retry: false,
    }
  );
  return (
    <div className="flex justify-between items-center p-4 bg-slate-200">
      <div>Quản lý User</div>

      {isLoggedIn  ? (
        <>
          <div className="flex space-x-2">
            <div className="flex flex-col">
              <div>
               
                Xin chào {currentUser?.firstName} {currentUser?.lastName}
              </div>
              <div>Bạn là {currentUser?.role}</div>
            </div>

            <SignOut></SignOut>
          </div>
        </>
      ) : (
        <>
          <div className="space-x-5">
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
            >
              Đăng nhập
            </Link>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
            >
              Đăng ký
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
