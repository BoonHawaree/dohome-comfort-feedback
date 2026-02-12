'use client';

interface HeaderProps {
  storeName: string;
}

export default function Header({ storeName }: HeaderProps) {
  return (
    <div className="flex items-baseline justify-between px-5 pt-5 pb-2">
      <h1 className="text-[20px] font-bold leading-tight text-[#0E7EE4]">
        Submit Feedback
      </h1>
      <span className="text-[14px] font-medium text-[#6B7280]">
        {storeName}
      </span>
    </div>
  );
}
