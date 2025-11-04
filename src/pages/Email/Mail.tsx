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
} from "antd";
import moment from "moment";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const { Option } = Select;

const dummyUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com" },
  { id: 2, name: "Bob Smith", email: "bob@example.com" },
  { id: 3, name: "Charlie Davis", email: "charlie@example.com" },
  { id: 4, name: "Diana Evans", email: "diana@example.com" },
];

const Mail = () => {
  // Email notifications sent history
  const [emailHistory, setEmailHistory] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    time: null,
    audienceType: "all",
    selectedUsers: [],
  });

  const openModal = () => {
    setFormValues({
      title: "",
      description: "",
      time: null,
      audienceType: "all",
      selectedUsers: [],
    });
    setModalVisible(true);
  };

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  // Simulate send email function (replace this with your real email API call)
  const sendEmail = async (email, subject, body) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Email sent to ${email} with subject "${subject}"`);
        resolve(true);
      }, 500);
    });
  };

  const submitEmailNotification = async () => {
    if (!formValues.title.trim() || !formValues.description.trim()) {
      message.error("Title and description are required.");
      return;
    }

    if (
      formValues.audienceType === "individual" &&
      formValues.selectedUsers.length === 0
    ) {
      message.error("Please select at least one user.");
      return;
    }

    // Determine recipient emails
    const recipients =
      formValues.audienceType === "all"
        ? dummyUsers.map((u) => u.email)
        : dummyUsers
            .filter((u) => formValues.selectedUsers.includes(u.id))
            .map((u) => u.email);

    try {
      // Optionally support scheduling for future, here immediate send simulation
      for (const email of recipients) {
        await sendEmail(email, formValues.title, formValues.description);
      }

      // Record the sent email notification to history
      setEmailHistory((prev) => [
        {
          id: Date.now(),
          title: formValues.title,
          description: formValues.description,
          time: formValues.time || moment(),
          audience:
            formValues.audienceType === "all"
              ? "All Users"
              : dummyUsers
                  .filter((u) => formValues.selectedUsers.includes(u.id))
                  .map((u) => u.name)
                  .join(", "),
        },
        ...prev,
      ]);

      message.success("Email notification sent successfully.");
      setModalVisible(false);
    } catch (error) {
      message.error("Failed to send email notification.");
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Sent Time",
      dataIndex: "time",
      key: "time",
      render: (time) => moment(time).format("YYYY-MM-DD HH:mm"),
    },
    { title: "Audience", dataIndex: "audience", key: "audience" },
  ];

  return (
    <div style={{ padding: 24 }}>
      <PageBreadcrumb pageTitle="Mail History" />

      <Button type="primary" style={{ marginBottom: 16 }} onClick={openModal}>
        Send New Email Notification
      </Button>

      <Table
        columns={columns}
        dataSource={emailHistory}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title="Send Email Notification"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={submitEmailNotification}
        okText="Send Email"
      >
        <Input
          placeholder="Title"
          value={formValues.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Input.TextArea
          placeholder="Description"
          value={formValues.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={4}
          style={{ marginBottom: 12 }}
        />
        <DatePicker
          showTime
          placeholder="Select time (optional, immediate send if not set)"
          value={formValues.time}
          onChange={(value) => handleInputChange("time", value)}
          style={{ width: "100%", marginBottom: 12 }}
        />

        <Select
          value={formValues.audienceType}
          onChange={(value) => handleInputChange("audienceType", value)}
          style={{ width: "100%", marginBottom: 12 }}
        >
          <Select.Option value="all">All Users</Select.Option>
          <Select.Option value="individual">Individual User(s)</Select.Option>
        </Select>

        {formValues.audienceType === "individual" && (
          <Select
            mode="multiple"
            showSearch
            placeholder="Select user(s)"
            optionFilterProp="children"
            value={formValues.selectedUsers}
            onChange={(value) => handleInputChange("selectedUsers", value)}
            filterOption={(input, option: any) => {
              const label = option?.children;
              if (typeof label === "string") {
                return label.toLowerCase().includes(input.toLowerCase());
              }
              return false;
            }}
            style={{ width: "100%" }}
          >
            {dummyUsers.map((user) => (
              <Select.Option key={user.id} value={user.id}>
                {user.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Modal>
    </div>
  );
};

export default Mail;
