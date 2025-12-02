import Cookies from "js-cookie";
import axiosInstance from "../AxiosInstance";

interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
}

interface SignupResponse {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    description: string;
    image: string | null;
    nickname: string;
    teamId: string;
    updatedAt: string;
    createdAt: string;
  };
}

interface SnsLoginRequest {
  redirectUri: string;
  token: string;
}

interface SnsLoginResponse {
  accessToken: string;
  user: {
    updatedAt: string;
    createdAt: string;
    teamId: string;
    image: string;
    description: string;
    nickname: string;
    id: number;
    email: string;
  };
}

interface SnsSignupRequest {
  nickname: string;
  redirectUri: string;
  token: string;
}

interface SnsSignupResponse {
  accessToken: string;
  user: {
    updatedAt: string;
    createdAt: string;
    teamId: string;
    image: string;
    description: string;
    nickname: string;
    id: number;
    email: string;
  };
}

export async function signup(body: SignupRequest): Promise<SignupResponse> {
  const response = await axiosInstance.post("/auth/signUp", body);
  console.log(response.data);
  return response.data;
}

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const response = await axiosInstance.post("/auth/signIn", body);

  // 액세스 토큰을 쿠키에 저장
  if (response.data.accessToken) {
    Cookies.set("accessToken", response.data.accessToken, {
      expires: 1, // 1일 후 만료
      secure: process.env.NODE_ENV === "production", // HTTPS에서만 전송
      sameSite: "strict", // CSRF 공격 방지
    });
  }

  console.log(response.data);
  return response.data;
}

// 로그아웃
// export function logout() {
//   Cookies.remove("accessToken");
// }

export async function Snslogin(provider: string, body: SnsLoginRequest): Promise<SnsLoginResponse> {
  const response = await axiosInstance.post(`/auth/signIn/${provider}`, body);
  return response.data;
}

export async function SnsSignup(provider: string, body: SnsSignupRequest): Promise<SnsSignupResponse> {
  const response = await axiosInstance.post(`/auth/signUp/${provider}`, body);
  return response.data;
}
