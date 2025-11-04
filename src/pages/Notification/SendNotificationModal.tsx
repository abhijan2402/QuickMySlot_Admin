import React, { useState } from "react";
import { Modal, Input, DatePicker, Select, Table, message, Tabs } from "antd";
import moment from "moment";
import { useGetUsersQuery } from "../../redux/api/UserApi";
import { useGetprovidersQuery } from "../../redux/api/providerApi";
import { useSendNotificationMutation } from "../../redux/api/notificationApi";
import { toast } from "react-toastify";

const { Option } = Select;
const { TabPane } = Tabs;

const SendNotificationModal = ({ visible, onCancel, onSend }) => {
  const { data: customersData, isLoading: loadingCustomers } =
    useGetUsersQuery();
  const { data: providersData, isLoading: loadingProviders } =
    useGetprovidersQuery();

  const [sendNotification] = useSendNotificationMutation();

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    time: null,
    audienceType: "all",
  });

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("customers");

  // ✅ Separate selection states for each tab
  const [selectedCustomerKeys, setSelectedCustomerKeys] = useState([]);
  const [selectedProviderKeys, setSelectedProviderKeys] = useState([]);

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
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

    if (formValues.audienceType !== "all") {
      selectedIds.forEach((id, index) => {
        formData.append(`user_ids[${index}]`, id);
      });
    }

    // if (formValues.time) {
    //   formData.append("time", formValues.time.toISOString());
    // }

    try {
      //   console.log(
      //     "Notification FormData:",
      //     Object.fromEntries(formData.entries())
      //   );
      const res = await sendNotification(formData);
      console.log(res);
      toast.success("Notification sent successfully!");

      // Reset state
      setSelectedCustomerKeys([]);
      setSelectedProviderKeys([]);
      onCancel();
    } catch (error) {
      console.error("Error sending notification:", error);
      message.error("Failed to send notification!");
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
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

  const getFilteredData = (list) => {
    if (!list) return [];
    if (!search) return list;
    return list.filter((u) =>
      u.name?.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <Modal
      title="Send Notification"
      open={visible}
      onCancel={onCancel}
      onOk={handleSend}
      width={900}
      okText="Send"
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
      {/* 
      
      
      <DatePicker
        showTime
        placeholder="Select time (optional)"
        value={formValues.time}
        onChange={(value) => handleChange("time", value)}
        style={{ width: "100%", marginBottom: 12 }}
      />
      */}

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ marginBottom: 12 }}
          />

          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            {/* CUSTOMERS TAB */}
            <TabPane tab="Customers" key="customers">
              <Table
                rowKey={(record: any, index) =>
                  `customer_${record.id || index}`
                } // ✅ ensures unique key
                columns={columns}
                dataSource={getFilteredData(customersData?.data)}
                loading={loadingCustomers}
                pagination={{ pageSize: 5 }}
                scroll={{ y: 240 }}
                rowSelection={{
                  selectedRowKeys: selectedCustomerKeys,
                  onChange: (keys) => {
                    console.log("Selected customer keys:", keys); // debug
                    setSelectedCustomerKeys(keys);
                  },
                  preserveSelectedRowKeys: true, // ✅ keeps selection stable
                }}
              />
            </TabPane>

            {/* PROVIDERS TAB */}
            <TabPane tab="Providers" key="providers">
              <Table
                rowKey={(record: any, index) =>
                  `provider_${record.id || index}`
                }
                columns={columns}
                dataSource={getFilteredData(providersData?.response)}
                loading={loadingProviders}
                pagination={{ pageSize: 5 }}
                scroll={{ y: 240 }}
                rowSelection={{
                  selectedRowKeys: selectedProviderKeys,
                  onChange: (keys) => {
                    console.log("Selected provider keys:", keys);
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
