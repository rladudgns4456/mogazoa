import { signup } from "@/api/auth/auth";
import Logo from "@/assets/logo.png";
import LogoTitle from "@/assets/logo_name.png";
import Button from "@/components/Button";
import Input from "@/components/input/Input";
import LoginFooter from "@/components/login/footer";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { KeyboardEvent, useEffect, useState } from "react";

interface FormData {
  email: string;
  nickName: string;
  password: string;
  passwordConfirmation: string;
}

interface FormErrors {
  email: string;
  nickName: string;
  password: string;
  passwordConfirmation: string;
}

export default function Signup() {
  const router = useRouter();
  const [disabled, setDisabled] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    nickName: "",
    password: "",
    passwordConfirmation: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    nickName: "",
    password: "",
    passwordConfirmation: "",
  });

  const [validated, setValidated] = useState({
    email: false,
    nickName: false,
    password: false,
    passwordConfirmation: false,
  });

  // 값 변경 핸들러
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 에러 설정 핸들러
  const setError = (field: keyof FormErrors, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message,
    }));
  };

  // 이메일 유효성 검사
  const validateEmail = () => {
    const value = formData.email;
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

  // 닉네임 유효성 검사
  const validateNickName = () => {
    const value = formData.nickName;
    if (!value.trim()) {
      setError("nickName", "닉네임을 입력해 주세요");
      setValidated(prev => ({ ...prev, nickName: false }));
      return false;
    }
    if (value.length > 10) {
      setError("nickName", "최대 10자 입력이 가능해요.");
      setValidated(prev => ({ ...prev, nickName: false }));
      return false;
    }
    setError("nickName", "");
    setValidated(prev => ({ ...prev, nickName: true }));
    return true;
  };

  // 비밀번호 유효성 검사
  const validatePassword = () => {
    const value = formData.password;
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

  // 비밀번호 확인 유효성 검사
  const validatePasswordConfirm = () => {
    const value = formData.passwordConfirmation;
    if (!value.trim()) {
      setError("passwordConfirmation", "비밀번호 확인을 입력해 주세요");
      setValidated(prev => ({ ...prev, passwordConfirmation: false }));
      return false;
    }
    if (value !== formData.password) {
      setError("passwordConfirmation", "비밀번호가 일치하지 않습니다");
      setValidated(prev => ({ ...prev, passwordConfirmation: false }));
      return false;
    }
    setError("passwordConfirmation", "");
    setValidated(prev => ({ ...prev, passwordConfirmation: true }));
    return true;
  };

  useEffect(() => {
    setDisabled(!(validated.email && validated.nickName && validated.password && validated.passwordConfirmation));
  }, [validated]);

  const handleSubmit = async () => {
    const isEmailValid = validateEmail();
    const isNickNameValid = validateNickName();
    const isPasswordValid = validatePassword();
    const isPasswordConfirmValid = validatePasswordConfirm();

    if (isEmailValid && isNickNameValid && isPasswordValid && isPasswordConfirmValid) {
      // console.log("회원가입 성공", formData);
      // 회원가입 API 호출
      try {
        await signup({
          email: formData.email,
          nickname: formData.nickName,
          password: formData.password,
          passwordConfirmation: formData.passwordConfirmation,
        });
        router.push("/login");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      <Head>
        <title>회원가입-모가조아</title>
        <meta property="og:title" content="회원가입-모가조아" key="title" />
      </Head>
      <div className="flex items-center justify-center gap-347 pt-55 md:pt-104 lg:pt-94">
        <div className="hidden flex-col justify-center gap-8 lg:flex">
          <div className="flex flex-col items-center justify-center gap-16">
            <Image quality={100} src={Logo} width={100} height={100} alt="로고" />
            <Image quality={100} src={LogoTitle} width={240} height={60} alt="모가조아" />
          </div>
          <h3 className="header2-bold text-gray-400">쉽게 비교하고, 똑똑하게 쇼핑하자</h3>
        </div>
        <div className="max-w-335 md:max-w-600 lg:max-w-640">
          <h1 className="big-title pb-80 text-center">회원가입</h1>
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
              value={formData.nickName}
              onChange={value => handleChange("nickName", value)}
              onBlur={validateNickName}
              leftIcon="nickname"
              type="text"
              placeholder="닉네임을 입력해 주세요"
              label="닉네임"
              error={!!errors.nickName}
              errorText={errors.nickName}
              subText="최대 10자 입력이 가능해요"
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
              subText="최소 8자 이상 입력해주세요"
            />

            <Input
              variant="rounded"
              value={formData.passwordConfirmation}
              onChange={value => handleChange("passwordConfirmation", value)}
              onBlur={validatePasswordConfirm}
              leftIcon="password"
              type="password"
              placeholder="비밀번호를 다시 입력해 주세요"
              label="비밀번호 확인"
              showPasswordToggle
              error={!!errors.passwordConfirmation}
              errorText={errors.passwordConfirmation}
            />
          </article>
          <div className="pt-80">
            <Button disabled={disabled} type="button" variant="primary" onClick={handleSubmit}>
              가입하기
            </Button>
          </div>
          <LoginFooter />
        </div>
      </div>
    </>
  );
}
