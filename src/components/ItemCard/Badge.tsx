interface BadgeProps {
  rank: number;
}

export default function Badge({ rank }: BadgeProps) {
  return (
    <div className="flex size-24 items-center justify-center rounded-8 bg-primary-500 text-12-bold text-white md:size-32 md:text-16-bold">
      {rank}
    </div>
  );
}
