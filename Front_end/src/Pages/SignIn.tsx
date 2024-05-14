import { useNavigate } from "react-router-dom";
import {useForm} from "react-hook-form";
import * as ApiClient from "../Api/ApiClient";
import { useAppContext } from "../contexts/AppContext";
import { useQueryClient } from "react-query";


export type LoginForm = {
  email : string,
  password: string
}

const Login = () => {
 const QueryClient = useQueryClient();
 const navigate = useNavigate();
 const { showToast} = useAppContext();
 
  return (
    <div>Login</div>
  )
}

export default Login