import React from "react";
import { Row, Col, Tag } from "antd";

interface UserDetailsModalProps {
  user: any;
  open: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  open,
  onClose,
}) => {
  if (!user) return null;

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b">
        <h2 className="text-2xl font-semibold text-gray-900">
          Customer Details
        </h2>
      </div>

      <Row gutter={32}>
        {/* Profile */}
        <Col xs={24} md={6}>
          <div className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
              <img
                src={user.image}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {user.name}
            </h3>
            <Tag color={user.is_active ? "green" : "volcano"} >
              {user.is_active ? "Active" : "Inactive"}
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
                  Customer ID
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  QC_{user.id}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">Role</span>
                <span className="text-lg font-semibold text-gray-900">
                  {getRoleName(user.user_role_id)}
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <span className="text-sm text-gray-500 block mb-1">Email</span>
                <span className="text-lg font-semibold text-gray-900 break-all">
                  {user.email}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">Phone</span>
                <span className="text-lg font-semibold text-gray-900">
                  {user.phone_number}
                </span>
              </div>
            </div>

            {/* Wallet */}
            <div className="pt-4 border-t">
              <span className="text-sm text-gray-500 block mb-2">
                Wallet Balance
              </span>
              <span className="text-2xl font-bold text-green-600">
                ₹{user.wallet}
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default UserDetailsModal;
