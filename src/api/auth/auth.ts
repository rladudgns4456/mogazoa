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

export async function signup(body: SignupRequest): Promise<SignupResponse> {
  const response = await axiosInstance.post("/auth/signUp", body);
  console.log(response.data);
  return response.data;
}
