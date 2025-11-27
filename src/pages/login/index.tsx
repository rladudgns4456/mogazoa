import { login } from "@/api/auth/auth";
import IcGoogle from "@/assets/icons/ic_google.svg";
import IcKakao from "@/assets/icons/ic_kakao.svg";
import Logo from "@/assets/logo/logo.png";
import LogoTitle from "@/assets/logo/logo_name.png";
import Button from "@/components/Button";
import Input from "@/components/input/Input";
import { useAuth } from "@/components/login/AuthContext";
import LoginFooter from "@/components/login/footer";
import { cn } from "@/utils/cn";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { KeyboardEvent, useEffect, useState } from "react";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [disabled, setDisabled] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });

  const [validated, setValidated] = useState({
    email: false,
    password: false,
  });

  // 에러 설정 핸들러
  const setError = (field: keyof FormErrors, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message,
    }));
  };

  // 이메일 유효성 검사 (값을 직접 받는 버전)
  const validateEmailValue = (value: string) => {
    if (!value.trim()) {
      setError("email", "이메일을 입력해 주세요");
      setValidated(prev => ({ ...prev, email: false }));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setError("email", "올바른 이메일 형식이 아닙니다");
      setValidated(prev => ({ ...prev, email: false }));
      return false;
    }
    setError("email", "");
    setValidated(prev => ({ ...prev, email: true }));
    return true;
  };

  // 비밀번호 유효성 검사 (값을 직접 받는 버전)
  const validatePasswordValue = (value: string) => {
    if (!value.trim()) {
      setError("password", "비밀번호를 입력해 주세요");
      setValidated(prev => ({ ...prev, password: false }));
      return false;
    }
    if (value.length < 8) {
      setError("password", "비밀번호는 8자 이상이어야 합니다");
      setValidated(prev => ({ ...prev, password: false }));
      return false;
    }
    if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,12}$/.test(value)) {
      setError("password", "비밀번호는 숫자, 영문, 특수문자로만 가능해요");
      setValidated(prev => ({ ...prev, password: false }));
      return false;
    }
    setError("password", "");
    setValidated(prev => ({ ...prev, password: true }));
    return true;
  };

  // 기존 함수는 onBlur와 handleSubmit에서 사용
  const validateEmail = () => validateEmailValue(formData.email);
  const validatePassword = () => validatePasswordValue(formData.password);

  // 값 변경 핸들러
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // 실시간 유효성 검사
    if (field === "email") {
      validateEmailValue(value);
    } else if (field === "password") {
      validatePasswordValue(value);
    }
  };

  useEffect(() => {
    setDisabled(!(validated.email && validated.password));
  }, [validated]);

  const handleSubmit = async () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      try {
        const response = await login({
          email: formData.email,
          password: formData.password,
        });

        setAuth(response.user, response.accessToken);

        console.log("로그인 성공!");
        router.push("/");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const snsButton = `flex h-56 w-56 items-center justify-center rounded-100 border border-gray-300`;
  const redirectUri = `${window.location.origin}/auth/kakao`;

  return (
    <>
      <Head>
        <title>로그인-모가조아</title>
        <meta property="og:title" content="로그인-모가조아" key="title" />
      </Head>
      <div className="flex max-w-1325 items-center justify-center pb-45 pt-113 md:pt-104 lg:m-auto lg:justify-between lg:pb-160 lg:pt-94">
        <div className="hidden flex-col justify-center gap-8 lg:flex">
          <div className="flex flex-col items-center justify-center gap-16">
            <Image quality={100} src={Logo} width={100} height={100} alt="로고" />
            <Image quality={100} src={LogoTitle} width={240} height={60} alt="모가조아" />
          </div>
        </div>
        <div onKeyDown={onKeyDown} className="max-w-335 md:max-w-600 lg:max-w-640">
          <h1 className="header2-bold md:big-title pb-40 text-center md:pb-80">
            쉽게 비교하고
            <br />
            똑똑하게 쇼핑하자
          </h1>
          <article className="flex flex-col gap-32 md:gap-48">
            <Input
              variant="rounded"
              value={formData.email}
              onChange={value => handleChange("email", value)}
              onBlur={validateEmail}
              leftIcon="email"
              type="email"
              placeholder="이메일을 입력해 주세요"
              label="이메일"
              error={!!errors.email}
              errorText={errors.email}
            />

            <Input
              variant="rounded"
              value={formData.password}
              onChange={value => handleChange("password", value)}
              onBlur={validatePassword}
              leftIcon="password"
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              label="비밀번호"
              showPasswordToggle
              error={!!errors.password}
              errorText={errors.password}
            />
          </article>
          <div className="pt-80">
            <Button type="button" variant="primary" disabled={disabled} onClick={handleSubmit}>
              로그인
            </Button>
          </div>
          <div className="flex items-center justify-between gap-18 pb-24 pt-40">
            <span className="block h-1 w-full bg-gray-300"></span>
            <span className="flex-shrink-0">
              <p className="text-14-regular text-[#6E6E82] md:text-16-regular">SNS로 바로 시작하기</p>
            </span>
            <span className="block h-1 w-full bg-gray-300"></span>
          </div>
          <div className="flex items-center justify-center gap-20">
            <button className={cn(snsButton)}>
              <IcGoogle />
            </button>
            <Link
              href={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`}
              onClick={() => localStorage.setItem("sns_provider", "kakao")}
              className={cn(snsButton)}
            >
              <IcKakao />
            </Link>
          </div>
          <LoginFooter />
        </div>
      </div>
    </>
  );
}
