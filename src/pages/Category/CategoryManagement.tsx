import React, { useState, useEffect } from "react";
import { Table, Button, message, Modal, Form, Input, Upload, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useSidebar } from "../../context/SidebarContext";
import {
  useGetcategoryQuery,
  useAddCategoryMutation,
} from "../../redux/api/categoryApi"; // addCategory mutation will be used for update

const CategoryManagement = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { data, isLoading, refetch } = useGetcategoryQuery("");
  const [updateCategory, { isLoading: updating }] = useAddCategoryMutation();

  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // Open modal with selected category data
  const handleEdit = (record) => {
    setEditingCategory(record);
    form.setFieldsValue({ name: record.name });

    // Set existing image in fileList for preview
    if (record.image) {
      setFileList([
        {
          uid: "-1",
          name: "current_image",
          status: "done",
          url: record.image,
        },
      ]);
    } else {
      setFileList([]);
    }

    setOpenModal(true);
  };

  const handleUpdateCategory = async (values) => {
    try {
      const { name } = values;

      const formData = new FormData();
      formData.append("name", name);

      if (fileList.length && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      // Use _id as the ID
      await updateCategory({ formData, id: editingCategory.id }).unwrap();
      message.success("Category updated successfully!");
      setOpenModal(false);
      setEditingCategory(null);
      form.resetFields();
      setFileList([]);
      refetch();
    } catch (error) {
      console.error(error);
      message.error("Failed to update category. Please try again.");
    }
  };

  // Handle file change in Upload component
  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <div
      className={`flex-1 transition-all duration-300 ease-in-out ${
        isExpanded || isHovered
          ? "lg:pl-0 lg:w-[1190px]"
          : "lg:pl-[0px] lg:w-[1390px]"
      } ${isMobileOpen ? "ml-0" : ""}`}
    >
      <PageBreadcrumb pageTitle="Category Management" />

      <div className="p-4">
        {/* Table */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              dataSource={data?.data || []}
              rowKey="_id"
              columns={[
                { title: "Category Name", dataIndex: "name" },
                {
                  title: "Image",
                  dataIndex: "image",
                  render: (image) =>
                    image ? (
                      <img
                        src={image}
                        alt="category"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      "No Image"
                    ),
                },
                {
                  title: "Action",
                  render: (_, record) => (
                    <Button
                      type="link"
                      onClick={() => handleEdit(record)}
                      className="text-[#EE4E34]"
                    >
                      Edit
                    </Button>
                  ),
                },
              ]}
              pagination={false}
            />
          )}
        </div>

        {/* Edit Modal */}
        <Modal
          title="Update Category"
          open={openModal}
          onCancel={() => {
            setOpenModal(false);
            setEditingCategory(null);
            form.resetFields();
            setFileList([]);
          }}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateCategory}
            encType="multipart/form-data"
          >
            <Form.Item
              label="Category Name"
              name="name"
              rules={[
                { required: true, message: "Please enter category name" },
              ]}
            >
              <Input placeholder="Enter category name" />
            </Form.Item>

            <Form.Item label="Category Image">
              <Upload
                maxCount={1}
                listType="picture"
                fileList={fileList}
                onChange={handleChange}
                beforeUpload={() => false} // stop auto-upload
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={updating}
                className="bg-[#EE4E34] hover:bg-[#d3452f] w-full"
              >
                Update Category
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryManagement;
