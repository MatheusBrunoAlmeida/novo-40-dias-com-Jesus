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

interface AdminFiltersProps {
  cities: string[];
  structures: string[];
}

export const AdminFilters = ({
  cities,
  structures,
}: AdminFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentDay = searchParams.get("day") || "1";
  const currentCity = searchParams.get("city") || "all";
  const currentStructure = searchParams.get("structure") || "all";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/admin?${params.toString()}`);
  };

  const days = Array.from({ length: 40 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white rounded-lg border">
      <div className="flex flex-col gap-2">
        <Label>Dia</Label>
        <Select
          value={currentDay}
          onValueChange={(value) => updateFilters("day", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o dia" />
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

      <div className="flex flex-col gap-2">
        <Label>Cidade</Label>
        <Select
          value={currentCity}
          onValueChange={(value) => updateFilters("city", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas as cidades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Estrutura</Label>
        <Select
          value={currentStructure}
          onValueChange={(value) => updateFilters("structure", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas as estruturas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {structures.map((structure) => (
              <SelectItem key={structure} value={structure}>
                {structure}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
