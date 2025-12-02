"use client";

import { QueryClient, dehydrate, useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/login/AuthContext";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useEffect, useState, useRef } from "react";

// 로그인 모달
import LoginAlert from "@/components/modal/loginAlert";

// api
import { useDeleteReview, useGetReview } from "@/api/ReviewApi";
import { postProductFavorite, deleteProductFavorite, ProductsProps, getProductItem } from "@/api/productsApi";

// type
import { Review } from "@/types/review";
import { ProductDetail } from "@/types/product";
import type { ProductSummary } from "@/utils/compareUtils";

// 컴포넌트
import Image from "next/image";
import DetailCard from "@/components/detailCard";
import Statistics from "@/components/statistics";
import ReviewCard from "@/components/review/ReviewCard";
import { Skeleton } from "@/components/skeleton";
import EmptyReviewCard from "@/components/review/EmptyReviewCard";
import { SortingSelect } from "@/components/selectBox";
import { useModal } from "@/components/modal/modalBase";
import { ConfigModal } from "@/components/modal";
import ModalContainer from "@/components/modal/modalBase/ModalContainer";
import ReplaceModal from "@/components/compare/ReplaceModal";
import sorting from "@/utils/sorting";
import EditReview from "./_components/reviewModal/editReview";
import { Toast, useToast } from "@/components/toast";

// 이미지
import title1 from "@/assets/images/statistics.png";
import title2 from "@/assets/images/review.png";

// 한 페이지 목록
const SHOW_MAX = 2;

const COMPARE_STORAGE_KEY = "mogazoa:compare-products";

// getServerSideProps
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const currentPath = context.params?.id;
  const productId = Number(currentPath);
  const productData = await getProductItem(productId);

  return {
    props: {
      productId,
      productData,
      dehydratedState: dehydrate(queryClient),
    },
  };
}

// ProductDetailCard
export default function ProductDetailCard({
  productId,
  productData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModal();
  const { openToast } = useToast();
  const params = useParams();

  // 유저 확인
  const { user } = useAuth();
  const [userId, setIsUser] = useState<number | null>(null);

  useEffect(() => {
    if (user && user.id !== undefined) {
      const id = typeof user.id === "string" ? parseInt(user.id, 10) : user.id;
      setIsUser(id);
    }
  }, [user]);

  // 상품 정보
  const items: ProductDetail = productData;

  // 상품 삭제
  const deleteProduct = useMutation<string, Error, number>({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["products", productId] });
      const previousData = queryClient.getQueryData<ProductsProps>(["products", productId]);
      return { previousData };
    },
    onError: () => {
      openToast(<Toast label="상품 삭제를 실패했습니다." error />);
    },
    onSuccess: () => {
      router.replace("/");
    },
  });

  const onHandleDeleteProduct = (config: string) => {
    if (config === "true") {
      deleteProduct.mutate(productId);
    }
  };

  // ================================
  // 상품 비교
  // ================================
  const onCompareProduct = (targetProductId: number) => {
    // 1. 로그인 안 되어 있으면 로그인 모달
    if (!userId) {
      openModal(<LoginAlert />);
      return;
    }

    if (typeof window === "undefined") return;

    // 2. 현재 로컬스토리지 값 읽기
    let leftId: number | null = null;
    let rightId: number | null = null;

    const raw = window.localStorage.getItem(COMPARE_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        leftId = parsed.leftId ?? null;
        rightId = parsed.rightId ?? null;
      } catch {
        leftId = null;
        rightId = null;
      }
    }

    // 이미 등록된 상품이면 안내만
    if (leftId === targetProductId || rightId === targetProductId) {
      openToast(<Toast label="이미 비교 목록에 등록된 상품입니다." />);
      return;
    }

    const filledCount = [leftId, rightId].filter((v): v is number => typeof v === "number").length;

    // 0개일 때: 비교 상품으로 추가 + 토스트
    if (filledCount === 0) {
      leftId = targetProductId;

      window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify({ leftId, rightId }));

      openToast(<Toast label="비교 상품으로 추가되었습니다." />);
      return;
    }

    // 1개일 때: 빈 자리에 추가 + “바로 비교하러 갈래요?” 모달
    if (filledCount === 1) {
      if (!leftId) leftId = targetProductId;
      else rightId = targetProductId;

      window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify({ leftId, rightId }));

      openModal(
        <ConfigModal
          label="비교할 상품 두 개가 모두 담겼어요. 지금 비교하러 갈까요?"
          onConfig={value => {
            if (value === "true") {
              router.push("/compare");
            }
          }}
        />,
      );

      return;
    }

    if (filledCount === 2 && leftId && rightId) {
      const leftSummary: ProductSummary = {
        id: leftId,
        name: "비교 상품 1",
        thumbnailUrl: null,
        rating: 0,
        reviewCount: 0,
        favoriteCount: 0,
      };

      const rightSummary: ProductSummary = {
        id: rightId,
        name: "비교 상품 2",
        thumbnailUrl: null,
        rating: 0,
        reviewCount: 0,
        favoriteCount: 0,
      };

      const newSummary: ProductSummary = {
        id: targetProductId,
        name: items.name,
        thumbnailUrl: items.image ?? null,
        rating: items.rating ?? 0,
        reviewCount: items.reviewCount ?? 0,
        favoriteCount: items.favoriteCount ?? 0,
      };

      openModal(
        <ModalContainer
          styleClass="
        w-[500px]
        rounded-[20px]
        border-[#EFF0F3]
        shadow-[0_4px_30px_rgba(92,104,177,0.05)]
      "
        >
          <ReplaceModal
            triggerSide="right"
            left={leftSummary}
            right={rightSummary}
            newProduct={newSummary}
            onConfirmReplace={keepSide => {
              let newLeftId = leftId!;
              let newRightId = rightId!;

              if (keepSide === "left") {
                newRightId = targetProductId;
              } else {
                newLeftId = targetProductId;
              }

              window.localStorage.setItem(
                COMPARE_STORAGE_KEY,
                JSON.stringify({ leftId: newLeftId, rightId: newRightId }),
              );
            }}
          />
        </ModalContainer>,
      );
      return;
    }
  };

  // ================================
  // 리뷰 가져오기
  // ================================
  const [order, setOrder] = useState("recent");
  const { data: reviewData, isLoading: reviewLoading, isError: reviewError } = useGetReview(productId, order);
  const reviews = reviewData?.list;

  // 리뷰 삭제
  const { deleteReview } = useDeleteReview();
  const onHandleDelete = (reviewId: number) => {
    deleteReview(reviewId);
  };

  const onHandleSorting = (value: string) => {
    const order = sorting(value);
    setOrder(order);
  };

  // 무한 스크롤
  const [visibleItems, setVisibleItems] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(SHOW_MAX);
  const loadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reviewData) {
      setVisibleItems(reviewData.list.slice(0, SHOW_MAX));
    }
  }, [reviewData]);

  useEffect(() => {
    if (!reviews || currentIndex >= reviews.length) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          const nextIndex = currentIndex + SHOW_MAX;
          setVisibleItems(reviews.slice(0, nextIndex));
          setCurrentIndex(nextIndex);
        }
      },
      { threshold: 1.0 },
    );

    if (loadRef.current) {
      observer.observe(loadRef.current);
    }

    return () => {
      if (loadRef.current) {
        observer.unobserve(loadRef.current);
      }
    };
  }, [currentIndex, reviews]);

  if (reviewLoading) return <div>로딩 중...</div>;
  if (reviewError) return <div>오류 발생</div>;

  // 리뷰 수정
  const onReviewEdit = (id: number) => {
    if (!reviews) return;

    const editReview = reviews.find(r => r.id === id);
    if (!editReview) return;

    openModal(
      <EditReview
        currentPath={String(productId)}
        productId={productId}
        id={id}
        image={items.image}
        name={items.name}
        item={editReview}
        content={items.description}
        rating={editReview.rating}
      />,
    );
  };

  // 리뷰 좋아요 (TODO)
  const onLikeClick = (reviewId: number) => {
    // LikeReview(reviewId);
    // setReviewLike(prev => !prev);
  };

  // 찜 하기
  const onHandleSave = async (targetProductId: number) => {
    if (items.isFavorite) {
      try {
        await deleteProductFavorite(targetProductId);
      } catch (error) {
        openToast(<Toast errorMessage="이미 찜한 상품입니다." error />);
      }
    } else if (!items.isFavorite && items.favoriteCount === 1) {
      await postProductFavorite(targetProductId);
    }
  };

  // url 복사
  const id = params.id; // string | undefined

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("클립보드에 복사되었습니다.");
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
    }
  };

  const onHandleUrlCopy = () => {
    const textToCopy = `${process.env.NEXT_PUBLIC_API_BASE}/camp/detail/${id}`;
    copyToClipboard(textToCopy);
  };

  // 카카오 공유 (TODO)
  const onHandleShare = () => {};

  return (
    <>
      <section className="pb-53 pt-0">
        <h2 className="-inset-4m-1 h-0 w-0 overflow-hidden text-1">상품상세 정보</h2>
        <DetailCard
          currentPath={String(productId)}
          userId={userId}
          writerId={items?.writerId}
          id={items?.id}
          image={items?.image}
          name={items?.name}
          category={items?.category}
          description={items?.description}
          isLoading={productData.productLoading}
          isError={productData.productError}
          isFavorite={items?.isFavorite}
          onSave={onHandleSave}
          onShare={onHandleShare}
          onUrlCopy={onHandleUrlCopy}
          onDelete={id => onHandleDeleteProduct(String(id))}
          onCompare={onCompareProduct}
        />
      </section>

      <div className="md:pb38 bg-gray-100 pb-78 pt-28 md:pt-53 lg:pb-135 lg:pt-53">
        <section className="pb-48 lg:pb-68">
          <div className="mx-auto max-w-1052 px-20 md:px-36">
            <div className="mb-20 w-full">
              <h2>
                <Image className="w-auto" height={23} src={title1} alt="상품통계" />
              </h2>
            </div>
            {items && (
              <Statistics
                rating={items?.rating}
                reviewCount={items?.reviewCount}
                favoriteCount={items?.favoriteCount}
                categoryMetric={items?.categoryMetric}
              />
            )}
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-1052 px-20 md:px-36">
            <div className="relative z-10 mb-20 flex w-full items-center justify-between">
              <h2>
                <Image className="w-auto" height={23} src={title2} alt="상품리뷰" />
              </h2>
              <SortingSelect placeHolder="최신순" onClick={onHandleSorting} />
            </div>

            {reviewLoading ? (
              <Skeleton />
            ) : reviews ? (
              <ul className="flex flex-col gap-y-16">
                {visibleItems.map((review, i) => (
                  <li key={i}>
                    <ReviewCard
                      review={review}
                      onDelete={onHandleDelete}
                      onEdit={onReviewEdit}
                      onLike={onLikeClick}
                      showActions={review.user.id === userId}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyReviewCard />
            )}

            {currentIndex < (reviewData?.list?.length ?? 0) && (
              <div ref={loadRef} style={{ padding: "10px", textAlign: "center" }}>
                데이터 로드 중...
              </div>
            )}
            {reviewError && (
              <p className="text-14-regular lg:text-16-regular">리뷰 리스트를 불러오는데 실패했습니다.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
