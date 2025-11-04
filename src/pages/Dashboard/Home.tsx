import { Building2, ClipboardList } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import { useGetdashboardQuery } from "../../redux/api/dashboard";

export default function Home() {
  const { data } = useGetdashboardQuery("");
  console.log(data)
  return (
    <>
      <PageMeta
        title="QUICKmySLOT Admin"
        description="Manage your services efficiently — track services, clients, and operations all in one place."
      />

      {/* Heading Section */}
      <section className="mb-8 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          {/* Heading with icon */}
          <div className="flex items-center gap-3 flex-wrap">
            <img
              className="dark:hidden"
              src="/logo.png"
              alt="Logo"
              width={40}
              height={30}
            />
            <div>
              <span className="tracking-wide text-2xl font-bold text-[#EE4E34] ">
                Admin
              </span>
              {/* <span className="tracking-wide  text-[#090A14] ">my</span> */}
              <span
                className="tracking-wide ml-2 text-[#090A14] 
               text-2xl font-bold"
              >
                Dashboard
              </span>
            </div>
          </div>

          {/* Paragraph with icon below heading */}
          <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 max-w-xl">
            <p className="text-base sm:text-lg leading-relaxed">
              Manage services, monitor requests, and handle operations
              seamlessly — all from one dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Main content grid */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="col-span-12 space-y-6">
          <EcommerceMetrics stats={data?.data} />
        </div>

        <div className="col-span-12 ">
          <MonthlySalesChart
            title={"Monthly Users"}
            stats={data?.data?.monthly_users_chart}
          />
        </div>

        <div className="col-span-12">
          <MonthlySalesChart
            title={"Monthly Providers"}
            stats={data?.data?.monthly_providers_chart}
          />
        </div>

        {/* <div className="col-span-12"><StatisticsChart /></div> */}
      </div>
    </>
  );
}
