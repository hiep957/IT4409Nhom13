import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import * as ApiClient from "../Api/ApiClient";
import { useAppContext } from "../contexts/AppContext";

export type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};
const Register = () => {
  const QueryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();
  const mutation = useMutation(ApiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Registration Success!", type: "SUCCESS" });
      await QueryClient.invalidateQueries("validateToken");
      navigate("/");
    },
  });
  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });
  return (
    <form
      className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 items-center  "
      onSubmit={onSubmit}
    >
      <h2 className="text-3xl font-bold mb-5">Create an Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-blue-700 text-sm font-bold flex-1">
          First Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("firstName", { required: "This field is required" })}
          ></input>
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>

        <label className="text-blue-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("lastName", { required: "This field is required" })}
          ></input>
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
      <label className="text-blue-600 text-sm font-bold flex-1">
        Email{" "}
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "This field is required" })}
        ></input>
        {errors.email && (
          <span className="text-red-500"> {errors.email.message}</span>
        )}
      </label>
      <label className="text-blue-500 text-sm font-bold flex-1 ">
        Password{" "}
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        ></input>
        {errors.password && (
          <span className="text-red-500"> {errors.password.message}</span>
        )}
      </label>
       <label className="text-blue-500 text-sm font-bold flex-1 mb-10">
    ConfirmPassword{" "}
    <input
      type="password"
      className="border rounded w-full py-1 px-2 font-normal"
      {...register("confirmPassword", {
        validate: (val) => {
          if (!val) {
            return "This field is required";
          } else {
            if (watch("password") !== val) {
              return "Your password do no match";
            }
          }
        },
      })}
    ></input>
    {errors.confirmPassword && (
      <span className="text-red-500">
        {" "}
        {errors.confirmPassword.message}
      </span>
    )}
  </label>
      <span className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl my-5 "
        >
          Create Account
        </button>
      </span>
    </form>
  );
};

export default Register;
