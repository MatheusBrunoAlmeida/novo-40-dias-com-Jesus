"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const DaySelector = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentDay = searchParams.get("day") || "1";

    const onSelect = (value: string) => {
        router.push(`/admin?day=${value}`);
    }

    const days = Array.from({ length: 40 }, (_, i) => i + 1);

    return (
        <div className="flex items-center gap-x-4 mb-6">
            <Label>Selecione o Dia:</Label>
            <Select
                value={currentDay}
                onValueChange={onSelect}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Dia 1" />
                </SelectTrigger>
                <SelectContent>
                    {days.map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                            Dia {day}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
