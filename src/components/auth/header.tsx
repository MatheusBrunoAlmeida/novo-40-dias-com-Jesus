import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import Image from 'next/image';

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
};

export const Header = ({
  label,
}: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
      <p className="text-muted-foreground text-sm">
        {label}
      </p>
    </div>
  );
};
