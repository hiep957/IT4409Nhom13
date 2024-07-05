import React, { useState, useEffect } from "react";
import Modal from "../components/Modal"; // Đường dẫn có thể thay đổi tùy theo cấu trúc thư mục của bạn
import { UserType } from "../ApiClient";
import { useMutation, useQueryClient } from "react-query";
import * as ApiClient from "../ApiClient"; // Đường dẫn có thể thay đổi tùy theo cấu trúc thư mục của bạn
import { useAppContext } from "../contexts/AppContext";
import { set } from "react-hook-form";
interface UpdateProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  currentUser: UserType;
}

export type UserUpdate = {
  email: string;
  firstName: string;
  lastName: string;
  hometown: string;
  phone: string;
  gender: string;
  fullName: string;
  _id: string;
};

const Update: React.FC<UpdateProps> = ({
  showModal,
  setShowModal,
  currentUser,
}) => {
  const { showToast } = useAppContext();
  const [email, setEmail] = useState(currentUser.email);
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [gender, setGender] = useState(currentUser.gender);
  const [hometown, setHometown] = useState(currentUser.hometown);
  const [phone, setPhone] = useState(currentUser.phone);
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [_id, setId] = useState(currentUser._id);
  const queryClient = useQueryClient();
  useEffect(() => {
    setEmail(currentUser.email);
    setFirstName(currentUser.firstName);
    setLastName(currentUser.lastName);
    setGender(currentUser.gender);
    setHometown(currentUser.hometown);
    setPhone(currentUser.phone);
    setFullName(currentUser.fullName);
    setId(currentUser._id);
  }, [currentUser]);
  console.log("Update:", currentUser);
  const { mutate, isLoading } = useMutation(ApiClient.updateUser, {
    onSuccess: () => {
      showToast({ message: "Cập nhật thông tin thành công", type: "SUCCESS" });
      queryClient.invalidateQueries("currentUser");
      setShowModal(false);
      
    },
    onError: () => {
      showToast({ message: "Cập nhật thông tin thất bại", type: "ERROR" });
    },
  });

  const handleSave = (data: UserUpdate) => {
    mutate(data);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataUser: UserUpdate = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      hometown: hometown,
      phone: phone,
      fullName: fullName,
      _id: _id,
    };

    handleSave(dataUser);
  };

  return (
    <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
      <div className="flex flex-col">
        <p className="flex items-center justify-center text-xl mb-2">
          Chỉnh sửa thông tin tài khoản
        </p>
        <form action="" className="flex flex-col space-x-4" onSubmit={onSubmit}>
          <div className="flex flex-row">
            <div className="flex flex-col w-1/2 ml-4">
              <label className="flex flex-col">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-2"
                />
              </label>
              <label className="flex flex-col">
                Tên
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border p-2"
                />
              </label>
              <label className="flex flex-col">
                Họ
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border p-2"
                />
              </label>
            </div>
            <div className="flex flex-col w-1/2 ml-4 mr-4">
              <label className="flex flex-col">
                Giới tính
                <input
                  type="text"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="border p-2"
                />
              </label>
              <label className="flex flex-col">
                Quê quán
                <input
                  type="text"
                  value={hometown}
                  onChange={(e) => setHometown(e.target.value)}
                  className="border p-2"
                />
              </label>
              <label className="flex flex-col">
                Số điện thoại
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border p-2"
                />
              </label>
              <label className="flex flex-col">
                FullName
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border p-2"
                />
              </label>
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="mt-2 p-2 bg-blue-200 rounded hover:bg-blue-300 transition duration-1000 ">
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default Update;
