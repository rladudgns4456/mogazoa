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
      } catch (e: any) {
        if (e?.response?.status === 401 || e?.response?.status === 403) {
          router.replace("/snsSignup");
          return;
        }
        console.error(e);
        if (e && typeof e === "object" && "response" in e) {
          const error = e as { response?: { data?: { message?: string } } };
          const errorMessage = error.response?.data?.message || "카카오 회원가입에 실패했습니다.";
          alert(errorMessage);
        } else {
          alert("카카오 회원가입에 실패했습니다.");
        }
      }
    };

    loginWithKakao();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mb-6 flex justify-center">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 animate-ping rounded-full bg-yellow-400 opacity-75"></div>
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500">
              <svg className="h-12 w-12 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3C6.48 3 2 6.58 2 11c0 2.54 1.37 4.78 3.5 6.24L4.5 21l4.5-2.25c.97.16 1.97.25 3 .25 5.52 0 10-3.58 10-8s-4.48-8-10-8zm0 13c-.83 0-1.64-.08-2.42-.23l-.58-.11-2.5 1.25.5-2.25-.28-.5C5.37 13.28 4.5 12.2 4.5 11c0-3.03 3.36-5.5 7.5-5.5s7.5 2.47 7.5 5.5-3.36 5.5-7.5 5.5z" />
              </svg>
            </div>
          </div>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">카카오 로그인 처리중</h2>
        <p className="mb-8 text-gray-600">잠시만 기다려주세요...</p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div className="h-2 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-yellow-400"></div>
        </div>
        <p className="mt-6 text-sm text-gray-500">카카오 계정으로 안전하게 로그인하고 있습니다</p>
      </div>
      <style jsx>{`
        @keyframes loading {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 75%;
            margin-left: 0%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
