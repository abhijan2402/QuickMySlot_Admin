import React, { useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  InputNumber,
  Tag,
  Row,
  Col,
  Spin,
  Select,
} from "antd";
import { Trash2 } from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useNavigate } from "react-router";
import { useSidebar } from "../../context/SidebarContext";
import {
  useAddproviderCashbackMutation,
  useGetprovidersQuery,
  useUpdateproviderIsHighlightedMutation,
} from "../../redux/api/providerApi";
import { toast } from "react-toastify";

const { Option } = Select;

const ProvidersManagement = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { data: ProviderList, isLoading } = useGetprovidersQuery();
  const [updateproviderIsHighlighted] =
    useUpdateproviderIsHighlightedMutation();
  const [addproviderCashback] = useAddproviderCashbackMutation();

  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isCashbackModalOpen, setIsCashbackModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleHighlight = async (record) => {
    const formdata = new FormData();
    formdata.append(
      "is_highlighted",
      record?.is_highlighted === "1" ? "0" : "1"
    );
    formdata.append("vendor", record?.id);
    await updateproviderIsHighlighted(formdata);
    toast.success("Provider highlight changed successfully.");
  };

  // ✅ Handle Add Cashback
  const handleAddCashback = async () => {
    try {
      const values = await form.validateFields();

      const formdata = new FormData();
      formdata.append("vendor", selectedProvider?.id);
      formdata.append("is_cashback", `${values.cashback}%`);

      await addproviderCashback(formdata).unwrap();

      toast.success("Cashback added successfully!");
      setIsCashbackModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Error adding cashback:", error);
      toast.error("Failed to add cashback. Please try again.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <a
          style={{ color: "#465FFF", cursor: "pointer" }}
          onClick={() => navigate(`/providers-details/${record.id}`)}
        >
          {text || "N/A"}
        </a>
      ),
    },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone_number" },
    { title: "Category", dataIndex: "service_category" },
    { title: "Location Served", dataIndex: "location_area_served" },
    { title: "Tieup Percentage", dataIndex: "is_cashback" },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "volcano"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "IsHighlighted",
      dataIndex: "is_highlighted",
      render: (isHighlighted) =>
        isHighlighted === "1" ? (
          <Tag color="blue">Active</Tag>
        ) : (
          <Tag color="default">Not Active</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Button
            type="primary"
            style={{ whiteSpace: "nowrap", width: "90px" }}
            onClick={() => handleHighlight(record)}
          >
            Highlight
          </Button>

          <Button
            style={{
              whiteSpace: "nowrap",
              width: "90px",
              backgroundColor: "#AB274F",
              color: "#fff",
            }}
            onClick={() => {
              setSelectedProvider(record);
              setIsCashbackModalOpen(true);
            }}
          >
            Tie Up %
          </Button>

          <Popconfirm
            title="Are you sure to delete this provider?"
            onConfirm={() => toast.success("Provider deleted successfully")}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{ backgroundColor: "red", color: "white" }}
              type="link"
              icon={<Trash2 size={16} />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div
      className={`flex-1 transition-all duration-300 ease-in-out ${
        isExpanded || isHovered
          ? "lg:pl-0 lg:w-[1190px]"
          : "lg:pl-[0px] lg:w-[1390px]"
      } ${isMobileOpen ? "ml-0" : ""}`}
    >
      <PageBreadcrumb pageTitle="Providers Management" />

      {isLoading ? (
        <div className="flex justify-center items-center flex-col gap-4 h-[60vh] border">
          <Spin />
          Loading Please Wait....
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={ProviderList?.data}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={{
            pageSizeOptions: ["25", "50", "100"],
            showSizeChanger: true,
            defaultPageSize: 15,
          }}
        />
      )}

      {/* ✅ Cashback Modal */}
      <Modal
        title={`Add Tie up % for ${selectedProvider?.name || ""}`}
        open={isCashbackModalOpen}
        onCancel={() => setIsCashbackModalOpen(false)}
        onOk={handleAddCashback}
        okText="Add"
        zIndex={10000}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="cashback"
            label="Tie up Percentage (%)"
            rules={[
              { required: true, message: "Please enter tie up percent" },
              {
                type: "number",
                min: 1,
                max: 100,
                message: "amount must be between 1% and 100%",
              },
            ]}
          >
            <InputNumber
              min={1}
              max={100}
              formatter={(value) => `${value}%`}
              style={{ width: "100%" }}
              placeholder="Enter tie up percent (1-100)"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProvidersManagement;
