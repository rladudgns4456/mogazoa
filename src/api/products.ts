// src/api/products.ts
import { Product } from "@/types/product";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

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

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("accessToken");
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
}

// API 응답
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

// 이미지 업로드
export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/images/upload`, {
    method: "POST",
    body: formData,
    headers: {
      ...getAuthHeaders(), // 🔐 토큰 추가
    },
  });

  if (!res.ok) {
    throw new Error("이미지 업로드에 실패했습니다.");
  }

  const data: { url: string } = await res.json();
  return data.url;
}

// 상품 생성
export type CreateProductPayload = {
  categoryId: number;
  image: string;
  description: string;
  name: string;
};

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(), // 🔐 토큰 추가
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("상품 등록에 실패했습니다.");
  }

  const data = await res.json();
  // data 형태가 리스트 아이템과 동일하다고 가정
  return toProduct(data);
}

/* ------------------------------------------------------------------
 *  상품 이름으로 검색
 *  GET /{teamId}/products?keyword=...&order=recent
 * ------------------------------------------------------------------ */

export async function searchProductsByName(keyword: string): Promise<Product[]> {
  const params = new URLSearchParams();
  params.set("keyword", keyword);
  params.set("order", "recent");

  const res = await fetch(`${API_BASE}/products?${params.toString()}`, {
    // 여기에도 credentials 넣지 않기
  });

  if (!res.ok) {
    throw new Error("상품 검색에 실패했습니다.");
  }

  const data: ProductListResponse = await res.json();
  return (data.list ?? []).map(toProduct);
}

/* ------------------------------------------------------------------
 *  중복 상품 이름 체크
 * ------------------------------------------------------------------ */

export async function checkDuplicateProductName(name: string): Promise<boolean> {
  const results = await searchProductsByName(name.trim());
  // 완전 같은 이름이 있는지만 체크
  return results.some(p => p.name === name.trim());
}
