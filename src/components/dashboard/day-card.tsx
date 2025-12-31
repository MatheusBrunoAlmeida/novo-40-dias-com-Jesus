"use client";

import { useTransition } from "react";
import { CheckIcon } from "@radix-ui/react-icons";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toggleReading } from "@/actions/reading";
import { cn } from "@/lib/utils";

interface DayCardProps {
  dayNumber: number;
  isCompleted: boolean;
  description: string;
};

export const DayCard = ({
  dayNumber,
  isCompleted,
  description
}: DayCardProps) => {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      toggleReading(dayNumber);
    });
  };

  return (
    <Card className={cn(
      "border-2 transition-colors",
      isCompleted ? "border-emerald-500 bg-emerald-500/10" : "hover:border-slate-300"
    )}>
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          Dia {dayNumber}
          {isCompleted && <CheckIcon className="w-5 h-5 text-emerald-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-4 flex items-center gap-x-2">
          <span>Ler:</span>
          <p className="text-lg font-semibold">
            {description}
          </p>
        </div>
        <Button
          onClick={onClick}
          disabled={isPending}
          variant={isCompleted ? "outline" : "default"}
          className={cn(
            "w-full",
            isCompleted && "text-emerald-500 border-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
          )}
        >
          {isCompleted ? "Concluído" : "Marcar como Lido"}
        </Button>
      </CardContent>
    </Card>
  );
};
