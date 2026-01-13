import React, { useState, useMemo } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Row,
  Col,
  Spin,
} from "antd";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Trash2, FileSpreadsheet, EyeIcon } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} from "../../redux/api/UserApi";
import { toast } from "react-toastify";
import UserDetailsModal from "./UserDetailsModal";
import { formatDate } from "../../utils/utils";

const { Option } = Select;

const CustomerManagement = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    data: UserList,
    isLoading,
    error,
  } = useGetUsersQuery({
    search: searchText,
    page: currentPage,
    per_page: pageSize,
  });

  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleViewDetails = (record) => {
    setSelectedUser(record);
    setViewModalOpen(true);
  };

  const exportToExcel = () => {
    try {
      const users = UserList?.data?.data || [];

      const exportData = users.map((user: any) => ({
        "Customer ID": `QC${user.id}`,
        Name: user.name || "N/A",
        Email: user.email || "N/A",
        Phone: user.phone_number || "N/A",
        Role: (() => {
          switch (user.user_role_id) {
            case 1:
              return "Admin";
            case 2:
              return "User";
            case 3:
              return "Vendor";
            default:
              return "Unknown";
          }
        })(),
        Status: user.is_active ? "Active" : "Inactive",
        "Created At": user.created_at
          ? new Date(user.created_at).toLocaleDateString()
          : "N/A",
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Auto-fit columns
      ws["!cols"] = exportData[0]
        ? Object.keys(exportData[0]).map(() => ({ wch: 18 }))
        : [];

      XLSX.utils.book_append_sheet(wb, ws, "Customers");

      const today = new Date().toISOString().split("T")[0];
      const fileName = `Customers_${today}.xlsx`;

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), fileName);

      toast.success("Customers exported successfully!");
    } catch (error) {
      toast.error("Failed to export customers");
    }
  };

  const handleDelete = async (id: any) => {
    await deleteUser(id).unwrap();
    toast.success("User deleted successfully");
  };

  const handleToggleStatus = async (id: any) => {
    await updateUserStatus(id).unwrap();
    toast.success("User status updated");
  };

  const handleAddUser = () => {
    form.validateFields().then((values) => {
      message.success("User added successfully");
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const columns = [
    {
      title: "Customer ID",
      dataIndex: "id",
      render: (id: string) => `QC${id}`,
    },

    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      render: (text, record) => text || "N/A",
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => text || "N/A",
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      render: (text) => text || "N/A",
    },
    {
      title: "Profile",
      dataIndex: "image",
      render: (url) =>
        url ? (
          <img
            src={url}
            alt="profile"
            style={{ width: 40, borderRadius: "10%", height: 50 }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Role",
      dataIndex: "user_role_id",
      render: (roleId) => {
        switch (roleId) {
          case 1:
            return "Admin";
          case 2:
            return "User";
          case 3:
            return "Vendor";
          default:
            return "Unknown";
        }
      },
    },
    {
      title: "Status",
      dataIndex: "is_active",
      filters: [
        { text: "Active", value: 1 },
        { text: "Inactive", value: 0 },
      ],
      onFilter: (value, record) => record.is_active === value,
      render: (isActive) => (
        <Tag color={isActive ? "green" : "volcano"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    // {
    //   title: "Verified",
    //   dataIndex: "is_verified",
    //   render: (verified) => (
    //     <Tag color={verified ? "green" : "orange"}>
    //       {verified ? "Verified" : "Not Verified"}
    //     </Tag>
    //   ),
    // },
    // {
    //   title: "Business Name",
    //   dataIndex: "business_name",
    //   render: (text) => text || "N/A",
    // },
    // {
    //   title: "Category",
    //   dataIndex: "service_category",
    //   render: (text) => text || "N/A",
    // },
    // {
    //   title: "Documents",
    //   dataIndex: "portfolio_images",
    //   render: (imgs) =>
    //     imgs && imgs.length > 0 ? `${imgs.length} Files` : "No Documents",
    // },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (date) => (formatDate(date)|| "N/A"),
    },
    // {
    //   title: "Updated At",
    //   dataIndex: "updated_at",
    //   render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="default"
            style={{
              backgroundColor: record.is_active ? "#E23D28" : "#00A86B",
              color: "white",
              width: "100px",
              whiteSpace: "nowrap",
            }}
            onClick={() => handleToggleStatus(record.id)}
          >
            {record.is_active ? "Deactivate" : "Activate"}
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{ backgroundColor: "red", color: "white", width: "70px" }}
              type="link"
              icon={<Trash2 size={16} />}
            />
          </Popconfirm>
          <Button
            type="link"
            onClick={() => handleViewDetails(record)}
            style={{
              backgroundColor: "#F2F3F4",
              color: "#007FFF",
              padding: "10px 12px",
              width: "50px",
            }}
          >
            <EyeIcon size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Customers Management" />

      {/* Search and Status Filter Row */}
      <Row gutter={[16, 16]} className="mb-4" align="middle">
        <Col xs={24} sm={14} md={12} lg={10} xl={8}>
          <Input.Search
            placeholder="Search by name, email or phone"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            enterButton
            onSearch={(val) => setSearchText(val)}
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

        {/* <Col
          xs={24}
          sm={24}
          md={6}
          lg={5}
          xl={6}
          style={{ textAlign: "right" }}
        >
          <Button
            onClick={() => setIsModalOpen(true)}
            type="primary"
            style={{ backgroundColor: "#465FFF", borderColor: "#465FFF" }}
          >
            + Add User
          </Button>
        </Col> */}
      </Row>

      {isLoading ? (
        <div className="flex justify-center items-center flex-col gap-4 h-[60vh] border">
          <Spin />
          Loading Please Wait....
        </div>
      ) : (
        <>
          {/* Table here */}
          <Table
            columns={columns}
            dataSource={UserList?.data?.data}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: UserList?.data?.total || 0,
              pageSizeOptions: ["25", "50", "100", "150", "200"],
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} users`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              onShowSizeChange: (current, size) => {
                setPageSize(size);
                setCurrentPage(1);
              },
            }}
          />
        </>
      )}

      {/* Details Modal */}
      <Modal
        title={null}
        open={viewModalOpen}
        footer={null}
        onCancel={() => {
          setViewModalOpen(false);
          setSelectedUser(null);
        }}
        width={900}
        zIndex={10000}
      >
        <UserDetailsModal
          user={selectedUser}
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedUser(null);
          }}
        />
      </Modal>

      {/* Add User Modal */}
      <Modal
        title="Add New User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddUser}
        okText="Add"
        zIndex={10000}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please enter phone" },
              {
                pattern: /^[0-9+()\- ]+$/,
                message: "Enter a valid phone number.",
              },
            ]}
          >
            <Input placeholder="Enter phone" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            initialValue="Active"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select status">
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerManagement;
