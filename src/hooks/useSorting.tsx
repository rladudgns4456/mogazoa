export default function useSorting(value: string) {
  let order = "";
  switch (value) {
    case "createdAt":
      order = "recent";
      break;

    case "ranking":
      order = "ratingDesc";
      break;

    case "rankingDown":
      order = "ratingAsc";
      break;

    case "favoriteCount":
      order = "likeCount";
      break;
    default:
      order = "recent";
      break;
  }

  return order;
}
