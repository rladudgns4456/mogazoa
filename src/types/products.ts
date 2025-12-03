// export interface NotSuccessful {
//   userId: number | null;
//   isLoading?: boolean;
//   isError?: boolean;
// }

// export interface Products {
//   updatedAt: string;
//   createdAt: string;
//   writerId: number;
//   categoryId: number;
//   favoriteCount: number;
//   reviewCount: number;
//   rating: number;
//   image: string;
//   name: string;
//   id: number;
//   isFavorite: boolean;
// }

// //가져오기
// export interface ProductDetail extends NotSuccessful, Products {
//   description: string;
//   category?: {
//     id: number;
//     name: string;
//   };
//   categoryMetric?: {
//     rating: number;
//     favoriteCount: number;
//     reviewCount: number;
//   };
// }

// //수정
// export interface ProductPatchProps {
//   message: string;
//   details: {
//     name: {
//       message: string;
//       value: string;
//     };
//   };
// }

// //해당 카테고리
// export interface ProductCategory {
//   category: {
//     id: number;
//     name: string;
//   };
// }


// export interface Reviews {
//   nextCursor: 0;
//   list: [
//     {
//       user: {
//         image: string;
//         nickname: string;
//         id: number;
//       };
//       reviewImages: [
//         {
//           source: string;
//           id: number;
//         },
//       ];
//       productId: number;
//       userId: number;
//       updatedAt: string;
//       createdAt: string;
//       isLiked: true;
//       likeCount: number;
//       content: string;
//       rating: number;
//       id: number;
//     },
//   ];
// }
