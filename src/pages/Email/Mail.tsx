import React, { useState } from "react";
import {
  Button,
  Table,
  Modal,
  Input,
  Select,
  DatePicker,
  Space,
  Popconfirm,
  message,
  Tabs,
} from "antd";
import moment from "moment";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
  useGetemailQuery,
  useAddemailMutation,
  useDeleteemailMutation,
  useUpdateemailMutation,
  useSendemailMutation,
} from "../../redux/api/emailApi";
import { toast } from "react-toastify";
import { useGetUsersQuery } from "../../redux/api/UserApi";
import { useGetprovidersQuery } from "../../redux/api/providerApi";

const { Option } = Select;
const { TabPane } = Tabs;

const Mail = () => {
  const { data, isFetching } = useGetemailQuery("");
  const [addEmail, { isLoading: isAdding }] = useAddemailMutation();
  const [updateEmail, { isLoading: isUpdating }] = useUpdateemailMutation();
  const [sendEmail, { isLoading: isSending }] = useSendemailMutation();
  const [deleteEmail] = useDeleteemailMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [userSearch, setUserSearch] = useState("");

  const { data: UserList, isLoading: loadingUsers } = useGetUsersQuery({
    search: userSearch,
    page: currentPage,
    per_page: pageSize,
  });
  const { data: providersData, isLoading: loadingProviders } =
    useGetprovidersQuery();

  // UI States
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("customers");

  // Selected IDs for Customers & Providers
  const [selectedCustomerKeys, setSelectedCustomerKeys] = useState<number[]>(
    []
  );
  const [selectedProviderKeys, setSelectedProviderKeys] = useState<number[]>(
    []
  );

  // Form Values
  const [formValues, setFormValues] = useState({
    subject: "",
    message: "",
    title: "",
    scheduled_at: null,
    audienceType: "all",
  });

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const openModal = (edit = null) => {
    if (edit) {
      setFormValues({
        subject: edit.subject,
        message: edit.message,
        title: edit.title,
        scheduled_at: edit.scheduled_at ? moment(edit.scheduled_at) : null,
        audienceType: edit.is_all_users ? "all" : "individual",
      });
      setSelectedCustomerKeys(edit.user_ids || []);
      setSelectedProviderKeys(edit.provider_ids || []);
      setEditId(edit.id);
    } else {
      setFormValues({
        subject: "",
        message: "",
        title: "",
        scheduled_at: null,
        audienceType: "all",
      });
      setSelectedCustomerKeys([]);
      setSelectedProviderKeys([]);
      setEditId(null);
    }
    setActiveTab("customers");
    setModalVisible(true);
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("subject", formValues.subject || formValues.title);
    fd.append("message", formValues.message);
    fd.append("title", formValues.title);
    if (formValues.scheduled_at) {
      fd.append(
        "scheduled_at",
        formValues.scheduled_at.format("YYYY-MM-DD HH:mm:ss")
      );
    }
    fd.append("is_all_users", formValues.audienceType === "all" ? "1" : "0");

    if (formValues.audienceType === "individual") {
      const allUserIds = [...selectedCustomerKeys, ...selectedProviderKeys];
      allUserIds.forEach((id: any, i) => fd.append(`user_ids[${i}]`, id));
    }
    return fd;
  };

  const submitEmailNotification = async () => {
    if (!formValues.title.trim() && !formValues.subject.trim()) {
      toast.error("Title/Subject is required.");
      return;
    }
    if (!formValues.message.trim()) {
      toast.error("Message is required.");
      return;
    }
    if (
      formValues.audienceType === "individual" &&
      selectedCustomerKeys.length === 0 &&
      selectedProviderKeys.length === 0
    ) {
      toast.error("Please select at least one user or provider.");
      return;
    }

    try {
      const fd = buildFormData();
      if (editId) {
        const res = await updateEmail({ formData: fd, id: editId }).unwrap();
        toast.success(res?.message || "Email updated successfully.");
      } else {
        const res = await addEmail({ formData: fd, id: "" }).unwrap();
        toast.success(res?.message || "Email sent successfully.");
      }
      setModalVisible(false);
      setEditId(null);
    } catch (error) {
      toast.error(
        error?.message || "Failed to send/update email notification."
      );
    }
  };

  const handleDeleteEmail = async (id) => {
    try {
      await deleteEmail(id).unwrap();
      toast.success("Deleted successfully.");
    } catch (error) {
      toast.error(error?.message || "Failed to delete.");
    }
  };

  const handleSendEmail = async (record) => {
    try {
      const fd = new FormData();
      fd.append("subject", record.subject || record.title);
      fd.append("description", record.message);
      fd.append("title", record.title);
      if (record.scheduled_at) {
        fd.append(
          "scheduled_at",
          record.scheduled_at.format("YYYY-MM-DD HH:mm:ss")
        );
      }
      fd.append("is_all_users", record.audienceType === "all" ? "1" : "0");

      record.user_ids.forEach((id: any, i: any) =>
        fd.append(`user_ids[${i}]`, id)
      );

      await sendEmail({ formData: fd, id: record.id }).unwrap();
      toast.success("Email Send successfully.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to Send.");
      
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "message", key: "message" },
    {
      title: "Scheduled Time",
      dataIndex: "scheduled_at",
      key: "scheduled_at",
      render: (time) =>
        time ? moment(time).format("YYYY-MM-DD HH:mm") : "Immediate",
    },
    {
      title: "Audience",
      dataIndex: "is_all_users",
      key: "is_all_users",
      render: (all, row) =>
        all
          ? "All Users"
          : [...(row.user_ids || []), ...(row.provider_ids || [])].join(", "),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <Space>
          {/* <Button onClick={() => openModal(row)} type="link">
            Edit
          </Button> */}
          <Button onClick={() => handleSendEmail(row)} type="primary">
            Send Email
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDeleteEmail(row.id)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <PageBreadcrumb pageTitle="Mail History" />

      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => openModal()}
      >
        Create New Email Notification
      </Button>

      <Table
        columns={columns}
        dataSource={data?.data || []}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        loading={isFetching}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editId ? "Edit Email Notification" : "Create Email Notification"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={submitEmailNotification}
        okText={editId ? "Update Email" : "Create Email"}
        confirmLoading={isAdding || isUpdating}
        width={800}
      >
        <Input
          placeholder="Subject"
          value={formValues.subject}
          onChange={(e) => handleInputChange("subject", e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Input
          placeholder="Title"
          value={formValues.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Input.TextArea
          placeholder="Message"
          value={formValues.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          rows={4}
          style={{ marginBottom: 12 }}
        />
        <DatePicker
          showTime
          placeholder="Scheduled Time (optional)"
          value={formValues.scheduled_at}
          onChange={(value) => handleInputChange("scheduled_at", value)}
          style={{ width: "100%", marginBottom: 12 }}
        />
        <Select
          value={formValues.audienceType}
          onChange={(value) => handleInputChange("audienceType", value)}
          style={{ width: "100%", marginBottom: 12 }}
        >
          <Option value="all">All Users</Option>
          <Option value="individual">Individual</Option>
        </Select>

        {formValues.audienceType === "individual" && (
          <>
            <Input.Search
              placeholder="Search user..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              allowClear
              style={{ marginBottom: 12 }}
            />

            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Customers" key="customers">
                <Table
                  rowKey="id"
                  columns={[
                    {
                      title: "Name",
                      dataIndex: "name",
                      render: (text) => text || "--",
                    },
                    {
                      title: "Email",
                      dataIndex: "email",
                      render: (text) => text || "--",
                    },
                  ]}
                  dataSource={UserList?.data?.data || []}
                  loading={loadingUsers}
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
                  scroll={{ y: 240 }}
                  rowSelection={{
                    selectedRowKeys: selectedCustomerKeys,
                    onChange: (keys: any) => setSelectedCustomerKeys(keys),
                    preserveSelectedRowKeys: true,
                  }}
                />
              </TabPane>

              <TabPane tab="Providers" key="providers">
                <Table
                  rowKey="id"
                  columns={[
                    { title: "Name", dataIndex: "name" },
                    { title: "Email", dataIndex: "email" },
                  ]}
                  dataSource={providersData?.data || []}
                  loading={loadingProviders}
                  pagination={{ pageSize: 5 }}
                  scroll={{ y: 240 }}
                  rowSelection={{
                    selectedRowKeys: selectedProviderKeys,
                    onChange: (keys: any) => setSelectedProviderKeys(keys),
                    preserveSelectedRowKeys: true,
                  }}
                />
              </TabPane>
            </Tabs>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Mail;
