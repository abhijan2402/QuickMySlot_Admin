import React, { useState } from "react";
import { Button, Table, Space, Popconfirm, message, Pagination } from "antd";
import moment from "moment";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SendNotificationModal from "./SendNotificationModal";
import {
  useDeleteAdMutation,
  useForwardNotificationMutation,
  useGetnotificationQuery,
} from "../../redux/api/notificationApi";
import { formatDate, formatTime } from "../../utils/utils";
import { toast } from "react-toastify";

const NotifyMessages = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);

  // Update query with pagination params
  const { data, isFetching } = useGetnotificationQuery({
    page: currentPage,
    limit: pageSize,
  });

  const [deleteAd] = useDeleteAdMutation();
  const [forwardNotification] = useForwardNotificationMutation();

  const openModal = () => setModalVisible(true);

  const handleNewNotification = async (record) => {
    try {
      const fd = new FormData();
      fd.append("description", record.description);
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

      const res = await forwardNotification({
        formData: fd,
        id: record.id,
      }).unwrap();
      console.log(res);
      toast.success("Notification Send successfully.");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Failed to Send.");
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
      title: "Audience",
      dataIndex: "is_all_users",
      key: "is_all_users",
      render: (all, row) => {
        if (all) return "All Users";

        const users = row.user_ids || [];
        const providers = row.provider_ids || [];
        const combined = [...users, ...providers];

        if (combined.length === 1) {
          return "Single User";
        }

        if (combined.length > 1) {
          return `${combined.length} Users`;
        }

        return "—";
      },
    },
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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Delete this notification?"
            onConfirm={() => deleteNotification(record.id)}
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Send this notification?"
            onConfirm={() => handleNewNotification(record)}
          >
            <Button type="primary" size="small">
              Send
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handle pagination change
  const handlePaginationChange = (page, pageSizeChanged) => {
    setCurrentPage(page);
    if (pageSizeChanged) {
      setPageSize(pageSizeChanged);
      setCurrentPage(1);
    }
  };

  // Get pagination meta from API response
  const total = data?.data.length || 0;
  console.log(total);
  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) =>
      `${range[0]}-${range[1]} of ${total} notifications`,
    onChange: handlePaginationChange,
    onShowSizeChange: handlePaginationChange,
  };

  return (
    <div style={{ padding: 24 }}>
      <PageBreadcrumb pageTitle="Notification History" />
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openModal}>
          Create Notification
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.data || []}
        rowKey="id"
        loading={isFetching}
        pagination={false}
        scroll={{ x: 1000 }}
      />

      {/* Custom Ant Design Pagination */}
      {total > 0 && (
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <Pagination {...paginationConfig} />
        </div>
      )}

      <SendNotificationModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </div>
  );
};

export default NotifyMessages;
