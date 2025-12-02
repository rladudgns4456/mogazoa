// src/components/product/AddProductModal.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { uploadProductImage, checkDuplicateProductName, searchProductsByName } from "@/api/products";
import { useModal } from "../modal/modalBase";
import { editProduct } from "@/api/productsApi";
import { Product } from "@/types/product";
import { cn } from "@/utils/cn";
import { useCategories, type CategoryType } from "@/hooks/useCategories";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const NAME_MAX = 20;
const DESCRIPTION_MAX = 500;

interface CategoryOption {
  id: number;
  label: string;
}

interface EditProps {
  productId: number;
  initImage: string;
  productName: string;
  initDescription: string;
  initCategoryId: number;
}

export default function EditProductModal({
  productId,
  initCategoryId,
  initImage,
  productName,
  initDescription,
}: EditProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  // 입력값 상태
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 에러 상태
  const [nameError, setNameError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [imageError, setImageError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  // 비슷한 상품 리스트
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);

  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 디바운스용 타이머
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 카테고리: useCategories 훅 재사용
  const { combinedCategory } = useCategories();

  const categoryOptions: CategoryOption[] = useMemo(() => {
    if (!combinedCategory) return [];

    return combinedCategory.map((cat: CategoryType) => ({
      id: cat.id,
      label: cat.label,
    }));
  }, [combinedCategory]);

  //초기 데이터

  const initName = productName; // 현재 상품명과 동일할 경우는 에러 아님 처리용
  useEffect(() => {
    setCategoryId(initCategoryId);
    setName(productName);
    setDescription(initDescription);
    setImagePreview(initImage);
  }, []);

  // 상품 이름
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, NAME_MAX);
    setName(value);
    setNameError("");

    // 비슷한 상품 검색 (2글자 이상부터)
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    if (value.trim().length < 2) {
      setSimilarProducts([]);
      return;
    }

    searchTimerRef.current = setTimeout(async () => {
      try {
        setIsLoadingSimilar(true);
        const result = await searchProductsByName(value);
        setSimilarProducts(result.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingSimilar(false);
      }
    }, 300);
  };

  const handleBlurName = async () => {
    const trimmed = name.trim();

    if (!trimmed) {
      setNameError("상품 이름은 필수 입력입니다.");
      return;
    }

    try {
      if (trimmed !== initName) {
        //편집하고 있는 상품명 제외
        const isDup = await checkDuplicateProductName(trimmed);
        if (isDup) {
          setNameError("이미 등록된 상품입니다.");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 카테고리
  const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      setCategoryId(null);
      return;
    }
    setCategoryId(Number(value));
    setCategoryError("");
  };

  // 이미지
  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImageError("");

    const url = URL.createObjectURL(file);
    setImagePreview(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  useEffect(
    () => () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    },
    [imagePreview],
  );

  // 상품 설명
  const handleChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, DESCRIPTION_MAX);
    setDescription(value);
    setDescriptionError("");
  };

  const handleBlurDescription = () => {
    const trimmed = description.trim();

    if (!trimmed) {
      setDescriptionError("상품 설명은 필수 입력입니다.");
      return;
    }

    if (trimmed.length < 10) {
      setDescriptionError("최소 10자 이상 적어주세요.");
    }
  };

  // 전체 유효성 검사
  const validateAll = async () => {
    let ok = true;
    const trimmedName = name.trim();
    const trimmedDesc = description.trim();

    if (!trimmedName) {
      setNameError("상품 이름은 필수 입력입니다.");
      ok = false;
    } else {
      try {
        if (trimmedName !== initName) {
          const dup = await checkDuplicateProductName(trimmedName);
          if (dup) {
            setNameError("이미 등록된 상품입니다.");
            ok = false;
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (categoryId == null) {
      setCategoryError("카테고리를 선택해주세요.");
      ok = false;
    }

    //미리보기 이미지가 없을 경우
    if (!imagePreview) {
      setImageError("대표 이미지를 추가해주세요.");
      ok = false;
    }

    if (!trimmedDesc) {
      setDescriptionError("상품 설명은 필수 입력입니다.");
      ok = false;
    } else if (trimmedDesc.length < 10) {
      setDescriptionError("최소 10자 이상 적어주세요.");
      ok = false;
    }

    return ok;
  };

  const editProductMutation = useMutation({
    mutationFn: editProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", productId] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "수정에 실패했습니다.");
    },
  });

  // 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const ok = await validateAll();
    if (!ok || !imageFile || categoryId == null) return;

    try {
      setIsSubmitting(true);

      // 1) 이미지 업로드 → url 획득
      const imageUrl = await uploadProductImage(imageFile);

      // 2) 상품 수정 요청
      await editProductMutation.mutateAsync({
        productId: productId, // 이 부분이 필요합니다.
        categoryId: categoryId,
        image: imageUrl,
        description: description.trim(),
        name: name.trim(),
      });

      // 3) 상세 페이지로 이동
      router.push(`/product/${productId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }

    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full flex-col gap-24">
      {/* 제목 */}
      <h2 className="mb-8 text-18-bold text-gray-900">상품 수정</h2>

      {/* 대표 이미지 */}
      <section className="flex flex-col gap-8">
        <label className="text-13-medium text-gray-900">대표 이미지</label>
        <div className="flex gap-12">
          <label
            className={cn(
              "flex h-120 w-120 cursor-pointer items-center justify-center rounded-16 border border-dashed border-gray-300 bg-gray-50 text-12-medium text-gray-500",
              "hover:bg-gray-100",
            )}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="대표 이미지 미리보기" className="h-full w-full rounded-16 object-cover" />
            ) : (
              <span>이미지 추가</span>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleChangeImage} />
          </label>
        </div>
        {imageError && <p className="text-11-medium text-error">{imageError}</p>}
      </section>

      {/* 카테고리 선택 */}
      <section className="flex flex-col gap-8">
        <label className="text-13-medium text-gray-900" htmlFor="category">
          카테고리 선택
        </label>
        <select
          id="category"
          value={categoryId ?? ""}
          onChange={handleChangeCategory}
          className="text-13-regular h-40 rounded-12 border border-gray-200 px-12 text-gray-900"
        >
          <option value="">카테고리를 선택해 주세요</option>
          {categoryOptions.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        {categoryError && <p className="text-11-medium text-error">{categoryError}</p>}
      </section>

      {/* 상품 이름 */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <label className="text-13-medium text-gray-900" htmlFor="name">
            상품명 (상품 등록 여부를 확인해 주세요)
          </label>
          <span className="text-11-medium text-gray-500">
            {name.length}/{NAME_MAX}
          </span>
        </div>
        <input
          id="name"
          type="text"
          value={name}
          onChange={handleChangeName}
          onBlur={handleBlurName}
          maxLength={NAME_MAX}
          className="text-13-regular h-40 rounded-12 border border-gray-200 px-12 text-gray-900"
          placeholder="상품 이름을 입력해 주세요"
        />
        {nameError && <p className="text-11-medium text-error">{nameError}</p>}

        {/* 유사 상품 리스트 */}
        <div className="mt-4">
          {isLoadingSimilar && <p className="text-11-regular text-gray-500">비슷한 상품을 찾는 중입니다…</p>}
          {!isLoadingSimilar && similarProducts.length > 0 && (
            <div className="rounded-12 bg-gray-50 px-12 py-10">
              <p className="text-11-medium mb-6 text-gray-700">입력한 이름과 비슷한 상품이에요</p>
              <ul className="space-y-4">
                {similarProducts.map(p => (
                  <li key={p.id} className="text-11-regular text-gray-600">
                    · {p.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 상품 설명 */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <label className="text-13-medium text-gray-900" htmlFor="description">
            상품에 대한 설명을 작성해 주세요
          </label>
          <span className="text-11-medium text-gray-500">
            {description.length}/{DESCRIPTION_MAX}
          </span>
        </div>
        <textarea
          id="description"
          value={description}
          onChange={handleChangeDescription}
          onBlur={handleBlurDescription}
          maxLength={DESCRIPTION_MAX}
          className="text-13-regular min-h-[150px] resize-none rounded-12 border border-gray-200 px-12 py-10 text-gray-900"
          placeholder="상품의 특징, 사용 후기 등을 10자 이상 적어주세요."
        />
        {descriptionError && <p className="text-11-medium text-error">{descriptionError}</p>}
      </section>

      {/* 하단 버튼 */}
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "h-44 w-full rounded-12 text-14-bold",
            isSubmitting
              ? "cursor-not-allowed bg-gray-200 text-gray-400"
              : "bg-primary-500 text-white hover:bg-primary-600",
          )}
        >
          {isSubmitting ? "등록 중..." : "수정하기"}
        </button>
      </div>
    </form>
  );
}
