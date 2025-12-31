import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DayCard } from "@/components/dashboard/day-card";
import { Progress } from "@/components/ui/progress";
import { READING_PLAN } from "@/constants/reading-plan";

import logo from "../../../public/images/logo.png";
import Image from 'next/image';

const DashboardPage = async () => {
  const session = await auth();

  // We assume middleware protects this, but check assumes session exists
  if (!session?.user?.id) {
    return <div>Não autorizado</div>
  }

  const progress = await db.readingProgress.findMany({
    where: {
      userId: session.user.id
    }
  });

  const completedDays = progress.filter((p: any) => p.isCompleted).map((p: any) => p.dayNumber);
  const percentage = Math.round((completedDays.length / 40) * 100);

  const days = Array.from({ length: 40 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-y-6">
      <Image src={logo} alt="" />
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-4 text-center">Meu Progresso 🔥</h1>
        <div className="flex items-center gap-x-4">
          <Progress value={percentage} className="h-4" />
          <span className="font-bold text-lg min-w-[50px] text-right">{percentage}%</span>
        </div>
        <p className="text-center mt-2 text-muted-foreground">
          {completedDays.length} de 40 dias concluídos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {READING_PLAN.map((plan) => (
          <DayCard
            key={plan.day}
            dayNumber={plan.day}
            description={plan.reading}
            isCompleted={completedDays.includes(plan.day)}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
