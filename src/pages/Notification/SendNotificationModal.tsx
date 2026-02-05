import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Input,
  DatePicker,
  Select,
  Table,
  message,
  Tabs,
  TimePicker,
} from "antd";
import moment from "moment";
import { useGetUsersQuery } from "../../redux/api/UserApi";
import { useGetprovidersQuery } from "../../redux/api/providerApi";
import { useSendNotificationMutation } from "../../redux/api/notificationApi";
import { toast } from "react-toastify";

const { Option } = Select;
const { TabPane } = Tabs;

const SendNotificationModal = ({ visible, setModalVisible }) => {
  const [userSearch, setUserSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [providerPage, setProviderPage] = useState(1);
  const [providerPageSize, setProviderPageSize] = useState(25);
  const { data: customersData, isLoading: loadingCustomers } = useGetUsersQuery(
    {
      search: userSearch,
      page: currentPage,
      per_page: pageSize,
    }
  );
  const { data: providersData, isLoading: loadingProviders } =
    useGetprovidersQuery();

  const [sendNotification] = useSendNotificationMutation();

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    schedule_date: null,
    schedule_time: null,
    audienceType: "all",
  });

  const [activeTab, setActiveTab] = useState("customers");

  // ✅ Separate selection states for each tab
  const [selectedCustomerKeys, setSelectedCustomerKeys] = useState([]);
  const [selectedProviderKeys, setSelectedProviderKeys] = useState([]);

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormValues({
      title: "",
      description: "",
      schedule_date: null,
      schedule_time: null,
      audienceType: "all",
    });

    setUserSearch("");
    setActiveTab("customers");

    setSelectedCustomerKeys([]);
    setSelectedProviderKeys([]);

    setCurrentPage(1);
    setPageSize(25);
    setProviderPage(1);
    setProviderPageSize(25);
  };

  const handleSend = async () => {
    if (!formValues.title.trim() || !formValues.description.trim()) {
      message.error("Title and description are required!");
      return;
    }

    const selectedIds = [
      ...selectedCustomerKeys.map((k) => k.replace("customer_", "")),
      ...selectedProviderKeys.map((k) => k.replace("provider_", "")),
    ];

    // Build FormData
    const formData = new FormData();
    formData.append("title", formValues.title);
    formData.append("description", formValues.description);
    formData.append(
      "is_all_users",
      formValues.audienceType === "all" ? "1" : "0"
    );
    if (formValues.schedule_date) {
      formData.append(
        "schedule_date",
        formValues.schedule_date.format("YYYY-MM-DD")
      );
    }
    if (formValues.schedule_time) {
      formData.append(
        "schedule_time",
        formValues.schedule_time.format("HH:mm:ss")
      );
    }

    if (formValues.audienceType !== "all") {
      selectedIds.forEach((id, index) => {
        formData.append(`user_ids[${index}]`, id);
      });
    }

    try {
      const res = await sendNotification(formData).unwrap();
      toast.success("Notification created successfully!");
      setSelectedCustomerKeys([]);
      resetForm();
      onCancel();
    } catch (error) {
      // Display most detailed error message possible

      // Api error object may be nested
      let errMsg;
      if (error?.data?.message) {
        if (Array.isArray(error.data.message)) {
          // Join multiple messages if array
          errMsg = error.data.message
            .map((msg) =>
              typeof msg === "string"
                ? msg
                : `${msg.field ? msg.field + ": " : ""}${msg.message}`
            )
            .join(" | ");
        } else if (typeof error.data.message === "string") {
          errMsg = error.data.message;
        } else {
          errMsg = JSON.stringify(error.data.message);
        }
      } else if (error?.data?.error) {
        errMsg =
          typeof error.data.error === "string"
            ? error.data.error
            : JSON.stringify(error.data.error);
      } else if (error?.message) {
        errMsg = error.message;
      } else {
        errMsg = "Failed to create notification!";
      }

      toast.error(errMsg);
    }
  };

  const onCancel = () => {
    setModalVisible(false);
    resetForm();
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setUserSearch("");
  };

  const columns = [
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

  // const getFilteredData = (list) => {
  //   if (!list) return [];
  //   if (!search) return list;
  //   return list.filter((u) =>
  //     u.name?.toLowerCase().includes(search.toLowerCase())
  //   );
  // };

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

  return (
    <Modal
      title="Create Notification"
      open={visible}
      onCancel={onCancel}
      onOk={handleSend}
      width={900}
      okText="Create"
    >
      {/* Form Fields */}
      <Input
        placeholder="Title"
        value={formValues.title}
        onChange={(e) => handleChange("title", e.target.value)}
        style={{ marginBottom: 12 }}
      />
      <Input.TextArea
        placeholder="Description"
        value={formValues.description}
        onChange={(e) => handleChange("description", e.target.value)}
        rows={3}
        style={{ marginBottom: 12 }}
      />

      <DatePicker
        showTime
        placeholder="Select time (optional)"
        value={formValues.schedule_date}
        onChange={(value) => handleChange("schedule_date", value)}
        style={{ width: "100%", marginBottom: 12 }}
      />
      <TimePicker
        placeholder="Scheduled Time (optional)"
        value={formValues.schedule_time}
        format="HH:mm:ss"
        onChange={(value) => handleChange("schedule_time", value)}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <Select
        value={formValues.audienceType}
        onChange={(value) => handleChange("audienceType", value)}
        style={{ width: "100%", marginBottom: 12 }}
      >
        <Option value="all">All Users</Option>
        <Option value="individual">Individual Users</Option>
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
            {/* CUSTOMERS TAB */}
            <TabPane tab="Customers" key="customers">
              <Table
                rowKey={(record: any, index) =>
                  `customer_${record.id || index}`
                }
                columns={columns}
                dataSource={customersData?.data?.data}
                loading={loadingCustomers}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: customersData?.data?.total || 0,
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
                  onChange: (keys) => {
                    setSelectedCustomerKeys(keys);
                  },
                  preserveSelectedRowKeys: true,
                }}
              />
            </TabPane>

            {/* PROVIDERS TAB */}
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
  );
};

export default SendNotificationModal;
