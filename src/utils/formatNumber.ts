// 숫자 포맷팅 (1000 이상은 K로 표시)
export const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}K+`;
  }
  return num.toLocaleString();
};
