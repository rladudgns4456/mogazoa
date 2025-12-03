import Button from "@/components/Button";
import { useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useState } from "react";
import ImageBox from "@/components/ImageBox";
import StarRating from "@/components/review/StarRating";
import { ModalContainer } from "@/components/modal/modalBase";
import { useModal } from "@/components/modal/modalBase";
import { Toast, useToast } from "@/components/toast";
import TextArea from "@/components/input/TextArea";
import ReviewImageUpLoad from "./reviewImageUpload";
import { useCreateReview, useImageUrlGet, useEditReview } from "@/api/ReviewApi";
import { ReviewEdit, AlertState } from "@/types/review";

export default function EditReview({ productId, id, image, name, item, rating }: ReviewEdit) {
  const { closeModal } = useModal();
  const { openToast } = useToast();
  const queryClient = useQueryClient();

  //기존 내용
  const [prevContent, setPrevContent] = useState({
    content: item?.content ?? "",
    rating: item?.rating ?? 0,
  });

  let prevImageCount: number = item?.reviewImages.length ?? 0;
  const [countChang, setCountChang] = useState<number>(item?.reviewImages.length ?? 0);

  // 기존 이미지 id
  const prevImageId = item?.reviewImages[0];
  // 기존 이미지 url
  const prevImageUrl = item?.reviewImages[1];

  //리뷰 작성
  const [textValue, setTextValue] = useState<string>(item?.content ?? "");
  const [isTextAlert, setIsTextAlert] = useState<AlertState>({ alert: false, content: "" });
  const [isFormCheck, setIsFormCheck] = useState<boolean>(false);

  //별점
  const [ratingValue, setRatingValue] = useState<number>(item?.rating ?? rating ?? 0);
  const [isRatingAlert, setIsRatingAlert] = useState<AlertState>({ alert: false, content: "" });

  //이미지 업로드
  const [uploadImage, setUploadImage] = useState<File[]>([]);

  //리뷰 수정상태
  const [isChange, setIsChange] = useState<boolean>(false);

  // useCreateReview 훅 호출
  const { mutate: createReviewMutate, isPending } = useCreateReview(); //수정해야함
  const { mutate: useImageUrl } = useImageUrlGet();

  //리뷰 입력
  const handleTextChange = (newValue: string) => {
    setTextValue(newValue);
  };

  //별정
  const getHandleRating = (value: number) => {
    setRatingValue(value);
    setIsRatingAlert({ alert: true, content: "" });
  };

  //첨부 이미지 배열
  const changeImage = ([...file]) => {
    setUploadImage([...file]);
  };

  //이미지 주소 만들기
  const createUrl = async (uploadImage: File[]) => {
    const urls = await new Promise(resolve => {
      useImageUrl(uploadImage, {
        onSuccess: data => {
          resolve(data as string[]); // 업로드된 파일 정보 배열
        },
        onError: error => {
          openToast(<Toast errorMessage="이미지 등록에 실패했습니다." error />);
        },
      });
    });
    return urls as string[];
  };

  const handleTextAlert = () => {
    if (textValue.length < 10) {
      if (textValue.length >= 1) {
        setIsTextAlert({
          alert: true,
          content: "최소 10자 이상 작성해 주세요",
        });
      } else if (textValue.length === 0) {
        setIsTextAlert({
          alert: true,
          content: "리뷰 내용을 입력해주세요",
        });
      }
    } else {
      setIsTextAlert({
        alert: false,
        content: "",
      });
      setIsFormCheck(true);
    }
  };

  useEffect(() => {
    if (isTextAlert) {
      if (textValue.length > 1) {
        setIsTextAlert({
          alert: false,
          content: "",
        });
      }
    }
    if (isChange) {
      if (textValue.length >= 10) {
        setIsTextAlert({
          alert: false,
          content: "",
        });
        setIsFormCheck(true);
      }
      setIsFormCheck(true);
    }
  }, [textValue]);

  //수정 체크
  useEffect(() => {
    if (prevContent.content !== textValue) {
      setIsFormCheck(true);
    }
    if (prevContent.rating !== ratingValue) {
      setIsFormCheck(true);
    }
    if (uploadImage.length > 0) {
      setIsFormCheck(true);
    }
    if (prevImageCount !== countChang) {
      setIsFormCheck(true);
    }
  }, [textValue, ratingValue, uploadImage, countChang]);

  let imageUrls = []; // 리퀘스트 보낼 배열

  //갯수 세기
  const onCountChang = (count: number) => {
    setCountChang(count);
  };

  const { mutate: editReviewMutate } = useEditReview();
  //폼 전송
  const onHandleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (ratingValue === 0) {
      setIsRatingAlert({ alert: true, content: "별점으로 상품을 평가해주세요." });
      return;
    }

    const newImage = await createUrl(uploadImage);

    const newImagesArray = Array.isArray(newImage) ? newImage : [newImage];

    const mixUrls = [...(Array.isArray(prevImageUrl) ? prevImageUrl : []), ...newImagesArray];

    const prevImageIdsArray = Array.isArray(prevImageId) ? prevImageId : [];

    const mixIds = [...prevImageIdsArray];

    const imageUrls = [];

    for (let i = 0; i < mixUrls.length; i++) {
      // 이전 이미지와 새 이미지가 모두 존재하는지 체크
      if (prevImageUrl && prevImageUrl[i] && mixUrls[i] === prevImageUrl[i]) {
        // 이전 이미지와 새 이미지가 같으면 id만 넣기
        if (prevImageId && prevImageId[i]) {
          imageUrls.push({ id: prevImageId[i] });
        }
      } else {
        // 새 이미지가 있으면 source만 넣기
        if (mixUrls[i]) {
          imageUrls.push({ source: mixUrls[i] });
        }
      }
    }
    //전송
    const newReview = {
      images: imageUrls,
      content: textValue,
      rating: ratingValue,
    };

    // 수정 호출
    editReviewMutate({ reviewId: id, updatedReview: newReview });
    closeModal();
  };

  return (
    <ModalContainer styleClass="px-18 md:px-40 pt-37 md:pt-40 pb-35 md:pb-50 w-325 md:w-580 sm:max-w-580">
      <form onSubmit={onHandleSubmit}>
        <h3 className="mb-28 text-18-bold md:mb-40 md:text-24-bold">리뷰 수정하기</h3>
        <div className="mb-24 flex gap-x-8 border-b border-gray-200 pb-16 md:mb-30 md:gap-x-20 md:pb-28">
          <ImageBox url={image} name={name} variant="review" size="lg" styleClass="md:w-80 md:h-80" />
          <div>
            <h4 className="mb-5 text-12-regular text-gray-600 md:text-14-regular">{name}</h4>
            <h5 className="text-12-medium md:text-18-medium">{name}</h5>
          </div>
        </div>

        <article className="mb-20 flex flex-wrap items-center justify-between md:mb-32">
          <h6 className="text-12-bold md:text-14-bold">별점</h6>
          <StarRating onChange={getHandleRating} value={rating} />
          {isRatingAlert && <p className="w-full pb-24 pt-5 text-12-regular text-error">{isRatingAlert.content}</p>}
        </article>
        <article className="mb-28 md:mb-40">
          <h6 className="mb-12 text-12-bold md:text-14-bold">상품 후기</h6>
          <div className="mb-23 h-169">
            <TextArea
              placeholder="후기를 작성해 주세요"
              value={textValue}
              onChange={handleTextChange}
              onBlur={e => handleTextAlert()}
              styleClass="p-12 md:p-20 text-14-regular md:text-16-regular"
            ></TextArea>
            {isTextAlert.alert && <p className="pb-24 pt-5 text-12-regular text-error">{isTextAlert.content}</p>}
          </div>
          <ReviewImageUpLoad productId={id} onFilesChange={changeImage} editPreview={onCountChang} item={item} />
        </article>

        <div className="flex gap-x-10">
          {isPending ? (
            <Button variant="primary" type="button" onClick={e => onHandleSubmit(e)} disabled={isFormCheck}>
              리뷰를 수정 중입니다.
            </Button>
          ) : (
            <Button variant="primary" type="button" onClick={e => onHandleSubmit(e)} disabled={!isFormCheck}>
              리뷰수정 완료
            </Button>
          )}
        </div>
      </form>
    </ModalContainer>
  );
}
