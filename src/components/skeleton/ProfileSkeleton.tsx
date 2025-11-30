import cn from "clsx";

// 프로필 카드 스켈레톤 UI

export default function ProfileSkeleton() {
  return (
    <div className={cn("animate-pulse rounded-b-40 bg-white shadow")}>
      {/* 프로필 박스 */}
      <div className={cn("relative mx-auto max-w-680 px-22 py-27 md:px-62 md:py-58 lg:px-0 lg:py-42")}>
        {/* 프로필 */}
        <div className={cn("mb-40 grid grid-cols-[1fr_6fr] gap-x-20 md:grid-cols-[1fr_2fr]", "md:gap-x-60")}>
          {/* 프로필 이미지 */}
          <div
            className={cn(
              "col-start-1 col-end-2 row-start-1 row-end-3 justify-self-end",
              "md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-4 md:place-self-center",
              "size-68 overflow-hidden rounded-full bg-gray-200 md:size-160",
            )}
          />

          {/* 닉네임 */}
          <div
            className={cn(
              "col-start-2 col-end-3 row-start-1 row-end-2 self-center",
              "h-24 w-120 rounded bg-gray-200 md:h-28",
            )}
          />

          {/* 설명 */}
          <div
            className={cn(
              "col-start-1 col-end-3 row-start-3 row-end-4 mt-24",
              "md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-3 md:mt-0",
              "h-20 w-full rounded bg-gray-200",
            )}
          />

          {/* 팔로워/팔로잉 영역 */}
          <div className={cn("self-center", "md:col-start-2 md:col-end-3 md:row-start-3 md:row-end-4")}>
            <div className={cn("flex items-center justify-between")}>
              <div className={cn("flex gap-15")}>
                {/* 팔로워 */}
                <div className={cn("h-20 w-80 rounded bg-gray-200")} />
                {/* 팔로잉 */}
                <div className={cn("h-20 w-80 rounded bg-gray-200")} />
              </div>
              {/* 프로필 편집 버튼 */}
              <div
                className={cn(
                  "absolute right-22 top-27",
                  "h-32 w-80 rounded-8 bg-gray-200 md:static md:h-34 md:w-100 lg:mr-60",
                )}
              />
            </div>
          </div>
        </div>

        {/* 통계 */}
        <div className={cn("flex items-center justify-evenly border-t pb-38 pt-28 text-center")}>
          {/* 별점 평균 */}
          <div className={cn("space-y-8")}>
            <div className={cn("mx-auto h-24 w-40 rounded bg-gray-200 md:h-28 md:w-50")} />
            <div className={cn("mx-auto h-16 w-100 rounded bg-gray-200 md:h-20")} />
          </div>

          {/* 리뷰 수 */}
          <div className={cn("space-y-8")}>
            <div className={cn("mx-auto h-24 w-40 rounded bg-gray-200 md:h-28 md:w-50")} />
            <div className={cn("mx-auto h-16 w-80 rounded bg-gray-200 md:h-20")} />
          </div>

          {/* 관심 카테고리 */}
          <div className={cn("space-y-8")}>
            <div className={cn("mx-auto h-24 w-60 rounded bg-gray-200 md:h-28 md:w-80")} />
            <div className={cn("mx-auto h-16 w-100 rounded bg-gray-200 md:h-20")} />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className={cn("flex justify-center md:px-0 lg:px-20")}>
          <div className={cn("h-42 w-full rounded-8 bg-gray-200 md:h-48")} />
        </div>
      </div>
    </div>
  );
}
