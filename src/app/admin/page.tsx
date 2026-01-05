import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AdminFilters } from "@/components/admin/admin-filters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminPageProps {
  searchParams: Promise<{
    day?: string;
  }>
}

const AdminPage = async (props: AdminPageProps) => {
  const searchParams = await props.searchParams;
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return redirect("/dashboard");
  }

  const dayNumber = parseInt(searchParams.day || "1");
  const cityFilter = searchParams.city;
  const structureFilter = searchParams.structure;

  // Fetch unique cities and structures for filters
  const citiesData = await db.user.findMany({
    where: { role: "USER" },
    distinct: ['city'],
    select: { city: true },
    orderBy: { city: 'asc' }
  });
  const cities = citiesData.map(c => c.city);

  const structuresData = await db.user.findMany({
    where: { role: "USER" },
    distinct: ['structure'],
    select: { structure: true },
    orderBy: { structure: 'asc' }
  });
  const structures = structuresData.map(s => s.structure);

  // Stats Counters
  const totalUsers = await db.user.count({
    where: { role: "USER" }
  });

  // Build query with filters
  const whereClause: any = {
    dayNumber: dayNumber,
    isCompleted: true,
  };

  if (cityFilter || structureFilter) {
    whereClause.user = {};
    if (cityFilter) whereClause.user.city = cityFilter;
    if (structureFilter) whereClause.user.structure = structureFilter;
  }

  const readings = await db.readingProgress.findMany({
    where: whereClause,
    include: {
      user: true,
    },
    orderBy: {
      completedAt: 'desc',
    }
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500 font-medium">Total de Usuários</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500 font-medium">Leituras Concluídas (Dia {dayNumber})</p>
          <p className="text-3xl font-bold text-[#f25c08] mt-2">{readings.length}</p>
        </div>
      </div>

      <AdminFilters
        cities={cities}
        structures={structures}
      />

      <div className="rounded-md border bg-white shadow-sm mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Localidade</TableHead>
              <TableHead>Estrutura</TableHead>
              <TableHead>Concluído em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {readings.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-gray-500">
                  Nenhum registro encontrado para este filtro.
                </TableCell>
              </TableRow>
            )}
            {readings.map((reading: any) => (
              <TableRow key={reading.id}>
                <TableCell className="font-medium">{reading.user.name}</TableCell>
                <TableCell>{reading.user.city}/{reading.user.state}</TableCell>
                <TableCell>{reading.user.structure}{reading.user.otherStructure ? ` - ${reading.user.otherStructure}` : ''}</TableCell>
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
