import React from "react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useGetUsersAnalysisQuery } from "../../redux/api/UserApi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Table } from "antd";

const CustomersAnalytics = () => {
  const { data } = useGetUsersAnalysisQuery();
  const apiData = data?.data || {};

  /* -------------------- CUSTOMER OVERVIEW -------------------- */
  const customerOverview = apiData.customer_overview || {};
  const customerOverviewItems = [
    {
      label: "Total Registered Customers",
      value: customerOverview.total_registered_customers ?? "-",
    },
    {
      label: "Customers with at least 1 Booking",
      value: customerOverview.customers_with_at_least_1_booking ?? "-",
    },
    {
      label: "Average Appointments per Customer",
      value: customerOverview.average_appointments_per_customer ?? "-",
    },
    {
      label: "Total Revenue from Customers",
      value: customerOverview.total_revenue_from_customers ?? "-",
    },
    {
      label: "Average Customer LTV",
      value: customerOverview.average_customer_ltv ?? "-",
    },
  ];

  /* -------------------- REVENUE METRICS -------------------- */
  const revenueMetrics = apiData.revenue_metrics || {};
  const chartData = [
    {
      name: "Avg Revenue per Customer MoM",
      value: Number(revenueMetrics.average_revenue_per_customer_mom) || 0,
    },
    {
      name: "Revenue Growth %",
      value: Number(revenueMetrics.revenue_growth_percentage) || 0,
    },
    {
      name: "Cancellation Charges",
      value: Number(revenueMetrics.total_cancellation_charges_generated) || 0,
    },
  ];

  const chartOptions: ApexOptions = {
    chart: { type: "bar" as const, height: 320 },
    plotOptions: { bar: { columnWidth: "45%" } },
    dataLabels: { enabled: true },
    xaxis: { categories: chartData.map((i) => i.name) },
  };
  const chartSeries = [{ name: "Value", data: chartData.map((i) => i.value) }];

  /* -------------------- APPOINTMENT STATUS -------------------- */
  const appointmentStatus = apiData.appointment_status || {};
  const appointmentItems = [
    {
      label: "Completed",
      percent: appointmentStatus.completed
        ? `${appointmentStatus.completed}%`
        : "0%",
      icon: <CheckCircleOutlined style={{ color: "green", fontSize: 22 }} />,
    },
    {
      label: "Pending",
      percent: appointmentStatus.pending
        ? `${appointmentStatus.pending}%`
        : "0%",
      icon: <ClockCircleOutlined style={{ color: "#EAB308", fontSize: 22 }} />,
    },
    {
      label: "Cancelled",
      percent: appointmentStatus.cancelled
        ? `${appointmentStatus.cancelled}%`
        : "0%",
      icon: <CloseCircleOutlined style={{ color: "red", fontSize: 22 }} />,
    },
  ];

  /* -------------------- SUMMARY DATA -------------------- */
  const summary = apiData.summary || {};

  /* -------------------- TOP CUSTOMERS -------------------- */
  const topCustomers = apiData.top_customers || [];

  /* --------- --------------- */
  const topCustomerColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Total Bookings",
      dataIndex: "total_bookings",
      key: "total_bookings",
    },
    {
      title: "Total Spent",
      dataIndex: "total_spent",
      key: "total_spent",
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Customer Analytics" />

      {/* ------------- CUSTOMER OVERVIEW ------------- */}
      <section className="border rounded-xl mb-4 shadow-sm p-5 bg-white">
        <h3 className="font-semibold text-lg mb-4">Customer Overview</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {customerOverviewItems.map(({ label, value }) => (
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

      {/* ------------- REVENUE METRICS ------------- */}
      {/* <section className="border rounded-xl mb-4 shadow-sm p-5 bg-white">
        <h3 className="font-semibold text-lg mb-4">Revenue Metrics</h3>
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={320}
        />
      </section> */}

      {/* ------------- APPOINTMENT STATUS ------------- */}
      <section className="border rounded-xl mb-4 shadow-sm p-5 bg-white">
        <h3 className="font-semibold text-lg mb-4">Appointment Status</h3>
        <div className="flex flex-col gap-3">
          {appointmentItems.map(({ label, percent, icon }) => (
            <div
              key={label}
              className="flex items-center gap-4 p-3 bg-pink-50 rounded-lg"
            >
              {icon}
              <div className="font-bold text-lg text-[#7C0902]">{percent}</div>
              <div className="text-gray-700">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------- SUMMARY METRICS ------------- */}
      <section className="border rounded-xl mb-4 shadow-sm p-5 bg-white">
        <h3 className="font-semibold text-lg mb-4">Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border p-4 rounded-md bg-gray-50">
            <p className="text-gray-600 text-sm">Active Customer Rate</p>
            <p className="text-xl font-bold text-[#7C0902]">
              {summary.active_customers_rate ?? "0"}%
            </p>
          </div>
          <div className="border p-4 rounded-md bg-gray-50">
            <p className="text-gray-600 text-sm">Average Booking Value</p>
            <p className="text-xl font-bold text-[#7C0902]">
              {summary.average_booking_value ?? "0"}
            </p>
          </div>
          <div className="border p-4 rounded-md bg-gray-50">
            <p className="text-gray-600 text-sm">Cancellation Rate</p>
            <p className="text-xl font-bold text-[#7C0902]">
              {summary.cancellation_rate ?? "0"}%
            </p>
          </div>
        </div>
      </section>

      {/* ------------- TOP CUSTOMERS TABLE ------------- */}
      <section className="border rounded-xl mb-4 shadow-sm p-5 bg-white">
        <h3 className="font-semibold text-lg mb-4">Top Customers</h3>

        <Table
          columns={topCustomerColumns}
          dataSource={topCustomers.map((c, i) => ({
            key: c.id || i,
            id: c.id,
            name: c.name ?? "-",
            email: c.email ?? "-",
            total_bookings: c.total_bookings ?? 0,
            total_spent: c.total_spent ?? 0,
          }))}
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: "max-content" }}
        />
      </section>
    </div>
  );
};

export default CustomersAnalytics;
