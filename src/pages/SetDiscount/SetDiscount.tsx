import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Popconfirm,
  Card,
  message,
  Input,
} from "antd";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
  useAddDiscountMutation,
  useGetsetDiscountQuery,
  useDeleteAdMutation,
  useUpdateDiscountMutation,
} from "../../redux/api/setDiscount";
import { Delete, Edit, Trash } from "lucide-react";
import { toast } from "react-toastify";

const SetDiscount = () => {
  // API hooks
  const { data, isFetching } = useGetsetDiscountQuery("");
  const [addDiscount, { isLoading: isAdding }] = useAddDiscountMutation();
  const [updateDiscount, { isLoading: isUpdating }] =
    useUpdateDiscountMutation();
  const [deleteDiscount, { isLoading: isDeleting }] = useDeleteAdMutation();

  // State
  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);

  // Forms
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Handlers for Add Modal
  const showAddModal = () => setIsAddModal(true);
  const handleAddOk = async () => {
    try {
      const values = await addForm.validateFields();
      const payload = {
        min_amount: values.min,
        max_amount: values.max,
        cashback_amount: values.discount,
      };
      await addDiscount(payload).unwrap();
      toast.success("Discount range added successfully!");
      addForm.resetFields();
      setIsAddModal(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add discount.");
    }
  };
  const handleAddCancel = () => {
    addForm.resetFields();
    setIsAddModal(false);
  };

  // Handlers for Edit Modal
  const showEditModal = (record) => {
    setCurrentEdit(record);
    editForm.setFieldsValue({
      min: record.min_amount,
      max: record.max_amount,
      discount: record.cashback_amount,
    });
    setIsEditModal(true);
  };
  const handleEditOk = async () => {
    try {
      const values = await editForm.validateFields();
      const payload = {
        body: {
          min_amount: values.min,
          max_amount: values.max,
          cashback_amount: values.discount,
        },
        id: currentEdit.id,
      };
      await updateDiscount(payload).unwrap();
      toast.success("Discount updated successfully!");
      setIsEditModal(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update discount.");
    }
  };
  const handleEditCancel = () => setIsEditModal(false);

  // Delete handler
  const handleDelete = async (id) => {
    try {
      await deleteDiscount({ id }).unwrap();
      toast.success("Discount deleted successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete discount.");
    }
  };

  // Table columns
  const columns = [
    { title: "Min Price", dataIndex: "min_amount", key: "min" },
    { title: "Max Price", dataIndex: "max_amount", key: "max" },
    {
      title: "Discount (Fixed Amount)",
      dataIndex: "cashback_amount",
      key: "discount",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            icon={<Edit size={14} />}
            size="small"
            style={{
              borderRadius: "6px",
              background: "linear-gradient(90deg, #1677ff 0%, #4096ff 100%)",
              border: "none",
            }}
            onClick={() => showEditModal(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this discount?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              type="primary"
              danger
              icon={<Trash size={14} />}
              size="small"
              style={{
                borderRadius: "6px",
                background: "linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%)",
                border: "none",
              }}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div
    // className={`flex-1 transition-all duration-300 ease-in-out ${
    //   isExpanded || isHovered
    //     ? "lg:pl-0 lg:w-[1190px]"
    //     : "lg:pl-[0px] lg:w-[1390px]"
    // } ${isMobileOpen ? "ml-0" : ""}`}
    >
      <PageBreadcrumb pageTitle="Set Discount Fixed Amount" />
      <Card style={{ marginTop: 24 }}>
        <Button type="primary" onClick={showAddModal}>
          Add Discount Range
        </Button>
        <Table
          dataSource={data?.data || []}
          columns={columns}
          rowKey="id"
          style={{ marginTop: 16 }}
          pagination={false}
          loading={isFetching}
        />
      </Card>

      {/* Add Modal */}
      <Modal
        title="Add Discount Range"
        open={isAddModal}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
        okText="Add"
        confirmLoading={isAdding}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="min"
            label="Min Price"
            rules={[
              { required: true, message: "Enter min price" },
              {
                validator: (_, value) =>
                  value === "" || /^\d+$/.test(value)
                    ? Promise.resolve()
                    : Promise.reject("Enter integers only"),
              },
            ]}
          >
            <Input
              type="text"
              style={{ width: "100%" }}
              placeholder="Enter integer (e.g. 50)"
              maxLength={10}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                // Also clean any pasted content
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
          </Form.Item>

          <Form.Item
            name="max"
            label="Max Price"
            rules={[
              { required: true, message: "Enter max price" },
              {
                validator: (_, value) =>
                  value === "" || /^\d+$/.test(value)
                    ? Promise.resolve()
                    : Promise.reject("Enter integers only"),
              },
            ]}
          >
            <Input
              type="text"
              style={{ width: "100%" }}
              placeholder="Enter integer (e.g. 1000)"
              maxLength={10}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
          </Form.Item>

          <Form.Item
            name="discount"
            label="Discount (Fixed Amount)"
            rules={[
              { required: true, message: "Enter discount" },
              {
                validator: (_, value) =>
                  value === "" || /^\d+$/.test(value)
                    ? Promise.resolve()
                    : Promise.reject("Enter integers only"),
              },
            ]}
          >
            <Input
              type="text"
              style={{ width: "100%" }}
              placeholder="Enter integer (e.g. 50)"
              maxLength={10}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Discount Range"
        open={isEditModal}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Update"
        confirmLoading={isUpdating}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="min"
            label="Min Price"
            rules={[
              { required: true, message: "Enter min price" },
              {
                validator: (_, value) =>
                  value === "" || /^\d+$/.test(value)
                    ? Promise.resolve()
                    : Promise.reject("Enter integers only"),
              },
            ]}
          >
            <Input
              type="text"
              style={{ width: "100%" }}
              placeholder="Enter integer (e.g. 100)"
              maxLength={10}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
          </Form.Item>

          <Form.Item
            name="max"
            label="Max Price"
            rules={[
              { required: true, message: "Enter max price" },
              {
                validator: (_, value) =>
                  value === "" || /^\d+$/.test(value)
                    ? Promise.resolve()
                    : Promise.reject("Enter integers only"),
              },
            ]}
          >
            <Input
              type="text"
              style={{ width: "100%" }}
              placeholder="Enter integer (e.g. 1000)"
              maxLength={10}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
          </Form.Item>

          <Form.Item
            name="discount"
            label="Discount (Fixed Amount)"
            rules={[
              { required: true, message: "Enter discount" },
              {
                validator: (_, value) =>
                  value === "" || /^\d+$/.test(value)
                    ? Promise.resolve()
                    : Promise.reject("Enter integers only"),
              },
            ]}
          >
            <Input
              type="text"
              style={{ width: "100%" }}
              placeholder="Enter integer (e.g. 50)"
              maxLength={10}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SetDiscount;
