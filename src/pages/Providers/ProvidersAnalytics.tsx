import React from "react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useGetProviderAnalysisQuery } from "../../redux/api/providerApi";
import { Table } from "antd";

const ProvidersAnalytics: React.FC = () => {
  const { data } = useGetProviderAnalysisQuery();
  const apiData = data?.data || {};

  /* -------------------- PROVIDER OVERVIEW -------------------- */
  const providerOverview = apiData.provider_overview || {};
  const providerOverviewItems = [
    {
      label: "Total Providers Listed",
      value: providerOverview.total_providers_listed ?? 0,
    },
    {
      label: "Profile Completed",
      value: providerOverview.profile_completed ?? 0,
    },
    {
      label: "Profile In Review",
      value: providerOverview.profile_in_review ?? 0,
    },
  ];

  /* -------------------- REVENUE METRICS -------------------- */
  const revenueMetrics = apiData.revenue_metrics || {};
  const revenueChartData = [
    {
      name: "Avg Revenue per Provider MoM",
      value: Number(revenueMetrics.average_revenue_per_provider_mom) || 0,
    },
    {
      name: "Revenue Growth %",
      value: Number(revenueMetrics.revenue_growth_percentage) || 0,
    },
    {
      name: "Cancellation Charges",
      value: Number(revenueMetrics.total_cancellation_charges_generated) || 0,
    },
    {
      name: "Current Month Revenue",
      value: Number(revenueMetrics.current_month_revenue) || 0,
    },
    {
      name: "Last Month Revenue",
      value: Number(revenueMetrics.last_month_revenue) || 0,
    },
  ];

  const revenueChartOptions: ApexOptions = {
    chart: { type: "bar" as const, height: 320 },
    plotOptions: { bar: { columnWidth: "45%" } },
    dataLabels: { enabled: true },
    xaxis: { categories: revenueChartData.map((i) => i.name) },
  };
  const revenueChartSeries = [
    { name: "Value", data: revenueChartData.map((i) => i.value) },
  ];

  /* -------------------- APPOINTMENT STATUS -------------------- */
  const appointmentStatus = apiData.appointment_status || {};
  const appointmentItems = [
    {
      label: "Completed",
      value: `${appointmentStatus.completed ?? 0}%`,
      icon: <CheckCircleOutlined style={{ color: "green", fontSize: 22 }} />,
    },
    {
      label: "Pending",
      value: `${appointmentStatus.pending ?? 0}%`,
      icon: <ClockCircleOutlined style={{ color: "#EAB308", fontSize: 22 }} />,
    },
    {
      label: "Cancelled",
      value: `${appointmentStatus.cancelled ?? 0}%`,
      icon: <CloseCircleOutlined style={{ color: "red", fontSize: 22 }} />,
    },
    {
      label: "Total Appointments",
      value: `${appointmentStatus.total_appointments ?? 0}`,
      icon: (
        <div style={{ fontSize: 18, color: "#7C0902", fontWeight: 700 }}>
          {appointmentStatus.total_appointments ?? 0}
        </div>
      ),
    },
  ];

  /* -------------------- PERFORMANCE METRICS -------------------- */
  const performance = apiData.performance_metrics || {};
  const performanceItems = [
    {
      label: "Average Completion Rate",
      value: `${performance.average_completion_rate ?? 0}%`,
    },
    {
      label: "Average Cancellation Rate",
      value: `${performance.average_cancellation_rate ?? 0}%`,
    },
    {
      label: "Total Platform Revenue",
      value: performance.total_platform_revenue ?? 0,
    },
    {
      label: "Average Bookings per Vendor",
      value: performance.average_bookings_per_vendor ?? 0,
    },
  ];

  /* -------------------- CATEGORY PERFORMANCE -------------------- */
  const categoryPerformance = apiData.category_performance || [];

  /* -------------------- SUMMARY -------------------- */
  const summary = apiData.summary || {};
  // map summary keys from API:
  // active_vendors_rate, average_revenue_per_booking, platform_utilization_rate
  const summaryItems = [
    {
      label: "Active Vendors Rate",
      value:
        summary.active_vendors_rate !== undefined
          ? `${summary.active_vendors_rate}%`
          : "0%",
    },
    {
      label: "Average Revenue per Booking",
      value: summary.average_revenue_per_booking ?? 0,
    },
    {
      label: "Platform Utilization Rate",
      value:
        summary.platform_utilization_rate !== undefined
          ? `${summary.platform_utilization_rate}%`
          : "0%",
    },
  ];

  /* -------------------- TOP PROVIDERS -------------------- */
  const topProviders = apiData.top_performing_vendors || [];

  /* ---------------------- Category ----------------------- */
  const categoryColumns = [
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Total Vendors",
      dataIndex: "total_vendors",
      key: "total_vendors",
    },
    {
      title: "Total Revenue",
      dataIndex: "total_revenue",
      key: "total_revenue",
    },
    {
      title: "Avg Completion Rate",
      dataIndex: "average_completion_rate",
      key: "average_completion_rate",
      render: (v) => `${v ?? 0}%`,
    },
    {
      title: "Avg Cancellation Rate",
      dataIndex: "average_cancellation_rate",
      key: "average_cancellation_rate",
      render: (v) => `${v ?? 0}%`,
    },
  ];

  /* ------------------------------   --------------------------- */
  const topProviderColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Business Name",
      dataIndex: "business_name",
      key: "business_name",
    },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Total Bookings",
      dataIndex: "total_bookings",
      key: "total_bookings",
    },
    {
      title: "Completed Bookings",
      dataIndex: "completed_bookings",
      key: "completed_bookings",
    },
    {
      title: "Cancelled Bookings",
      dataIndex: "cancelled_bookings",
      key: "cancelled_bookings",
    },
    {
      title: "Completion Rate",
      dataIndex: "completion_rate",
      key: "completion_rate",
      render: (v) => `${v ?? 0}%`,
    },
    {
      title: "Cancellation Rate",
      dataIndex: "cancellation_rate",
      key: "cancellation_rate",
      render: (v) => `${v ?? 0}%`,
    },
    {
      title: "Total Revenue",
      dataIndex: "total_revenue",
      key: "total_revenue",
    },
    {
      title: "Profile Status",
      dataIndex: "profile_status",
      key: "profile_status",
    },
    { title: "City", dataIndex: "city", key: "city" },
    {
      title: "Years of Experience",
      dataIndex: "years_of_experience",
      key: "years_of_experience",
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Provider Analytics" />

      {/* ---------------- PROVIDER OVERVIEW ---------------- */}
      <section className="border rounded-xl mb-4 shadow-sm p-5 bg-white">
        <h3 className="font-semibold text-lg mb-4">Provider Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {providerOverviewItems.map(({ label, value }) => (
            <div
              key={label}
              className="border rounded-lg p-4 bg-gray-50 shadow-sm"
            >
              <span className="text-gray-600 text-sm">{label}</span>
              <div className="font-bold text-xl text-[#7C0902]">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- REVENUE METRICS ---------------- */}
      <section className="border rounded-xl mb-4 shadow-sm p-5 bg-white">
        <h3 className="font-semibold text-lg mb-4">Revenue Metrics</h3>
        <ReactApexChart
          options={revenueChartOptions}
          series={revenueChartSeries}
          type="bar"
          height={320}
        />
      </section>

      {/* ---------------- APPOINTMENT STATUS ---------------- */}
      <section className="border rounded-xl mb-4 shadow-sm p-5 bg-white">
        <h3 className="font-semibold text-lg mb-4">Appointment Status</h3>
        <div className="flex flex-col gap-3">
          {appointmentItems.map(({ label, value, icon }) => (
            <div
              key={label}
              className="flex items-center gap-4 p-3 bg-pink-50 rounded-lg"
            >
              <div style={{ width: 30 }}>{icon}</div>
              <div className="font-bold text-lg text-[#7C0902]">{value}</div>
              <div className="text-gray-700">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- PERFORMANCE METRICS ---------------- */}
      <section className="border rounded-xl mb-4 shadow-sm p-5 bg-white">
        <h3 className="font-semibold text-lg mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {performanceItems.map(({ label, value }) => (
            <div
              key={label}
              className="border rounded-lg p-4 bg-gray-50 shadow-sm"
            >
              <span className="text-gray-600 text-sm">{label}</span>
              <div className="font-bold text-xl text-[#7C0902]">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- CATEGORY PERFORMANCE ---------------- */}
      <section className="border rounded-xl mb-4 shadow-sm p-5 bg-white">
        <h3 className="font-semibold text-lg mb-4">Category Performance</h3>

        <Table
          columns={categoryColumns}
          dataSource={categoryPerformance.map((item, i) => ({
            key: i,
            category: item.category ?? "Uncategorized",
            total_vendors: item.total_vendors ?? 0,
            total_revenue: item.total_revenue ?? 0,
            average_completion_rate: item.average_completion_rate ?? 0,
            average_cancellation_rate: item.average_cancellation_rate ?? 0,
          }))}
          pagination={false}
          bordered
        />
      </section>

      {/* ---------------- SUMMARY ---------------- */}
      <section className="border rounded-xl mb-4 shadow-sm p-5 bg-white">
        <h3 className="font-semibold text-lg mb-4">Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {summaryItems.map(({ label, value }) => (
            <div key={label} className="border rounded-lg p-4 bg-gray-50">
              <span className="text-gray-600 text-sm">{label}</span>
              <div className="font-bold text-xl text-[#7C0902]">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- TOP PROVIDERS ---------------- */}
      <section className="border rounded-xl mb-4 shadow-sm p-5 bg-white">
        <h3 className="font-semibold text-lg mb-4">Top Performing Vendors</h3>

        <Table
          columns={topProviderColumns}
          dataSource={topProviders.map((p, i) => ({
            key: p.id || i,
            ...p,
          }))}
          pagination={{
            pageSize: 10,
          }}
          bordered
          scroll={{ x: "max-content" }}
        />
      </section>
    </div>
  );
};

export default ProvidersAnalytics;
