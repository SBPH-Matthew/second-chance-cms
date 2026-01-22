import { login, register, logout } from "@/app/services";
import {
  LoginErrorType,
  LoginRequestType,
  LoginResponseType,
  RegisterErrorType,
  RegisterRequestType,
  RegisterResponseType,
} from "@/app/types";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation<
    RegisterResponseType,
    RegisterErrorType,
    RegisterRequestType
  >({
    mutationFn: register,
  });
};

export const useLogin = () => {
  return useMutation<LoginResponseType, LoginErrorType, LoginRequestType>({
    mutationFn: login,
  });
};

export const useLogout = () => {
  return useMutation<void, Error, void>({
    mutationFn: logout,
  });
};
