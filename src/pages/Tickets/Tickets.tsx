import React, { useState } from "react";
import { Table, Button, Tag, Space, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

interface Ticket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  Open: "green",
  "In Progress": "orange",
  Closed: "red",
};

const priorityColors: Record<string, string> = {
  High: "red",
  Medium: "gold",
  Low: "blue",
};

const initialTickets: Ticket[] = [
  {
    id: 101,
    subject: "Login issue",
    status: "Open",
    priority: "High",
    createdAt: "2025-08-01",
  },
  {
    id: 102,
    subject: "Payment not processed",
    status: "In Progress",
    priority: "Medium",
    createdAt: "2025-08-02",
  },
  {
    id: 103,
    subject: "Unable to reset password",
    status: "Closed",
    priority: "Low",
    createdAt: "2025-07-28",
  },
  // more tickets...
];

const columns: ColumnsType<Ticket> = [
  {
    title: "Ticket ID",
    dataIndex: "id",
    key: "id",
    responsive: ["sm"], // only visible from small breakpoint and up
  },
  {
    title: "Subject",
    dataIndex: "subject",
    key: "subject",
    ellipsis: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Tag color={statusColors[status] || "default"}>{status}</Tag>
    ),
    filters: [
      { text: "Open", value: "Open" },
      { text: "In Progress", value: "In Progress" },
      { text: "Closed", value: "Closed" },
    ],
    onFilter: (value, record) => record.status === value,
  },
  {
    title: "Priority",
    dataIndex: "priority",
    key: "priority",
    render: (priority: string) => (
      <Tag color={priorityColors[priority] || "default"}>{priority}</Tag>
    ),
    filters: [
      { text: "High", value: "High" },
      { text: "Medium", value: "Medium" },
      { text: "Low", value: "Low" },
    ],
    onFilter: (value, record) => record.priority === value,
    responsive: ["md"],
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    responsive: ["lg"],
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Button
          type="link"
          onClick={() => alert(`Viewing ticket #${record.id}`)}
        >
          View
        </Button>
        {record.status !== "Closed" && (
          <Button
            danger
            type="link"
            onClick={() => alert(`Closing ticket #${record.id}`)}
          >
            Close
          </Button>
        )}
      </Space>
    ),
  },
];

const Tickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  return (
    <div>
      <PageBreadcrumb pageTitle="Tickets" />
      <Table
        columns={columns}
        dataSource={tickets}
        rowKey="id"
        pagination={{
          pageSizeOptions: ["5", "10", "15"],
          showSizeChanger: true,
          defaultPageSize: 5,
        }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Tickets;
