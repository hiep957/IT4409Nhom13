import { RegisterForm } from "../Pages/Register"
import { LoginForm } from "../Pages/Login"

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
