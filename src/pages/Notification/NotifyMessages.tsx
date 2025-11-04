import React, { useState } from "react";
import { Button, Table, Space, Popconfirm, message } from "antd";
import moment from "moment";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SendNotificationModal from "./SendNotificationModal";
import {
  useDeleteAdMutation,
  useGetnotificationQuery,
} from "../../redux/api/notificationApi";
import { formatDate } from "../../utils/utils";
import { toast } from "react-toastify";

const NotifyMessages = () => {
  const { data, isFetching } = useGetnotificationQuery("");
  const [deleteAd] = useDeleteAdMutation();
  console.log(data);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "System Update",
      description: "System will be updated at midnight.",
      time: moment().add(1, "day"),
      audience: "All Users",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);

  const handleNewNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    message.success("Notification sent successfully!");
  };

  const deleteNotification = async (id) => {
    await deleteAd(id);
    toast.success("Notification deleted!");
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Is All Users",
      dataIndex: "is_all_users",
      key: "is_all_users",
      render: (isAll, record) => {
        if (isAll) {
          return <span>All Users</span>;
        }
        // Show individual user info, e.g., user_ids or user.name if available
        if (record.user_ids?.length) {
          // If you have access to user details (array of user objects by user_ids), render their names/emails
          return <span>{record.user_ids.join(", ")}</span>;
        }
        // Optionally show main user info if available
        if (record.user && record.user.name) {
          return <span>{record.user.name}</span>;
        }
        return <span>Specific User</span>;
      },
    },

    {
      title: "Time",
      dataIndex: "created_at",
      key: "created_at",
      render: (time) => (time ? formatDate(time) : "N/A"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Delete this notification?"
            onConfirm={() => deleteNotification(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <PageBreadcrumb pageTitle="Notification History" />
      <Button type="primary" style={{ marginBottom: 16 }} onClick={openModal}>
        Send Notification
      </Button>

      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1000 }}
        loading={isFetching}
      />

      <SendNotificationModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSend={handleNewNotification}
      />
    </div>
  );
};

export default NotifyMessages;
