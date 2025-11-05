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
import {
  useGetemailQuery,
  useAddemailMutation,
  useDeleteemailMutation,
  useUpdateemailMutation,
} from "../../redux/api/emailApi";
import { toast } from "react-toastify";
import { useGetUsersQuery } from "../../redux/api/UserApi";

const { Option } = Select;



const Mail = () => {
  const { data, isFetching } = useGetemailQuery("");

  const [addEmail, { isLoading: isAdding }] = useAddemailMutation();
  const [updateEmail, { isLoading: isUpdating }] = useUpdateemailMutation();
  const [deleteEmail, { isLoading: isDeleting }] = useDeleteemailMutation();

  const [userSearch, setUserSearch] = useState("");

  const { data: UserList, isLoading } = useGetUsersQuery({
    search: userSearch,
  });

  console.log(UserList?.data?.data);

  // Table state/history (replace with API response if needed)
  const [emailHistory, setEmailHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({
    subject: "",
    message: "",
    title: "",
    scheduled_at: null,
    audienceType: "all",
    selectedUsers: [],
  });
  const [editId, setEditId] = useState(null);

 const openModal = (edit = null) => {
   if (edit) {
     console.log("Editing:", edit);
     // Map existing user_ids (array of IDs) to Select format if needed
     const userOptions = (edit.user_ids || []).map((id) => {
       const found = UserList?.data?.data?.find((u) => u.id === id);
       return found
         ? { label: found.name, value: found.id }
         : { label: `User ${id}`, value: id };
     });

     setFormValues({
       subject: edit.subject,
       message: edit.message,
       title: edit.title,
       scheduled_at: edit.scheduled_at ? moment(edit.scheduled_at) : null,
       audienceType: edit.is_all_users === true ? "all" : "individual",
       selectedUsers: userOptions, // ✅ use objects instead of IDs
     });
     setEditId(edit.id || edit._id);
   } else {
     setFormValues({
       subject: "",
       message: "",
       title: "",
       scheduled_at: null,
       audienceType: "all",
       selectedUsers: [],
     });
     setEditId(null);
   }
   setModalVisible(true);
 };


  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  // FormData builder function per backend format
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
    // ✅ Extract only IDs
    formValues.selectedUsers.forEach((u, idx) => {
      const userId = typeof u === "object" ? u.value : u;
      fd.append(`user_ids[${idx}]`, userId);
    });
  }

  return fd;
};


  // ADD email notification
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
      formValues.selectedUsers.length === 0
    ) {
      toast.error("Please select at least one user.");
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

  // DELETE
  const handleDeleteEmail = async (id) => {
    try {
      await deleteEmail(id).unwrap();
      message.success("Deleted successfully.");
      // Refresh table if needed
    } catch (error) {
      message.error(error?.message || "Failed to delete.");
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
        all === true
          ? "All Users"
          : row.user_ids
          ? row.user_ids.join(", ")
          : "",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <Space>
          <Button onClick={() => openModal(row)} type="link">
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDeleteEmail(row.id)}
          >
            <Button type="link" danger>
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
        Send New Email Notification
      </Button>

      <Table
        columns={columns}
        dataSource={data?.data || emailHistory}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1000 }}
        loading={isFetching}
      />

      <Modal
        title={editId ? "Edit Email Notification" : "Send Email Notification"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={submitEmailNotification}
        okText={editId ? "Update Email" : "Send Email"}
        confirmLoading={isAdding || isUpdating}
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
          <Option value="individual">Individual User(s)</Option>
        </Select>
        {formValues.audienceType === "individual" && (
          <>
            <Input
              placeholder="Search users by name"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <Select
              mode="multiple"
              labelInValue={true} // ✅ allows showing names with values
              placeholder="Select user(s)"
              value={formValues.selectedUsers}
              onChange={(value) => handleInputChange("selectedUsers", value)}
              style={{ width: "100%" }}
              loading={isLoading}
            >
              {UserList?.data?.data.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Mail;
