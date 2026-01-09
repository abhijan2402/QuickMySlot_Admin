import React, { useMemo, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Modal,
  Form,
  InputNumber,
  Tag,
  Row,
  Col,
  Spin,
  Select,
  Input,
} from "antd";
import { Trash2, FileSpreadsheet, Eye, EyeIcon } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useNavigate } from "react-router";
import {
  useAddproviderCashbackMutation,
  useGetprovidersQuery,
  useUpdateproviderIsHighlightedMutation,
} from "../../redux/api/providerApi";
import { toast } from "react-toastify";
import ProviderDetailsModal from "./ProviderDetailsModal";
import { useGetcategoryQuery } from "../../redux/api/categoryApi";

const { Option } = Select;

const ProvidersManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProviderDetails, setSelectedProviderDetails] =
    useState<any>(null);

  const { data: ProviderList, isLoading } = useGetprovidersQuery();
  const [updateproviderIsHighlighted] =
    useUpdateproviderIsHighlightedMutation();
  const [addproviderCashback] = useAddproviderCashbackMutation();
  const { data: categoryData, isLoading: categoryLoading } =
    useGetcategoryQuery({});

  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isCashbackModalOpen, setIsCashbackModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleViewProvider = (record: any) => {
    setSelectedProviderDetails(record);
    setViewModalOpen(true);
  };

  const getServiceCategoryName = (categoryId: number) => {
    if (categoryLoading || !categoryData?.data) return "Loading...";

    const category = categoryData.data.find(
      (cat: any) => cat.id === categoryId
    );
    return category ? category.name : "--";
  };

  const exportToExcel = () => {
    try {
      const exportData = filteredData.map((provider: any) => ({
        "Provider ID": `QP_${provider.id}`,
        Name: provider.name || "N/A",
        Email: provider.email || "--",
        Phone: provider.phone_number || "--",
        Category: provider.service_category || "--",
        "Shop Name": provider.business_name || "--",
        Location: provider.location_area_served || "--",
        "Tieup %": provider.is_cashback || "--",
        Status: provider.is_active ? "Active" : "Inactive",
        Highlighted: provider.is_highlighted === "1" ? "Active" : "Not Active",
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      ws["!cols"] = exportData[0]
        ? Object.keys(exportData[0]).map(() => ({ wch: 15 }))
        : [];

      XLSX.utils.book_append_sheet(wb, ws, "Providers");

      const today = new Date().toISOString().split("T")[0];
      const fileName = `Providers_${today}.xlsx`;

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), fileName);

      toast.success("Providers exported successfully!");
    } catch (error) {
      toast.error("Failed to export providers");
    }
  };

  const filteredData = useMemo(() => {
    if (!ProviderList?.data || !searchText.trim()) {
      return ProviderList?.data || [];
    }

    const query = searchText.toLowerCase();
    return ProviderList.data.filter(
      (provider: any) =>
        provider.id.toString().toLowerCase().includes(query) ||
        `QP_${provider.id}`.toLowerCase().includes(query) ||
        provider.business_name?.toLowerCase().includes(query) ||
        provider.name?.toLowerCase().includes(query) ||
        provider.email?.toLowerCase().includes(query) ||
        provider.phone_number?.toLowerCase().includes(query)
    );
  }, [ProviderList?.data, searchText]);

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

  // Handle Add Cashback
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
      title: "Provider ID",
      dataIndex: "id",
      render: (id: string) => `QP_${id}`,
    },

    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => text || "N/A",
    },
    { title: "Email", dataIndex: "email", render: (item) => item || "--" },
    {
      title: "Phone",
      dataIndex: "phone_number",
      render: (item) => item || "--",
    },
    {
      title: "Category",
      dataIndex: "service_category",
      render: (item) => getServiceCategoryName(item) || "--",
    },
    {
      title: "Shop Name",
      dataIndex: "business_name",
      render: (item) => item || "--",
    },
    {
      title: "Location Served",
      dataIndex: "location_area_served",
      render: (item) => item || "--",
    },
    {
      title: "Tieup Percentage",
      dataIndex: "is_cashback",
      render: (item) => item || "--",
    },
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
          <Button
            type="link"
            onClick={() => handleViewProvider(record)}
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
      <PageBreadcrumb pageTitle="Providers Management" />

      <Row
        gutter={[16, 16]}
        className="mb-4"
        // justify="space-between"
        align="middle"
      >
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
      </Row>

      {isLoading ? (
        <div className="flex justify-center items-center flex-col gap-4 h-[60vh] border">
          <Spin />
          Loading Please Wait....
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={{
            pageSizeOptions: ["25", "50", "100"],
            showSizeChanger: true,
            defaultPageSize: 15,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} providers`,
          }}
          loading={isLoading}
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

      <Modal
        title={null}
        open={viewModalOpen}
        footer={null}
        onCancel={() => {
          setViewModalOpen(false);
          setSelectedProviderDetails(null);
        }}
        width={900}
        zIndex={10000}
      >
        <ProviderDetailsModal
          provider={selectedProviderDetails}
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedProviderDetails(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ProvidersManagement;
