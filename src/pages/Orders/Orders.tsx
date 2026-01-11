import React, { useMemo, useState } from "react";
import { Tabs, Table, Button, Row, Col, Input, Space, Modal } from "antd";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
  useDownloadInvoiceMutation,
  useGetordersQuery,
} from "../../redux/api/ordersApi";
import { useSidebar } from "../../context/SidebarContext";
import { DownloadIcon, FileSpreadsheet } from "lucide-react";
import { toast } from "react-toastify";
import { EyeOutlined } from "@ant-design/icons";
import OrderDetailsModal from "./OrderDetailsModal";

const { TabPane } = Tabs;

const Orders = () => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Fetch Orderss based on active role
  const { data, isLoading, isFetching } = useGetordersQuery("");
  const [downloadInvoice] = useDownloadInvoiceMutation();

  // View handler
  const handleViewOrder = (record: any) => {
    setSelectedOrder(record);
    setViewModalOpen(true);
  };

  //  Filtered & Processed Orders
  const filteredOrders = useMemo(() => {
    const orders = data?.data || [];

    return orders.filter((order: any) => {
      const query = searchText.toLowerCase().trim();
      const matchesSearch =
        order.id.toString().toLowerCase().includes(query) ||
        `QO${order.id}`.toLowerCase().includes(query) ||
        order.customer?.name?.toLowerCase().includes(query) ||
        order.vendor?.business_name?.toLowerCase().includes(query) ||
        order.vendor?.name?.toLowerCase().includes(query) ||
        order.final_amount?.toString().includes(query) ||
        order.status?.toLowerCase().includes(query);

      return matchesSearch;
    });
  }, [data?.data, searchText]);

  const handleDownloadInvoice = async (record) => {
    try {
      setDownloadingId(record.id);

      const formData = new FormData();
      formData.append("booking_id", record.id);

      const res = await downloadInvoice(formData).unwrap();

      const link = res?.data?.download_link;

      if (link) {
        const a = document.createElement("a");
        a.href = link;
        a.target = "_blank";
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        toast.error("Invoice download link not found");
      }
    } catch (error) {
      toast.error("Failed to download invoice");
    } finally {
      setDownloadingId(null);
    }
  };

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
      dataIndex: "id",
      key: "id",
      render: (name) => `QO${name}` || "--",
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
      dataIndex: "final_amount",
      key: "final_amount",
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
      sorter: (a, b) => {
        // Define sort order: confirmed > pending > others
        const statusOrder = {
          confirmed: 3,
          pending: 2,
          cancelled: 1,
          failed: 0,
        };

        return (
          (statusOrder[a.status as keyof typeof statusOrder] || 0) -
          (statusOrder[b.status as keyof typeof statusOrder] || 0)
        );
      },
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

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewOrder(record)}
            className="p-0 h-auto"
          >
            View
          </Button>
          <Button
            type="link"
            icon={<DownloadIcon size={18} />}
            loading={downloadingId === record.id}
            onClick={() => handleDownloadInvoice(record)}
            className="p-0 h-auto"
          >
            {downloadingId === record.id ? "Downloading..." : "Invoice"}
          </Button>
        </Space>
      ),
    },
  ];

  const exportToExcel = async () => {
    try {
      const exportData = filteredOrders.map((order: any) => ({
        Date: new Date(order.created_at).toLocaleDateString(),
        "Order ID": `QO${order.id}`,
        Customer: order.customer?.name || "N/A",
        Vendor: order.vendor?.business_name || order.vendor?.name || "N/A",
        Amount: `₹${parseFloat(order.final_amount || 0).toFixed(2)}`,
        "Platform Fee": `₹${parseFloat(order.platform_fee || 0).toFixed(2)}`,
        Tax: `₹${parseFloat(order.tax || 0).toFixed(2)}`,
        Status: order.status?.toUpperCase() || "N/A",
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      const colWidths = exportData[0]
        ? Object.keys(exportData[0]).map(() => ({ wch: 15 }))
        : [];
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Orders");

      const today = new Date().toISOString().split("T")[0];
      const fileName = `Orders_${today}.xlsx`;

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), fileName);

      toast.success("Orders exported successfully!");
    } catch (error) {
      toast.error("Failed to export orders");
    }
  };

  return (

    <div>
      <PageBreadcrumb pageTitle="Orders History" />

      <Row gutter={[16, 16]} className="mb-4" align="middle">
        {/* Search Input */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input.Search
            placeholder="Search by QO_ID, customer, vendor, amount, status..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={setSearchText}
            enterButton
          />
        </Col>
        <Col xs={24} sm={12} md={4} lg={4}>
          <button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 border-green-600 text-white flex items-center py-2 px-4 rounded-md gap-2 font-semibold"
          >
            <FileSpreadsheet size={20} className="text-white" /> Export Excel
          </button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
        loading={isFetching}
        scroll={{ x: "max-content" }}
        pagination={{
          pageSizeOptions: ["15", "25", "50", "100"],
          showSizeChanger: true,
          defaultPageSize: 15,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} providers`,
        }}
      />


      <Modal
        title={null}
        open={viewModalOpen}
        footer={null}
        onCancel={() => {
          setViewModalOpen(false);
          setSelectedOrder(null);
        }}
        width={1200}
        zIndex={10000}
      >
        <OrderDetailsModal
          order={selectedOrder}
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Orders;
