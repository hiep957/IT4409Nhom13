import { useQuery } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import * as ApiClient from "../ApiClient";
import Modal from "../components/Modal";
import { useState } from "react";
import Update from "./Update";
import { Link } from "react-router-dom";

const Detail = () => {
  const [showModal, setShowModal] = useState(false);
  const { validationData } = useAppContext();

  const {
    data: currentUser,
    isLoading,
    error,
  } = useQuery(
    "currentUser",
    () => ApiClient.fetchCurrentUser(validationData.userId as string),
    {
      retry: false,
      enabled: !!validationData?.userId,
    }
  );
  console.log(currentUser);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;
  if (!currentUser) return <div>No user data available</div>;

  return (
    <div className="mt-5 rounded">
      <h1 className="text-xl flex items-center justify-center">
        Thông tin chi tiết tài khoản
      </h1>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 bg-blue-200 rounded hover:bg-blue-300 transition duration-1000"
      >
        Chỉnh sửa thông tin của bạn
      </button>
      <div className="text-md flex flex-row mt-5">
        <div className="w-1/2 flex flex-col space-y-4 p-2">
          <div className="border-b-2">
            <p className="text-sm">Email</p>
            <p className="font-bold">{currentUser.email}</p>
          </div>
          <div className="border-b-2">
            <p className="text-sm">Tên</p>
            <p className="font-bold">{currentUser.lastName}</p>
          </div>
          <div className="border-b-2">
            <p className="text-sm">Họ</p>
            <p className="font-bold">{currentUser.firstName}</p>
          </div>
          <div className="border-b-2">
            <p className="text-sm">Tên người dùng</p>
            <p className="font-bold">{currentUser.fullName}</p>
          </div>
        </div>
        <div className="w-1/2 flex flex-col space-y-4 p-2">
          <div className="border-b-2">
            <p className="text-sm">Quê quán</p>
            <p className="font-bold">
              {currentUser.hometown || "Đang cập nhật"}
            </p>
          </div>
          <div className="border-b-2">
            <p className="text-sm">Số điện thoại</p>
            <p className="font-bold">{currentUser.phone || "Đang cập nhật"}</p>
          </div>
          <div className="border-b-2">
            <p className="text-sm">Giới tính</p>
            <p className="font-bold">{currentUser.gender || "Đang cập nhật"}</p>
          </div>
        </div>
      </div>
      <Update
        showModal={showModal}
        setShowModal={setShowModal}
        currentUser={currentUser}
      />
      <div className="mt-4">
        {currentUser.role === "admin" ? (
          <>
            <p className="mb-2">Bạn là admin, bạn có thể xem danh sách sinh viên</p>
            <Link
              to="/me/danhsach"
              className="bg-blue-200 hover:bg-blue-300 p-2 rounded-sm transition duration-1000 "
            >
              Danh Sách User
            </Link>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Detail;
