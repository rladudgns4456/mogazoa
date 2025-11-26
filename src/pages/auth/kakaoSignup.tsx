import { SnsSignup } from "@/api/auth/auth";
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

    const nickname = localStorage.getItem("sns_nickname");
    if (!nickname) {
      router.replace("/snsSignup");
      return;
    }

    const signupWithKakao = async () => {
      try {
        const res = await SnsSignup("kakao", {
          nickname,
          redirectUri: "http://localhost:3000/auth/kakaoSignup",
          token: code,
        });

        Cookies.set("accessToken", res.accessToken, { path: "/" });

        setAuth(res.user, res.accessToken);

        router.replace("/");
      } catch (error: any) {
        router.replace("/404");
        console.error(error);
      }
    };

    signupWithKakao();
  }, [router]);

  return <div>카카오 회원가입 처리중...</div>;
}
