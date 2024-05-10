import { useNavigate } from "react-router-dom";
import {useForm} from "react-hook-form";
import * as ApiClient from "../Api/ApiClient";
import { useAppContext } from "../Context/AppContext";


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