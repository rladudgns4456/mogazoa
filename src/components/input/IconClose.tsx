interface IconCloseProps {
  color?: string;
  size?: number;
}

export default function IconClose({ color = "var(--gray-400)", size = 20 }: IconCloseProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke={color} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}
