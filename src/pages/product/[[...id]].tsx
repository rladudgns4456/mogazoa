"use client";

import { QueryClient, dehydrate, useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/login/AuthContext";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useEffect, useState, useRef } from "react";

//api
import { useDeleteReview, useGetReview } from "@/api/ReviewApi";
import { postProductFavorite, deleteProductFavorite, ProductsProps } from "@/api/productsApi";
import { getProductItem } from "@/api/productsApi";
//type
import { Review } from "@/types/review";
import { ProductDetail } from "@/types/product";

//컴포넌트
import Image from "next/image";
import DetailCard from "@/components/detailCard";
import Statistics from "@/components/statistics";
import ReviewCard from "@/components/review/ReviewCard";
import { Skeleton } from "@/components/skeleton";
import EmptyReviewCard from "@/components/review/EmptyReviewCard";
import { SortingSelect } from "@/components/selectBox";
import { useModal } from "@/components/modal/modalBase";
import { ConfigModal } from "@/components/modal";
import sorting from "@/utils/sorting";
import EditReview from "./_components/reviewModal/editReview";
import { Toast, useToast } from "@/components/toast";
//이미지
import title1 from "@/assets/images/statistics.png";
import title2 from "@/assets/images/review.png";

//한페이지 목록
const SHOW_MAX = 2;

//getServerSideProps
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

//ProductDetailCard
export default function ProductDetailCard({
  productId,
  productData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModal();
  const { openToast } = useToast();

  //유저 확인
  const { user } = useAuth();
  const [userId, setIsUser] = useState<number | null>(null);
  useEffect(() => {
    if (user && user.id !== undefined) {
      const id = typeof user.id === "string" ? parseInt(user.id, 10) : user.id;
      setIsUser(id);
    }
  }, [user]);

  //상품 정보
  const items: ProductDetail = productData;

  //상품 삭제
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

  //상품 비교
  const onCompareProduct = productId => {
    router.push("/compare");
  };

  //리뷰 가져오기
  const [order, setOrder] = useState("recent");
  const { data: reviewData, isLoading: reviewLoading, isError: reviewError } = useGetReview(productId, order);
  const reviews = reviewData?.list;

  // 리뷰 삭제 함수 호출
  const { deleteReview } = useDeleteReview();
  const onHandleDelete = (reviewId: number) => {
    deleteReview(reviewId);
  };

  const onHandleSorting = (value: string) => {
    const order = sorting(value);
    setOrder(order);
  };

  //무한 스크롤
  const [visibleItems, setVisibleItems] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(SHOW_MAX);
  const loadRef = useRef(null);

  useEffect(() => {
    if (reviewData) {
      setVisibleItems(reviewData.list.slice(0, SHOW_MAX));
    }
  }, [reviewData]);

  // 스크롤 감지 및 추가 데이터 로드
  useEffect(() => {
    if (!reviews || currentIndex >= reviews.length) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          // 다음 항목 로드
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

  //리뷰 수정
  const onReviewEdit = (id: number) => {
    if (reviews) {
      const editReview = reviews.find(reviews => reviews.id === id);
      {
        editReview &&
          openModal(
            <EditReview
              productId={productId}
              id={id}
              image={items.image}
              name={items.name}
              item={editReview}
              content={items.description}
              rating={editReview.rating}
            />,
          );
      }
    }
  };

  //리뷰 삭제

  //리뷰 좋아요
  // const [reviewLike, setReviewLike] = useState<boolean>(false);
  const onLikeClick = (reviewId: number) => {
    //   LikeReview(reviewId);
    //   setReviewLike(prev => !prev);
  }; //컴포넌트 수정 후 다시

  //찜 하기
  const onHandleSave = async (productId: number) => {
    if (items.isFavorite)
      try {
        await deleteProductFavorite(productId);
      } catch (error) {
        openToast(<Toast errorMessage="이미 찜한 상품입니다." error />);
      }
    else if (!items.isFavorite && items.favoriteCount === 1) {
      console.log("a");
      await postProductFavorite(productId);
    }
  };

  //url 복사
  const params = useParams();
  const id = params.id; // id는 string | undefined

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("클립보드에 복사되었습니다.");
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
    }
  };

  const onHandleUrlCopy = () => {
    const textToCopy = `${process.env.NEXT_PUBLIC_API_BASE}/camp/detail/${params.id}`;
    copyToClipboard(textToCopy);
  };

  //카카오공유
  const onHandleShare = () => {};

  return (
    <>
      <section className="pb-53 pt-0">
        <h2 className="-inset-4m-1 h-0 w-0 overflow-hidden text-1">상품상세 정보</h2>
        <DetailCard
          productId={productId}
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
          onDelete={onHandleDeleteProduct}
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
                {reviews?.map((items, i) => {
                  return (
                    <li key={i}>
                      <ReviewCard
                        review={items}
                        onDelete={onHandleDelete}
                        onEdit={onReviewEdit}
                        onLike={onLikeClick}
                        showActions={items.user.id === userId}
                      />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyReviewCard />
            )}
            {currentIndex < reviewData?.list.length && (
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
