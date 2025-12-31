"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-full shadow-sm">
      <div className="flex gap-x-2">
        <Button
            asChild
            variant={pathname === "/dashboard" ? "default" : "outline"}
        >
          <Link href="/dashboard">
            Dashboard
          </Link>
        </Button>
        {/* <Button
            asChild
            variant={pathname === "/admin" ? "default" : "outline"}
        >
          <Link href="/admin">
            Admin
          </Link>
        </Button> */}
      </div>
      <UserButton />
    </nav>
  );
};
