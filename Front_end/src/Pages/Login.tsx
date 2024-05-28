import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as ApiClient from "../Api/ApiClient";
import { useAppContext } from "../contexts/AppContext";
import { useMutation, useQueryClient } from "react-query";

export type LoginForm = {
  email: string;
  password: string;
};

const Login = () => {
  const QueryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const location = useLocation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginForm>();

  const mutation = useMutation(ApiClient.login, {
    onSuccess: async () => {
      showToast({ message: "Sign in successfully", type: "SUCCESS" });
      await QueryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || "/");
    },
    onError: async (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });
  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (

    <body className="h-screen flex justify-start items-center bg-cover bg-center" style={{ backgroundImage: "url('/image/Booking Hotel.png')" }}>
      <form className="max-w-md w-full bg-white bg-opacity-85 rounded-lg shadow-md p-8 ml-28 " onSubmit={onSubmit}>
        <h2 className="font-bold text-[32px] mb-3"> Sign In</h2>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
           
           
            className="block py-2 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            {...register("email", {required: "This field is required"})}
          />
          <label
           
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            {errors.email && (
              <span className="text-red-500"> {errors.email.message}</span>
            )}
            Email address
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            id="floating_password"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <label
            htmlFor="floating_password"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            {errors.password && (
              <span className="text-red-500"> {errors.password.message}</span>
            )}
            Password
          </label>
        </div>
        <span>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
        </span>
        <div className="text-sm">
          Not Registered?{" "}
          <Link className="underline" to="/register">
            Create an account here
          </Link>
        </div>
      </form>
    </body>
  );
};

export default Login;
