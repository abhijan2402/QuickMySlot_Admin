import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import { LucideCurrency } from "lucide-react";
import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics({ stats }) {
  // Helper function to get arrow + color
  const getChangeBadge = (changeValue) => {
    if (changeValue === undefined || changeValue === null) return null;

    const numericChange = parseFloat(changeValue);

    if (isNaN(numericChange)) return null;

    if (numericChange > 0) {
      return (
        <Badge color="success">
          <ArrowUpIcon />
          {numericChange}%
        </Badge>
      );
    } else if (numericChange < 0) {
      return (
        <Badge color="error">
          <ArrowDownIcon />
          {Math.abs(numericChange)}%
        </Badge>
      );
    } else {
      return <Badge color="gray">{numericChange}%</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
      {/* Total Customers */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stats?.total_customers?.value || "0"}
            </h4>
          </div>
          {getChangeBadge(stats?.total_customers?.change)}
        </div>
      </div>

      {/* Total Providers */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Providers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stats?.total_providers?.value || "0"}
            </h4>
          </div>
          {getChangeBadge(stats?.total_providers?.change)}
        </div>
      </div>

      {/* Total Revenue */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <LucideCurrency className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Revenue (Last 30 days)
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              ₹ {stats?.total_revenue_last_30_days?.value || "0.00"}
            </h4>
          </div>
          {getChangeBadge(stats?.total_revenue_last_30_days?.change)}
        </div>
      </div>
    </div>
  );
}
