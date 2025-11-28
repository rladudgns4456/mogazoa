import ItemTab, { TabType } from "@/components/Profile/ItemTab";
import ItemCard from "@/components/ItemCard";
import { Product } from "@/types/product";

interface ProductListData {
  list: Product[];
}

interface ProfileProductTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  reviewedProducts?: ProductListData;
  createdProducts?: ProductListData;
  favoriteProducts?: ProductListData;
}

/**
 * 프로필 페이지 상품 탭 및 목록 컴포넌트
 * - 리뷰/등록/찜한 상품을 탭으로 구분하여 표시
 */
export default function ProfileProductTabs({
  activeTab,
  onTabChange,
  reviewedProducts,
  createdProducts,
  favoriteProducts,
}: ProfileProductTabsProps) {
  const renderProductList = (products?: ProductListData, emptyMessage?: string) => {
    return (
      <div className="grid grid-cols-2 gap-20 md:grid-cols-3 md:gap-24">
        {products?.list.length ? (
          products.list.map(product => <ItemCard key={product.id} product={product} />)
        ) : (
          <div className="col-span-full py-60 text-center text-gray-500">{emptyMessage}</div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto mt-40 max-w-940 px-18 md:px-62 lg:px-0">
      <ItemTab activeTab={activeTab} onTabChange={onTabChange} />

      <div className="mt-40">
        {activeTab === "reviews" && renderProductList(reviewedProducts, "리뷰 남긴 상품이 없습니다")}
        {activeTab === "created" && renderProductList(createdProducts, "등록한 상품이 없습니다")}
        {activeTab === "favorite" && renderProductList(favoriteProducts, "찜한 상품이 없습니다")}
      </div>
    </div>
  );
}
