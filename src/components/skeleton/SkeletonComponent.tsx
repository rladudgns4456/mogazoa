import { cn } from "@/utils/cn";

interface Props {
  styleClass?: string;
}

export default function Skeleton({ styleClass }: Props) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden rounded-8 bg-gray-300", styleClass)}>
      <div
        className={cn(
          "via-white/20 absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent to-transparent",
          styleClass,
        )}
      />
    </div>
  );
}
