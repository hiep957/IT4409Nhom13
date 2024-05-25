import { RegisterForm } from "../Pages/Register"
import { LoginForm } from "../Pages/Login"
import {UserInfoForm} from "../Pages/InfoUser"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/user/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};
export const register = async (formData: RegisterForm) => {
  const response = await fetch(`${API_BASE_URL}/user/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};
export const login = async (formData: LoginForm) => {
  const response = await fetch(`${API_BASE_URL}/user/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/user/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

export const viewInfo = async (): Promise<UserInfoForm> => {
  const response = await fetch(`${API_BASE_URL}/user/view_user`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching user");
  }
  return response.json();
}
export const updateInfo = async (data: UserInfoForm) => {
  const response = await fetch(`${API_BASE_URL}/user/edit-info`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error updating info');
  }
  return response.json();
};
