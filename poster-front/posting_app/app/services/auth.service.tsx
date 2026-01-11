import api from "../lib/token.intreceptor";
import { User } from "../types/user";

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export const AuthApi = {
  register: async (
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) => {
    const { data } = await api.post<User>("/auth/register", {
      username,
      email,
      firstName,
      lastName,
      password,
    });
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<User>("/user/profile");
    return data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  updateProfile : async(payload : Partial<User>): Promise <User> => {
  const {data} = await api.patch<User>('/user/profile',payload)
  return data
  }

};
