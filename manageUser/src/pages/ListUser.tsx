import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as ApiClient from "../ApiClient";
import { useAppContext } from "../contexts/AppContext";
import SearchBar from "../components/SearchBar";

interface User {
  fullName: string;
  firstName: string;
  hometown: string;
  gender: string;
  phone: string;
  lastName: string;
  email: string;
  isDeleted: boolean;
  role: string;
  _id: string;
  // Thêm các trường khác nếu cần
}

interface UsersResponse {
  message: string;
  page: number;
  limit: number;
  user: User[];
}

const ListUser = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [sortOption, setSortOption] = useState(1);
  const [name, setName] = useState<string | undefined>(undefined);

  const {
    data: users,
    isLoading,
    isError,
    refetch,
  } = useQuery<UsersResponse>(
    ["listUser", page, limit, sortOption, name],
    () => ApiClient.listUsers(page, limit, sortOption, name),
    {
      keepPreviousData: true,
      staleTime: 5000, // Optional: Giữ dữ liệu cũ trong 5 giây
    }
  );

  const deleteMutation = useMutation(ApiClient.deleteUser, {
    onSuccess: () => {
      showToast({ message: "Delete user successfully", type: "SUCCESS" });
      queryClient.invalidateQueries("listUser");
    },
  });
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };
  console.log(name);

  useEffect(() => {
    refetch();
  }, [page, limit, sortOption, name, refetch]);

  const handlePageChange = (newPage: number) => {
    if (newPage !== page) {
      setPage(newPage);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !users) return <div>Error occurred</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">List User</h2>
      <div className="flex justify-center items-center p-2 mb-4">
        <SearchBar setName={setName}></SearchBar>
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">STT</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">FristName</th>
            <th className="px-4 py-2 border">LastName</th>
            <th className="px-4 py-2 border">FullName</th>
            <th className="px-4 py-2 border">Phone</th>
            <th className="px-4 py-2 border">isDeleted</th>
            <th className="px-4 py-2 border">Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.user.map((user, index) => (
            <tr key={index} className="text-center">
              <td className="px-4 py-2 border">
                {index + 1 + (page - 1) * limit}
              </td>
              <td className="px-4 py-2 border">{user.email}</td>
              <td className="px-4 py-2 border">{user.role}</td>
              <td className="px-4 py-2 border">{user.firstName}</td>

              <td className="px-4 py-2 border">{user.lastName}</td>
              <td className="px-4 py-2 border">{user.fullName}</td>
              <td className="px-4 py-2 border">{user.phone}</td>
              <td className="px-4 py-2 border">
                {user.isDeleted ? "Yes" : "No"}
              </td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleDelete(user._id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={users.user.length < limit}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListUser;
