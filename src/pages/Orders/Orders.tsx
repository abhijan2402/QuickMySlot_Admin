import React, { useState } from "react";
import { Tabs, Table, Button } from "antd";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useGetordersQuery } from "../../redux/api/ordersApi";
import { useSidebar } from "../../context/SidebarContext";

const { TabPane } = Tabs;

const Orders = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const [activeRole, setActiveRole] = useState("customer");

  // Fetch Orderss based on active role
  const { data, isLoading, isFetching } = useGetordersQuery("");

  // Flattened Orders list
  const Orders = data?.data || [];

  // Table Columns including Action with Invoice button
  const columns = [
    {
      title: "Date",
      dataIndex: "created_at",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
    },
    {
      title: "Payment ID",
      dataIndex: "payment_id",
      key: "payment_id",
    },
    {
      title: "Customer",
      dataIndex: ["customer", "name"],
      key: "customer",
      render: (name) => name || "N/A",
    },
    {
      title: "Vendor",
      dataIndex: ["vendor", "business_name"],
      key: "vendor",
      render: (name, record) => name || record?.vendor?.name || "N/A",
    },

    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (val) => `₹${parseFloat(val).toFixed(2)}`,
    },
    {
      title: "Platform Fee",
      dataIndex: "platform_fee",
      key: "platform_fee",
      render: (val) => `₹${parseFloat(val || 0).toFixed(2)}`,
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      render: (val) => `₹${parseFloat(val || 0).toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-md text-white ${
            status === "confirmed"
              ? "bg-green-500"
              : status === "pending"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        >
          {status?.toUpperCase()}
        </span>
      ),
    },
  ];

  return (
    <div
      className={`flex-1  transition-all duration-300 ease-in-out ${
        isExpanded || isHovered
          ? "lg:pl-0 lg:w-[1190px]"
          : "lg:pl-[0px] lg:w-[1390px]"
      } ${isMobileOpen ? "ml-0" : ""}`}
    >
      <PageBreadcrumb pageTitle="Orders History" />
      {/* <Tabs
        activeKey={activeRole}
        onChange={setActiveRole}
        type="line"
        animated
      >
        <TabPane tab="Customer" key="customer" />
        <TabPane tab="Vendor" key="vendor" />
      </Tabs> */}

      <Table
        columns={columns}
        dataSource={Orders}
        rowKey="id"
        loading={isFetching}
        scroll={{ x: "max-content" }}
        pagination={{
          pageSizeOptions: ["15", "25", "50"],
          showSizeChanger: true,
          defaultPageSize: 15,
        }}
      />
    </div>
  );
};

export default Orders;
