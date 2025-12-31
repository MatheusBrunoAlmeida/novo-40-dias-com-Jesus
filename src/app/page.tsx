import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import Image from 'next/image';

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <div className="space-y-6 text-center">
        <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
        <p className="text-white text-lg">
          Leitura compartilhada do Novo Testamento
        </p>
        <div>
          <LoginButton>
            <Button variant="secondary" size="lg">
              Entrar
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
