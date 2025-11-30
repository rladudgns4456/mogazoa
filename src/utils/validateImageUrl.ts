/**
 * 이미지 URL 유효성 검사
 * - example.com 같은 placeholder URL 필터링
 * - http/https 프로토콜 검사
 * - null/undefined/빈 문자열 체크
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return false;
  }

  // example.com 도메인 제외 (API 문서 예시 URL)
  if (url.includes("example.com")) {
    return false;
  }

  // http 또는 https로 시작하는지 확인
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return false;
  }

  return true;
}
