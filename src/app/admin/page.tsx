import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { DaySelector } from "@/components/admin/day-selector";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminPageProps {
  searchParams: {
    day?: string;
  }
}

const AdminPage = async ({
  searchParams
}: AdminPageProps) => {
    const session = await auth();

    if (!session?.user || (session.user as any).role !== "ADMIN") {
        return redirect("/dashboard");
    }

    const dayNumber = parseInt(searchParams.day || "1");

    const readings = await db.readingProgress.findMany({
        where: {
            dayNumber: dayNumber,
            isCompleted: true,
        },
        include: {
            user: true,
        },
        orderBy: {
            completedAt: 'desc',
        }
    });

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-6">Painel Administrativo</h1>

            <DaySelector />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Localidade</TableHead>
                            <TableHead>Concluído em</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {readings.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">
                                    Nenhum registro encontrado para este dia.
                                </TableCell>
                            </TableRow>
                        )}
                        {readings.map((reading: any) => (
                            <TableRow key={reading.id}>
                                <TableCell className="font-medium">{reading.user.name}</TableCell>
                                <TableCell>{reading.user.city}/{reading.user.state}</TableCell>
                                <TableCell>
                                    {reading.completedAt ? new Date(reading.completedAt).toLocaleString('pt-BR') : "-"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
     );
}

export default AdminPage;
