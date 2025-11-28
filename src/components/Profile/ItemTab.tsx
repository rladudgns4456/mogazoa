import cn from "clsx";

export type TabType = "reviews" | "created" | "favorite";

interface ItemTabProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  className?: string;
}

interface Tab {
  key: TabType;
  label: string;
}

const TABS: Tab[] = [
  { key: "reviews", label: "리뷰 남긴 상품" },
  { key: "created", label: "등록한 상품" },
  { key: "favorite", label: "찜한 상품" },
];

/**
 * 아이템 탭 컴포넌트
 * - 리뷰 남긴 상품, 등록한 상품, 찜한 상품 탭 전환
 */
export default function ItemTab({ activeTab, onTabChange, className }: ItemTabProps) {
  const handleTabClick = (tab: TabType) => {
    onTabChange(tab);
  };

  return (
    <div className={cn("flex", className)} role="tablist">
      {TABS.map(tab => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={activeTab === tab.key}
          onClick={() => handleTabClick(tab.key)}
          className={cn(
            "relative flex-1 py-16 text-16-bold transition-colors",
            "border-b border-gray-300",
            "md:flex-initial md:p-16 md:text-18-bold",
            activeTab === tab.key
              ? "border-b-[3px] border-gray-900 text-gray-800"
              : "text-gray-500 hover:text-gray-700",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
