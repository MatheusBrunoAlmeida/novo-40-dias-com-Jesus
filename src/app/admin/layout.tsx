import { Navbar } from "@/components/dashboard/navbar";

const AdminLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 p-4 pt-10 overflow-auto">
      <div className="w-[800px] max-w-full">
        <Navbar />
        <div className="mt-10 mb-20 bg-white rounded-xl p-6 shadow-sm">
           {children}
        </div>
      </div>
    </div>
   );
}

export default AdminLayout;
