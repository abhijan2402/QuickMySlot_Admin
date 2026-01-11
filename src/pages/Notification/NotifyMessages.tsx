import React, { useState } from "react";
import { Button, Table, Space, Popconfirm, message } from "antd";
import moment from "moment";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SendNotificationModal from "./SendNotificationModal";
import {
  useDeleteAdMutation,
  useForwardNotificationMutation,
  useGetnotificationQuery,
} from "../../redux/api/notificationApi";
import { formatDate } from "../../utils/utils";
import { toast } from "react-toastify";

const NotifyMessages = () => {
  const { data, isFetching } = useGetnotificationQuery("");
  const [deleteAd] = useDeleteAdMutation();
  const [forwardNotification] = useForwardNotificationMutation();



  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);

  const handleNewNotification = async (record) => {
    try {
      const fd = new FormData();
      // fd.append("subject", record.subject || record.title);
      fd.append("description", record.description);
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

      await forwardNotification({ formData: fd, id: record.id }).unwrap();
      toast.success("Email Send successfully.");
    } catch (error) {
      toast.error(error?.message || "Failed to Send.");
    }
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
        if (record.user_ids?.length) {
          return <span>{record.user_ids.join(", ")}</span>;
        }
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
          <Popconfirm
            title="Send this notification?"
            onConfirm={() => handleNewNotification(record)}
          >
            <Button type="primary">Send</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <PageBreadcrumb pageTitle="Notification History" />
      <Button type="primary" style={{ marginBottom: 16 }} onClick={openModal}>
        Create Notification
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
      />
    </div>
  );
};

export default NotifyMessages;
