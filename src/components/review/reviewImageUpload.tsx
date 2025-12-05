"use client";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import { useToast } from "@/components/toast";
import { cn } from "@/utils/cn";
import { Swiper, SwiperSlide } from "swiper/react";
import { Toast } from "@/components/toast";
import IcAddImage from "@/assets/icons/ic_add_img.svg";
import IcClose from "@/assets/svgr/ic_close.svg";
import Image from "next/image";

import "swiper/css";

interface UploadImgProps {
  productId: number;
  onFilesChange?: (files: File[]) => void;

  editPreview?: (e: number) => void; //배열의 갯수가 달라질때
  reviewImages?: Array<{
    id?: number;
    source?: string;
  }>;
}

const MAX_UPLOAD = 3; //첨부 이미지 최대 갯수

export default function ReviewImageUpLoad({ productId, onFilesChange, editPreview, reviewImages }: UploadImgProps) {
  const { openToast, closeToast } = useToast();

  const [isSwiperMounted, setIsSwiperMounted] = useState(false); //슬라이드
  const fileRef = useRef<HTMLInputElement | null>(null); //업로드 이미지
  const fileChangeRef = useRef<HTMLInputElement>(null); //교체 이미지
  const [remain, setRemain] = useState<number>(MAX_UPLOAD);

  //수정에서 넘어올때
  const prevPreviews = reviewImages?.map(image => image.source).filter(source => source !== undefined); //기존이미지 rul 배열
  //작성에서 넘어올때
  const [previews, setPreviews] = useState<string[]>(prevPreviews || []);
  const [files, setFiles] = useState<File[]>([]);

  //미리보기 초깃값
  useEffect(() => {
    if (prevPreviews) {
      setPreviews(prevPreviews);
    }
  }, []);

  //남은 갯수 계산
  const handelRemain = () => {
    setRemain(MAX_UPLOAD - previews.length);
  };

  //첨부 이미지
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    const selectedImage = e.target?.files;

    if (selectedImage) {
      if (selectedImage?.[0].size > 5 * 1024 * 1024) {
        openToast(<Toast label="최대 용량은 5MB입니다." />);
        setFiles(prev => prev.slice(0, -files.length));
        return;
      }
    }
    //첨부 파일 갯수 초과 토스트
    if (selectedFiles.length > remain) {
      openToast(<Toast label="이미지 첨부는 최대 3개 까지 가능합니다." closedTime={2000} />);
      setRemain(MAX_UPLOAD - previews.length);
    } else {
      //첨부
      setFiles(prev => [...prev, ...selectedFiles]);
      setPreviews(prev => prev.concat(newPreviews));
    }

    e.target.value = "";
  };

  // 첨부 이미지 교체
  const handleChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const selectedImage = e.target?.files;
    if (e.target.files) {
      const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
      const slide = e.target.closest(".swiper-slide");
      const index = slide?.id;

      //미리보기 교체
      const selectedFileUrl = URL.createObjectURL(e.target.files[0]);
      const newPreviews = [...previews];

      //fileList 배열 교체
      const newFiles = [...files]; // input 값

      if (index !== undefined) {
        newPreviews[Number(index)] = selectedFileUrl; //URL삭제
      }
      setPreviews(newPreviews);

      if (index !== undefined) {
        newFiles[Number(index)] = selectedFiles[0];
        setFiles(newFiles);
        onFilesChange?.(newFiles);
      }
    }
    if (selectedImage) {
      if (selectedImage?.[0].size > 5 * 1024 * 1024) {
        openToast(<Toast label="최대 용량은 5MB입니다." />);
        setFiles(prev => prev.slice(0, -files.length));
        return;
      }
    }
  };

  //삭제
  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setFiles(newFiles);
    setPreviews(newPreviews);
    onFilesChange?.(newFiles);
    if (editPreview) {
      editPreview(index);
    }
  };

  //이미지 배열 길이 체크 - 수정시 필요
  useEffect(() => {
    if (editPreview) {
      editPreview(previews.length);
    }
  }, [previews]);

  // 부모로 전달
  useEffect(() => {
    onFilesChange?.(files);
  }, [files]);

  useEffect(() => {
    setIsSwiperMounted(true);
  }, []);

  return (
    <div className="flex items-center">
      <Swiper
        freeMode={true}
        slidesPerView={3}
        breakpoints={{
          0: {
            slidesPerView: 2,
            spaceBetween: 40,
          },

          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
        className="w-full"
      >
        {MAX_UPLOAD > previews.length && (
          <SwiperSlide className="!mr-10 select-none pt-7 md:!mr-20">
            <div className={cn("h-120 w-120 rounded-12 border border-gray-300 bg-white", "md:h-140 md:w-140")}>
              <input
                id="uploadImage"
                onClick={handelRemain}
                onChange={handleUpload}
                ref={fileRef}
                className="hidden"
                type="file"
                multiple
                accept=".jpg, .jpeg, .png, .gif"
              />
              <label
                htmlFor="uploadImage"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-8 text-12-regular text-gray-800 md:gap-16 md:text-16-regular"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    fileRef?.current?.click();
                  }
                }}
              >
                <IcAddImage className="h-24 w-24 text-gray-800" />
                이미지 추가
              </label>
            </div>
          </SwiperSlide>
        )}

        {previews.map((url, i) => (
          <SwiperSlide className="select-none pt-7" id={`${i}`}>
            <div
              className={cn(
                "relative flex h-120 w-120 cursor-pointer flex-col items-center justify-center gap-16 rounded-12 border border-gray-300 bg-white",
                "md:h-140 md:w-140",
              )}
            >
              <input
                id={`image-${productId}-${i}`}
                onChange={e => handleChange(e, i)}
                ref={fileChangeRef}
                className="hidden"
                name={`image-${productId}-${i}`}
                type="file"
                accept=".jpg, .jpeg, .png, .gif"
              />
              <div
                className="absolute -right-17 -top-7 z-10 flex h-36 w-36 cursor-pointer items-center justify-center rounded-100 border-2 border-white bg-gray-400"
                onClick={e => {
                  e.stopPropagation();
                  handleRemove(i);
                }}
              >
                <IcClose className="h-20 w-20 text-gray-100" />
              </div>
              <Image className="rounded-12" src={url} fill alt={`image${i}`} />
              <label htmlFor={`image-${productId}-${i}`} className="absolute inset-0 overflow-hidden -indent-100">
                이미지 교체
              </label>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
