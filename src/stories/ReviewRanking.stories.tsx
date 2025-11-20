import ReviewerRanking from "@/components/review/ReviewerRanking";
import { Reviewer } from "@/types/review";

export default {
  title: "Components/Review/ReviewerRanking",
  component: ReviewerRanking,
};

const mockReviewers: Reviewer[] = [
  {
    id: 1,
    nickname: "리뷰왕",
    image: "https://picsum.photos/80?random=1",
    description: "최고의 리뷰어",
    teamId: "team1",
    reviewCount: 1500,
    followersCount: 2500,
    createdAt: "2023-01-01",
    updatedAt: "2023-12-01",
  },
  {
    id: 2,
    nickname: "호박너구리",
    image: "https://picsum.photos/80?random=2",
    description: "맛집 전문 리뷰어",
    teamId: "team2",
    reviewCount: 1000,
    followersCount: 1800,
    createdAt: "2023-02-01",
    updatedAt: "2023-11-01",
  },
  {
    id: 3,
    nickname: "suri마수리",
    image: "https://picsum.photos/80?random=3",
    description: "카페 리뷰 전문",
    teamId: "team3",
    reviewCount: 700,
    followersCount: 1200,
    createdAt: "2023-03-01",
    updatedAt: "2023-10-01",
  },
  {
    id: 4,
    nickname: "비교요정",
    image: "https://picsum.photos/80?random=4",
    description: "디저트 리뷰어",
    teamId: "team4",
    reviewCount: 500,
    followersCount: 950,
    createdAt: "2023-04-01",
    updatedAt: "2023-09-01",
  },
  {
    id: 5,
    nickname: "눈썰미장인",
    image: "https://picsum.photos/80?random=5",
    description: "전문 음식 평론",
    teamId: "team5",
    reviewCount: 200,
    followersCount: 800,
    createdAt: "2023-05-01",
    updatedAt: "2023-08-01",
  },
  {
    id: 6,
    nickname: "살까말까왕",
    image: "https://picsum.photos/80?random=6",
    description: "새로운 리뷰어",
    teamId: "team6",
    reviewCount: 150,
    followersCount: 1200,
    createdAt: "2023-10-01",
    updatedAt: "2023-11-01",
  },
  {
    id: 7,
    nickname: "프로고민러",
    image: "https://picsum.photos/80?random=6",
    description: "새로운 리뷰어",
    teamId: "team6",
    reviewCount: 50,
    followersCount: 100,
    createdAt: "2023-10-01",
    updatedAt: "2023-11-01",
  },
];

export const Default = () => (
  <div style={{ padding: 24 }}>
    <ReviewerRanking reviewers={mockReviewers} />
  </div>
);

export const Empty = () => (
  <div style={{ padding: 24 }}>
    <ReviewerRanking reviewers={[]} />
  </div>
);

export const Single = () => (
  <div style={{ padding: 24 }}>
    <ReviewerRanking reviewers={[mockReviewers[0]]} />
  </div>
);
