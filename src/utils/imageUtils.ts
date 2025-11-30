// 이미지 관련 유틸리티 함수

/**
 * 파일명에서 특수문자를 제거하여 안전한 파일명으로 변환
 * @param fileName - 원본 파일명
 * @returns 안전한 파일명 (영문, 숫자, ., -, _ 만 허용)
 */
export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.\-_]/g, "_") // 특수문자 → _
    .replace(/_{2,}/g, "_"); // 연속 _ 정리
};

/**
 * 이미지를 압축하고 리사이즈
 * @param file - 원본 이미지 파일
 * @param maxSizeMB - 최대 파일 크기 (MB)
 * @param maxWidth - 최대 너비 (px)
 * @returns 압축된 이미지 파일
 */
export const compressImage = async (file: File, maxSizeMB: number = 0.1, maxWidth: number = 400): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = event => {
      const img = new window.Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // 비율 유지하면서 리사이즈
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // 원본 파일 타입 유지 (PNG 투명도 지원)
        const mimeType = file.type || "image/jpeg";
        const isJPEG = mimeType === "image/jpeg" || mimeType === "image/jpg";

        // 품질을 조절하면서 용량 체크
        let quality = 0.7;
        const compress = () => {
          canvas.toBlob(
            blob => {
              if (!blob) {
                reject(new Error("이미지 압축 실패"));
                return;
              }

              const sizeInMB = blob.size / 1024 / 1024;

              // 용량이 목표보다 크고 품질을 더 낮출 수 있으면 재압축
              if (sizeInMB > maxSizeMB && quality > 0.1) {
                quality -= 0.1;
                compress();
                return;
              }

              // File 객체로 변환
              const compressedFile = new File([blob], file.name, {
                type: mimeType,
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            mimeType,
            isJPEG ? quality : undefined, // PNG는 quality 없음
          );
        };

        compress();
      };

      img.onerror = () => reject(new Error("이미지 로드 실패"));
    };

    reader.onerror = () => reject(new Error("파일 읽기 실패"));
  });
};

/**
 * 파일을 Base64 데이터 URL로 변환
 * @param file - 변환할 파일
 * @returns Base64 데이터 URL
 */
export const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("파일 읽기 실패"));
    reader.readAsDataURL(file);
  });
};
