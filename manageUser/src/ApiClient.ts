import { UserUpdate } from "./pages/Update";
import { LoginFormData } from "./pages/Login";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export type UserType = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  date: string;
  phone: string;
  hometown: string;
  role: string;
  isDeleted: boolean;
  fullName: string;
  _id: string;
};

export const fetchCurrentUser = async (id:string): Promise<UserType> => {
  const response = await fetch(`http://localhost:7000/api/user/view_user/${id}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching user");
  }
  return response.json();
};

export const SignIn = async (formData: LoginFormData) => {
  const response = await fetch(`http://localhost:7000/api/user/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const validateToken = async () => {
  const response = await fetch(
    `http://localhost:7000/api/user/validate-token`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    console.log(response);
    throw new Error("Token invalid");
  }

  return response.json();
};

export const signOut = async () => {
  const response = await fetch(`http://localhost:7000/api/user/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error signing out");
  }
}

export const updateUser = async(data: UserUpdate):Promise<UserUpdate> => {
  console.log(JSON.stringify(data));
  const {_id,...dataUser} = data;
  console.log(_id);
  const response = await fetch(`http://localhost:7000/api/user/edit-info/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(dataUser),
  });

  if (!response.ok) {
    throw new Error("Error updating user");
  }
  return response.json();
};

export const listUsers = async (page: number, limit: number, sortOption?: any, name?: string) => {
  const response = await fetch(`http://localhost:7000/api/user/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ page, limit, sortOption, name }),
  });

  if (!response.ok) {
    throw new Error("Error fetching users");
  }
  return response.json();
};

export const deleteUser = async (userId: string) => {
  const response = await fetch(`http://localhost:7000/api/user/delete-user/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error deleting user");
  }
  return response.json();
}


