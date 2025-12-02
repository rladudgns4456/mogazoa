// src/api/products.ts
import Cookies from "js-cookie";
import { Product } from "@/types/product";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/* ------------------------------------------------------------------
 *  인증 헤더 공통 함수
 * ------------------------------------------------------------------ */

function getAuthHeaders(): Record<string, string> {
  // SSR 환경에서는 localStorage / 쿠키 없음
  if (typeof window === "undefined") return {};

  // AuthContext 에서 Cookies.set("accessToken", token) 사용 중
  const token = Cookies.get("accessToken");
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
}

/* ------------------------------------------------------------------
 *  API 타입들
 * ------------------------------------------------------------------ */

type ProductListItemFromApi = {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  favoriteCount: number;
  categoryId: number;
  writerId: number;
  createdAt: string;
  updatedAt: string;
};

type ProductListResponse = {
  nextCursor: number | null;
  list: ProductListItemFromApi[];
};

/* ------------------------------------------------------------------
 *  응답 → Product 타입 변환
 * ------------------------------------------------------------------ */

const toProduct = (raw: ProductListItemFromApi): Product => ({
  id: raw.id,
  name: raw.name,
  description: "",
  image: raw.image,
  rating: raw.rating,
  reviewCount: raw.reviewCount,
  favoriteCount: raw.favoriteCount,
  categoryId: raw.categoryId,
  userId: raw.writerId,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
  isFavorite: false,
  category: {
    id: raw.categoryId,
    name: "",
  },
});

/* ------------------------------------------------------------------
 *  이미지 업로드  POST /images/upload
 * ------------------------------------------------------------------ */

export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const headers: HeadersInit = {
    ...getAuthHeaders(),
  };

  const res = await fetch(`${API_BASE}/images/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    console.error("이미지 업로드 실패:", await res.text());
    throw new Error("이미지 업로드에 실패했습니다.");
  }

  const data: { url: string } = await res.json();
  return data.url;
}

/* ------------------------------------------------------------------
 *  상품 생성  POST /products
 * ------------------------------------------------------------------ */

export type CreateProductPayload = {
  categoryId: number;
  image: string;
  description: string;
  name: string;
};

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...getAuthHeaders(), // Authorization 포함
  };

  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("상품 등록 실패:", await res.text());
    throw new Error("상품 등록에 실패했습니다.");
  }

  const data: ProductListItemFromApi = await res.json();
  return toProduct(data);
}

/* ------------------------------------------------------------------
 *  상품 이름으로 검색
 *  GET /products?keyword=...&order=recent
 * ------------------------------------------------------------------ */

export async function searchProductsByName(keyword: string): Promise<Product[]> {
  const params = new URLSearchParams();
  params.set("keyword", keyword);
  params.set("order", "recent");

  const res = await fetch(`${API_BASE}/products?${params.toString()}`);

  if (!res.ok) {
    console.error("상품 검색 실패:", await res.text());
    throw new Error("상품 검색에 실패했습니다.");
  }

  const data: ProductListResponse = await res.json();
  return (data.list ?? []).map(toProduct);
}

/* ------------------------------------------------------------------
 *  중복 상품 이름 체크
 * ------------------------------------------------------------------ */

export async function checkDuplicateProductName(name: string): Promise<boolean> {
  const trimmed = name.trim();
  if (!trimmed) return false;

  const results = await searchProductsByName(trimmed);
  return results.some(p => p.name === trimmed);
}
