import CategoryTab from "@/components/categoryTab";
import { useRouter } from 'next/router';

export default function Home({}) {
    const router = useRouter();
  const onClick = (value: number) => {
    console.log(value);
    // router.push(`/categories/${value}`)
  };
  return (
    <>
      <CategoryTab url={'categories'} onHandleLoad={onClick} />
      <div>페이지</div>
    </>
  );
}
