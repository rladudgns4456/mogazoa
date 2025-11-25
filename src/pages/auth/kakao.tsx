import { Snslogin } from "@/api/auth/auth";
import { useAuth } from "@/components/login/AuthContext";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function KakaoCallbackPage() {
  const router = useRouter();
  const { setAuth } = useAuth();

  useEffect(() => {
    if (!router.isReady) return;

    const code = router.query.code;
    if (typeof code !== "string") return;

    const loginWithKakao = async () => {
      try {
        const res = await Snslogin("kakao", {
          redirectUri: "http://localhost:3000/auth/kakao",
          token: code,
        });

        Cookies.set("accessToken", res.accessToken, { path: "/" });

        setAuth(res.user, res.accessToken);

        router.replace("/");
      } catch (error: any) {
        if (error?.response?.status === 401) {
          router.replace("/snsSignup");
          return;
        }
        console.error(error);
      }
    };

    loginWithKakao();
  }, [router]);

  return <div>카카오 로그인 처리중...</div>;
}
