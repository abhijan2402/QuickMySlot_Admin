import React, { useEffect, useMemo, useState } from "react";
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
  TimePicker,
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
import { formatDate, formatTime } from "../../utils/utils";

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
  const [providerPage, setProviderPage] = useState(1);
  const [providerPageSize, setProviderPageSize] = useState(25);
  const [userSearch, setUserSearch] = useState("");

  const [currentPageEmail, setCurrentEmailPage] = useState(1);
  const [pageEmailSize, setPageEmailSize] = useState(10);

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
  const [selectedCustomerKeys, setSelectedCustomerKeys] = useState([]);
  const [selectedProviderKeys, setSelectedProviderKeys] = useState([]);

  // Form Values
  const [formValues, setFormValues] = useState({
    subject: "",
    message: "",
    title: "",
    schedule_date: null, // Date only
    scheduled_time: null, // Time only
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
        schedule_date: edit.schedule_date ? moment(edit.schedule_date) : null,
        scheduled_time: edit.scheduled_time ? moment(edit.scheduled_time) : null,
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
        schedule_date: null,
        scheduled_time: null,
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
    // if (formValues.scheduled_at) {
    //   fd.append(
    //     "scheduled_at",
    //     formValues.scheduled_at.format("YYYY-MM-DD HH:mm:ss")
    //   );
    // }
    if (formValues.schedule_date) {
      fd.append("schedule_date", formValues.schedule_date.format("YYYY-MM-DD"));
    }
    if (formValues.scheduled_time) {
      fd.append("scheduled_time", formValues.scheduled_time.format("HH:mm:ss"));
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

      if (record.user_ids) {
        record.user_ids.forEach((id: any, i: any) =>
          fd.append(`user_ids[${i}]`, id)
        );
      }

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
      title: "Schedule At",
      key: "schedule_info",
      render: (record) => {
        if (record.schedule_date || record.scheduled_time) {
          const date = record.schedule_date
            ? formatDate(record.schedule_date)
            : "N/A";
          const time = record.scheduled_time
            ? formatTime(record.scheduled_time)
            : "N/A";
          return `${date} ${time}`;
        }

        return record.created_at ? formatDate(record.created_at) : "N/A";
      },
    },
    {
      title: "Audience",
      dataIndex: "is_all_users",
      key: "is_all_users",
      render: (all, row) => {
        if (all) return "All Users";

        const users = row.user_ids || [];
        const providers = row.provider_ids || [];
        const combined = [...users, ...providers];

        if (combined.length === 1) {
          return "Singel User";
        }

        if (combined.length > 1) {
          return combined.join(", ");
        }

        return "—";
      },
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

  const columnsCustomer = [
    {
      title: "Shop Name",
      dataIndex: "business_name",
      render: (t) => <span>{t || "--"}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (t) => <span>{t || "--"}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (t) => <span>{t || "--"}</span>,
    },
  ];

  const filteredProviders = useMemo(() => {
    if (!providersData?.data || !userSearch) return providersData?.data || [];

    const search = userSearch.toLowerCase();

    return providersData.data.filter(
      (provider) =>
        provider?.business_name?.toLowerCase().includes(search) ||
        provider?.name?.toLowerCase().includes(search) ||
        provider?.email?.toLowerCase().includes(search)
    );
  }, [providersData, userSearch]);

  const paginatedProviders = useMemo(() => {
    const start = (providerPage - 1) * providerPageSize;
    const end = start + providerPageSize;
    return filteredProviders.slice(start, end);
  }, [filteredProviders, providerPage, providerPageSize]);

  useEffect(() => {
    setProviderPage(1);
  }, [userSearch]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setUserSearch("");
  };

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
        pagination={{
          current: currentPageEmail,
          pageSize: pageEmailSize,
          total: data?.data.length,
          pageSizeOptions: ["25", "50", "100"],
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} email`,
          onChange: (page, size) => {
            setCurrentEmailPage(page);
            setPageEmailSize(size);
          },
          onShowSizeChange: (current, size) => {
            setCurrentEmailPage(1);
            setPageEmailSize(size);
          },
        }}
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
          placeholder="Scheduled Date (optional)"
          value={formValues.schedule_date}
          onChange={(value) => handleInputChange("schedule_date", value)}
          disabledDate={(current) => {
            return current && current < moment().startOf("day");
          }}
          style={{ width: "100%", marginBottom: 12 }}
        />
        <TimePicker
          placeholder="Scheduled Time (optional)"
          value={formValues.scheduled_time}
          format="HH:mm:ss"
          onChange={(value) => handleInputChange("scheduled_time", value)}
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

            <Tabs activeKey={activeTab} onChange={handleTabChange}>
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
                  rowKey={(record: any, index) =>
                    `provider_${record.id || index}`
                  }
                  columns={columnsCustomer}
                  dataSource={paginatedProviders}
                  loading={loadingProviders}
                  scroll={{ y: 240 }}
                  pagination={{
                    current: providerPage,
                    pageSize: providerPageSize,
                    total: filteredProviders.length,
                    pageSizeOptions: ["25", "50", "100"],
                    showSizeChanger: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} providers`,
                    onChange: (page, size) => {
                      setProviderPage(page);
                      setProviderPageSize(size);
                    },
                    onShowSizeChange: (current, size) => {
                      setProviderPage(1);
                      setProviderPageSize(size);
                    },
                  }}
                  rowSelection={{
                    selectedRowKeys: selectedProviderKeys,
                    onChange: (keys) => {
                      setSelectedProviderKeys(keys);
                    },
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
