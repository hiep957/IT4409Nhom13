import { useForm } from "react-hook-form";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import * as ApiClient from "../ApiClient";
export type LoginFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormData>();
  const mutation = useMutation(ApiClient.SignIn, {
    onSuccess: async () => {
      showToast({
        message: "Sign In Success",
        type: "SUCCESS",
      });
      await queryClient.invalidateQueries("validateToken");
      navigate("/me");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });
  return (
    <div className="flex justify-center items-center min-h-screen">
      <form action="" className=" bg-gray-300 p-4 space-y-3 rounded" onSubmit={onSubmit}>
        <label className="flex flex-row">
          <div className="w-[70px]">Email</div>
          <input
            type="email"
            className="rounded"
            {...register("email", { required: "This field is required" })}
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </label>
        <label className="flex flex-row">
          <div className="w-[70px]">Password</div>
          <input
            type="password"
            className="rounded"
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </label>

        <div className="flex justify-center">
          <button className="rounded bg-blue-500 hover:bg-blue-700 py-2 px-4 text-white">
            {" "}
            Đăng nhập
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
