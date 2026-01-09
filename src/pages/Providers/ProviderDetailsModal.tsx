import React from "react";
import { Row, Col, Tag } from "antd";
import { useGetcategoryQuery } from "../../redux/api/categoryApi";

interface ProviderDetailsModalProps {
  provider: any;
  open: boolean;
  onClose: () => void;
}

const ProviderDetailsModal: React.FC<ProviderDetailsModalProps> = ({
  provider,
  open,
  onClose,
}) => {
  if (!provider) return null;

  const { data: categoryData, isLoading: categoryLoading } =
    useGetcategoryQuery({});

  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case 1:
        return "Admin";
      case 2:
        return "User";
      case 3:
        return "Vendor";
      default:
        return "Unknown";
    }
  };

  const getServiceCategoryName = (categoryId: number) => {
    if (categoryLoading || !categoryData?.data) return "Loading...";

    const category = categoryData.data.find(
      (cat: any) => cat.id === categoryId
    );
    return category ? category.name : "N/A";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b">
        <h2 className="text-2xl font-semibold text-gray-900">
          Provider Details
        </h2>
      </div>

      <Row gutter={32}>
        {/* Profile */}
        <Col xs={24} md={6}>
          <div className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
              <img
                src={provider.image}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {provider.name}
            </h3>
            <Tag color={provider.is_active ? "green" : "volcano"}>
              {provider.is_active ? "Active" : "Inactive"}
            </Tag>
          </div>
        </Col>

        {/* Details */}
        <Col xs={24} md={18}>
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-sm text-gray-500 block mb-1">
                  Provider ID
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  QP_{provider.id}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">Role</span>
                <span className="text-lg font-semibold text-gray-900">
                  {getRoleName(provider.user_role_id)}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">
                  Service Category
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {getServiceCategoryName(provider.service_category)}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">
                  Highlighted
                </span>
                <span
                  className={`text-lg font-semibold ${
                    provider.is_highlighted === "1"
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {provider.is_highlighted === "1" ? "Yes" : "No"}
                </span>
              </div>
            </div>

            {/* Contact & Business Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <span className="text-sm text-gray-500 block mb-1">Email</span>
                <span className="text-lg font-semibold text-gray-900 break-all">
                  {provider.email}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">Phone</span>
                <span className="text-lg font-semibold text-gray-900">
                  {provider.phone_number}
                </span>
              </div>
              {provider.business_name && (
                <div className="md:col-span-2">
                  <span className="text-sm text-gray-500 block mb-1">
                    Business Name
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    {provider.business_name}
                  </span>
                </div>
              )}
              {provider.FullAddress && (
                <div className="md:col-span-2">
                  <span className="text-sm text-gray-500 block mb-1">
                    Address
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {provider.FullAddress}
                  </span>
                </div>
              )}
            </div>

            {/* Business Hours & Cashback */}
            {(provider.daily_start_time || provider.is_cashback) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                {provider.daily_start_time && (
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">
                      Working Hours
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {provider.daily_start_time} - {provider.daily_end_time}
                    </span>
                  </div>
                )}
                {provider.is_cashback && (
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">
                      Tie-up %
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {provider.is_cashback}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProviderDetailsModal;
