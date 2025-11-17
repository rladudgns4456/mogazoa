import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  id: number;
  email: string;
  nickname: string;
  description: string;
  image: string | null;
  teamId: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  setAuth: (user: User | null, token?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드 시 쿠키 확인
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      // 토큰이 있으면 사용자 정보를 가져오거나
      // localStorage에서 사용자 정보를 복원
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    }
    setIsLoading(false);
  }, []);

  const setAuth = (userData: User | null, token?: string) => {
    if (userData && token) {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
    }
  };

  const logout = () => {
    Cookies.remove("accessToken");
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}