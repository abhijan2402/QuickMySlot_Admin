import React, { useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Spin,
  Row,
  Col,
  Tabs,
} from "antd";
import {
  useGetsubscriptionQuery,
  useAddsubscriptionMutation,
  useUpdatesubscriptionMutation,
  useDeletesubscriptionMutation,
} from "../../redux/api/subscriptionApi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useSidebar } from "../../context/SidebarContext";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TabPane } = Tabs;

const SubscriptionManagement = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const [activeTab, setActiveTab] = useState("customer");
  const [validity, setValidity] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = useGetsubscriptionQuery({
    type: activeTab === "vendor-monthly" ? "vendor" : activeTab,
    validity: activeTab === "vendor-monthly" ? "monthly" : validity,
  });

  const [addSubscription, { isLoading: adding }] = useAddsubscriptionMutation();
  const [updateSubscription, { isLoading: updating }] =
    useUpdatesubscriptionMutation();
  const [deleteSubscription] = useDeletesubscriptionMutation();

  // 🟢 Handle Add
  const handleAdd = () => {
    form.resetFields();
    setEditingSubscription(null);
    setOpenModal(true);
  };

  // 🟡 Handle Edit
  const handleEdit = (record) => {
    setEditingSubscription(record);

    const extraObject = record.extra || {};
    const extrasArray = Object.keys(extraObject)
      .filter((key) => key !== "key_word")
      .map((key) => extraObject[key]);

    form.setFieldsValue({
      subscription_name: record.subscription_name,
      description: record.description,
      price: record.price,
      type: record.type,
      validity: record.validity,
      valid_days: record.valid_days,
      extra: extrasArray,
      key_word: record.extra?.key_word || "",
    });

    setOpenModal(true);
  };

  // 🔴 Handle Delete
  const handleDelete = async (id) => {
    try {
      await deleteSubscription(id).unwrap();
      message.success("Subscription deleted successfully!");
      refetch();
    } catch (error) {
      message.error("Failed to delete subscription.");
    }
  };

  // 🟢 Handle Submit (Add/Update)
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("subscription_name", values.subscription_name);
      formData.append("description", values.description);
      formData.append("price", values.price.toString());
      formData.append("type", values.type);
      formData.append("validity", values.validity);
      formData.append("valid_days", values.valid_days);

      if (values.extra && Array.isArray(values.extra)) {
        values.extra.forEach((item, index) => {
          formData.append(`extra[${index}]`, item);
        });
      }

      if (values.key_word) {
        formData.append("extra[key_word]", values.key_word);
      }

      if (editingSubscription) {
        await updateSubscription({
          formData,
          id: editingSubscription._id || editingSubscription.id,
        }).unwrap();
        message.success("Subscription updated successfully!");
      } else {
        await addSubscription(formData).unwrap();
        message.success("Subscription added successfully!");
      }

      setOpenModal(false);
      setEditingSubscription(null);
      form.resetFields();
      refetch();
    } catch (error) {
      console.error(error);
      message.error("Failed to save subscription. Please try again.");
    }
  };

  return (
    <div
      className={`flex-1 transition-all duration-300 ease-in-out ${
        isExpanded || isHovered
          ? "lg:pl-0 lg:w-[1190px]"
          : "lg:pl-[0px] lg:w-[1390px]"
      } ${isMobileOpen ? "ml-0" : ""}`}
    >
      <PageBreadcrumb pageTitle="Subscription Management" />

      <div className="p-4">
        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            setValidity("");
          }}
          type="card"
        >
          <TabPane tab="Customer Subscriptions" key="customer" />
          <TabPane tab="Vendor Subscriptions" key="vendor" />
          {/* <TabPane tab="Vendor Monthly Validity" key="vendor-monthly" /> */}
        </Tabs>

        {/* Add Button */}
        <div className="mt-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className="bg-[#EE4E34] hover:bg-[#d3452f] mb-4"
          >
            Add Subscription
          </Button>

          {/* Subscription Cards */}
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {data?.data?.length > 0 ? (
                data.data.map((item) => {
                  const extraObj = item.extra || {};
                  const features = Object.keys(extraObj)
                    .filter((key) => key !== "key_word")
                    .map((key) => extraObj[key]);

                  return (
                    <Col key={item.id} xs={24} sm={12} md={8} lg={8}>
                      <Card
                        title={item.subscription_name}
                        bordered
                        className="shadow-md"
                        extra={
                          <Space>
                            <Button
                              icon={<EditOutlined />}
                              onClick={() => handleEdit(item)}
                            />
                            <Button
                              icon={<DeleteOutlined />}
                              danger
                              onClick={() => handleDelete(item.id)}
                            />
                          </Space>
                        }
                      >
                        <p>
                          <strong>Price:</strong> ₹{item.price}
                        </p>
                        <p>
                          <strong>Type:</strong> {item.type}
                        </p>
                        <p>
                          <strong>Validity:</strong> {item.validity}
                        </p>
                        <p>
                          <strong>Description:</strong> {item.description}
                        </p>

                        {features.length > 0 && (
                          <>
                            <strong>Plan Offers:</strong>
                            <ul className="list-disc ml-6">
                              {features.map((f, i) => (
                                <li key={i}>{f}</li>
                              ))}
                            </ul>
                          </>
                        )}

                        {extraObj.key_word && (
                          <p className="mt-2">
                            <strong>Keyword:</strong> {extraObj.key_word}
                          </p>
                        )}
                      </Card>
                    </Col>
                  );
                })
              ) : (
                <div className="text-center w-full text-gray-500">
                  No subscriptions found.
                </div>
              )}
            </Row>
          )}
        </div>

        {/* Modal for Add/Edit */}
        <Modal
          title={
            editingSubscription ? "Update Subscription" : "Add Subscription"
          }
          open={openModal}
          onCancel={() => {
            setOpenModal(false);
            setEditingSubscription(null);
            form.resetFields();
          }}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Subscription Name"
              name="subscription_name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input placeholder="Enter subscription name" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <Input.TextArea rows={3} placeholder="Enter description" />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please enter price" }]}
            >
              <Input type="number" placeholder="Enter price" />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please select type" }]}
            >
              <Select placeholder="Select type">
                <Option value="customer">Customer</Option>
                <Option value="vendor">Vendor</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Validity"
              name="validity"
              rules={[{ required: true, message: "Please enter validity" }]}
            >
              <Input placeholder="e.g. monthly, yearly" />
            </Form.Item>

            <Form.Item
              label="Valid Days"
              name="valid_days"
              rules={[{ required: true, message: "Please enter Valid Days" }]}
            >
              <Input placeholder="e.g. 20, 39" />
            </Form.Item>

            {/* Features (Extras) */}
            <Form.List name="extra">
              {(fields, { add, remove }) => (
                <>
                  <label>Plan Offers / Features</label>
                  {fields.map((field) => (
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        {...field}
                        rules={[
                          { required: true, message: "Enter feature detail" },
                        ]}
                      >
                        <Input placeholder="Enter feature" />
                      </Form.Item>
                      <Button
                        type="text"
                        danger
                        onClick={() => remove(field.name)}
                      >
                        Remove
                      </Button>
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()}>
                    Add Feature
                  </Button>
                </>
              )}
            </Form.List>

            <Form.Item label="Keyword" name="key_word">
              <Input placeholder="Enter keyword (optional)" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={adding || updating}
              className="bg-[#EE4E34] hover:bg-[#d3452f] w-full mt-3"
            >
              {editingSubscription ? "Update" : "Add"} Subscription
            </Button>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
