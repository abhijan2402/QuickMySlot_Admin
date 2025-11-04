import React, { useState } from "react";
import { Tabs, Table, Button } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useGettransactionQuery } from "../../redux/api/transactionApi";
import { useSidebar } from "../../context/SidebarContext";

const { TabPane } = Tabs;

const Transaction = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const [activeRole, setActiveRole] = useState("customer");

  // Fetch transactions based on active role
  const { data, isLoading, isFetching } = useGettransactionQuery({
    role: activeRole,
  });

  // Flattened transaction list
  const transactions = data?.data || [];

  // Table Columns including Action with Invoice button
  const columns = [
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "User Name",
      dataIndex: ["user", "name"],
      key: "user_name",
      render: (name) => name || "N/A",
    },
    {
      title: "Transaction Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <span
          className={`px-2 py-1 rounded-md text-white ${
            type === "credit" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {type?.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Payment Mode",
      dataIndex: "payment_mode",
      key: "payment_mode",
      render: (mode) =>
        mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : "N/A",
    },
    {
      title: "Amount (₹)",
      dataIndex: "amount",
      key: "amount",
      render: (val, record) => (
        <span
          className={`font-semibold ${
            record.type === "credit" ? "text-green-600" : "text-red-600"
          }`}
        >
          ₹{parseFloat(val || 0).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-md text-white ${
            status === "success"
              ? "bg-green-500"
              : status === "pending"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        >
          {status ? status.toUpperCase() : "N/A"}
        </span>
      ),
    },
    {
      title: "Transaction ID",
      dataIndex: "transaction_id",
      key: "transaction_id",
    },
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
    },
    {
      title: "Reference ID",
      dataIndex: "reference_id",
      key: "reference_id",
      render: (id) => id || "N/A",
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
      render: (val) => val?.toUpperCase() || "INR",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() =>
            window.open(record?.invoice_pdf, "_blank", "noopener,noreferrer")
          }
          disabled={!record?.invoice_pdf}
        >
          Invoice
        </Button>
      ),
    },
  ];

  // Generate PDF of a single transaction
  const downloadSingleInvoice = (txn) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Transaction Invoice`, 14, 22);
    doc.setFontSize(12);
    doc.text(`Role: ${activeRole}`, 14, 32);
    doc.text(`Date: ${new Date(txn.created_at).toLocaleDateString()}`, 14, 40);
    doc.text(
      `Description: ${txn.type === "credit" ? "Credit" : "Debit"} - ${
        txn.payment_mode
      }`,
      14,
      48
    );
    doc.text(`Amount: ₹${parseFloat(txn.amount).toFixed(2)}`, 14, 56);
    doc.text(`Transaction ID: ${txn.transaction_id}`, 14, 64);

    doc.save(`Invoice_${txn.transaction_id}.pdf`);
  };

  return (
    <div
      className={`flex-1  transition-all duration-300 ease-in-out ${
        isExpanded || isHovered
          ? "lg:pl-0 lg:w-[1190px]"
          : "lg:pl-[0px] lg:w-[1390px]"
      } ${isMobileOpen ? "ml-0" : ""}`}
    >
      <PageBreadcrumb pageTitle="Transaction History" />
      <Tabs
        activeKey={activeRole}
        onChange={setActiveRole}
        type="line"
        animated
      >
        <TabPane tab="Customer" key="customer" />
        <TabPane tab="Vendor" key="vendor" />
      </Tabs>

      <Table
        columns={columns}
        dataSource={transactions}
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

export default Transaction;
