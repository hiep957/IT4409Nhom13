import React from 'react'
import { useNavigate } from 'react-router-dom';
import {useMutation, useQueryClient} from 'react-query';
import {useForm} from "react-hook-form";
import ApiClient from "../Api/ApiClient";
 
export type RegisterForm = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
}
export const Register = () => {
    const QueryClient = useQueryClient();
    const nagivate =  useNavigate();

    const { register, watch, handleSubmit, formState: {errors}, } = useForm<RegisterForm>();
    const mutation  = useMutation(ApiClient.register, {
        onSuccess: async () => {
            
        }
    })
  return (
    <div>Register</div>
  )
}
