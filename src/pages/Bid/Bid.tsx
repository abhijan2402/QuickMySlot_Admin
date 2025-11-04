import React, { useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Spin,
  Tooltip,
  Select,
} from "antd";
import dayjs from "dayjs";
import {
  useGetbidQuery,
  useAddBidMutation,
  useUpdateBidMutation,
  useDeleteBidMutation,
  useBidApprovedMutation,
  useBidRejectMutation,
  useGetbidDetailsQuery,
  useGetbidEntryListQuery,
} from "../../redux/api/bidApi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useSidebar } from "../../context/SidebarContext";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "../../utils/utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useGetcategoryQuery } from "../../redux/api/categoryApi";

const Bid = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const navigate = useNavigate();

  const { data: category } = useGetcategoryQuery("");
  console.log(category?.data);
  const { data, isLoading, refetch } = useGetbidQuery("");
  // const { data: bidDetals, isLoading: detailLoading } =
  //   useGetbidDetailsQuery(1);
  // const { data: bidEntry, isLoading: BitEntrydetailLoading } =
  //   useGetbidEntryListQuery(2);
  // console.log(bidEntry);
  const [addBid] = useAddBidMutation();
  const [updateBid] = useUpdateBidMutation();
  const [deleteBid] = useDeleteBidMutation();
  const [approveBid] = useBidApprovedMutation();
  const [rejectBid] = useBidRejectMutation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBid, setEditingBid] = useState(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingBid(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingBid(record);
    form.setFieldsValue({
      ...record,
      bid_date: dayjs(record.bid_date),
      bid_end_date: dayjs(record.bid_end_date),
      start_time: dayjs(record.start_time, "HH:mm"),
      end_time: dayjs(record.end_time, "HH:mm"),
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      for (const key in values) {
        if (dayjs.isDayjs(values[key])) {
          // Format date/time fields
          if (key.includes("time"))
            formData.append(key, values[key].format("HH:mm"));
          else formData.append(key, values[key].format("YYYY-MM-DD"));
        } else {
          formData.append(key, values[key]);
        }
      }

      if (editingBid) {
        await updateBid({
          formData,
          id: editingBid.id || editingBid._id,
        }).unwrap();
        toast.success("Bid updated successfully");
      } else {
        await addBid(formData).unwrap();
        toast.success("Bid added successfully");
      }
      setIsModalVisible(false);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBid(id).unwrap();
      toast.success("Bid deleted");
      refetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveBid(id).unwrap();
      toast.success("Bid approved");
      refetch();
    } catch {
      toast.error("Approval failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectBid(id).unwrap();
      toast.success("Bid rejected");
      refetch();
    } catch {
      toast.error("Rejection failed");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <span
          className="text-blue-600 cursor-pointer hover:underline"
          onClick={() =>
            navigate(`/bid-details/${record.id}/${record?.category?.name}`)
          }
        >
          {text}
        </span>
      ),
    },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Bid Date",
      dataIndex: "bid_date",
      key: "bid_date",
      render: (text) => <span>{formatDate(text)}</span>,
    },
    {
      title: "Bid End Date",
      dataIndex: "bid_end_date",
      key: "bid_end_date",
      render: (text) => <span>{formatDate(text)}</span>,
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
      render: (time) => (time ? time.slice(0, 5) : "-"),
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
      render: (time) => (time ? time.slice(0, 5) : "-"),
    },
    { title: "Bid Category", dataIndex: ["category", "name"], key: "category" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {/* Edit */}
          <Tooltip title="Edit Bid">
            <Button
              size="small"
              className="!bg-blue-600 hover:!bg-blue-700 !text-white flex items-center justify-center !rounded-md shadow-sm"
              icon={<Pencil size={16} />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          {/* Delete */}
          <Popconfirm
            title="Are you sure you want to delete this bid?"
            onConfirm={() => handleDelete(record.id || record._id)}
          >
            <Tooltip title="Delete Bid">
              <Button
                size="small"
                className="!bg-red-600 hover:!bg-red-700 !text-white flex items-center justify-center !rounded-md shadow-sm"
                icon={<Trash2 size={16} />}
              />
            </Tooltip>
          </Popconfirm>

          {/* Approve */}
          {/* <Tooltip title="Approve Bid">
            <Button
              size="small"
              className="!bg-green-600 hover:!bg-green-700 !text-white flex items-center justify-center !rounded-md shadow-sm"
              icon={<CheckCircle size={16} />}
              onClick={() => handleApprove(record.id || record._id)}
            />
          </Tooltip> */}

          {/* Reject */}
          {/* <Tooltip title="Reject Bid">
            <Button
              size="small"
              className="!bg-gray-500 hover:!bg-gray-600 !text-white flex items-center justify-center !rounded-md shadow-sm"
              icon={<XCircle size={16} />}
              onClick={() => handleReject(record.id || record._id)}
            />
          </Tooltip> */}
        </div>
      ),
    },
  ];

  return (
    <div
      className={`flex-1 transition-all duration-300 ease-in-out ${
        isExpanded || isHovered
          ? "lg:pl-0 lg:w-[1190px]"
          : "lg:pl-[0px] lg:w-[1390px]"
      } ${isMobileOpen ? "ml-0" : ""}`}
    >
      <PageBreadcrumb pageTitle="Bid Management" />

      <div className="p-4 bg-white rounded-xl shadow">
        <div className="flex justify-end mb-4">
          <Button type="primary" onClick={handleAdd}>
            Add Bid
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={data?.data?.data || []}
            rowKey={(record) => record.id || record._id}
            scroll={{ x: "max-content" }}
            pagination={{
              pageSizeOptions: ["5", "10", "15"],
              showSizeChanger: true,
              defaultPageSize: 5,
            }}
          />
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        title={editingBid ? "Update Bid" : "Add Bid"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText={editingBid ? "Update" : "Save"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Category"
            name="category_id"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select placeholder="Select category">
              {category?.data?.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input placeholder="Enter title" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
          <Form.Item
            label="Bid Start Date"
            name="bid_date"
            rules={[{ required: true, message: "Please select start date" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            label="Bid End Date"
            name="bid_end_date"
            rules={[{ required: true, message: "Please select end date" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            label="Start Time"
            name="start_time"
            rules={[{ required: true, message: "Please select start time" }]}
          >
            <TimePicker format="HH:mm" className="w-full" />
          </Form.Item>
          <Form.Item
            label="End Time"
            name="end_time"
            rules={[{ required: true, message: "Please select end time" }]}
          >
            <TimePicker format="HH:mm" className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Bid;
