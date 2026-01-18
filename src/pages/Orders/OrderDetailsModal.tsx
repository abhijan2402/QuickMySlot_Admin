import React from "react";
import { Row, Col, Tag, Descriptions, Divider, Card } from "antd";

interface OrderDetailsModalProps {
  order: any;
  open: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order }) => {
  if (!order) return null;

  console.log(order);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "green";
      case "pending":
        return "gold";
      case "cancelled":
      case "failed":
        return "red";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount: string | number) => `₹${amount}`;

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div>
      {/* ORDER SUMMARY */}
      <Card
        title="Order Summary"
        extra={
          <Tag color={getStatusColor(order.status)}>
            {order.status?.toUpperCase()}
          </Tag>
        }
        className="mb-6"
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Order ID">QO_{order.id}</Descriptions.Item>
          <Descriptions.Item label="Payment Status">
            <Tag color={order.payment_status === "1" ? "green" : "orange"}>
              {order.payment_status === "1" ? "Paid" : "Pending"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {formatDateTime(order.created_at)}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {formatDateTime(order.updated_at)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* CUSTOMER & VENDOR */}
      <Row gutter={16} className="mb-6">
        <Col span={12}>
          <Card title="Customer Details">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Name">
                {order.customer?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {order.customer?.phone_number || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {order.customer?.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Refer Code">
                {order.customer?.refer_code || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Vendor Details">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Vendor Name">
                {order.vendor?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Business">
                {order.vendor?.business_name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {order.vendor?.phone_number || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {order.vendor?.email || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* SERVICES */}
      <Card title="Services" className="mb-6">
        {order.services?.map((service: any) => (
          <Descriptions
            key={service.id}
            bordered
            column={2}
            size="small"
            className="mb-4"
          >
            <Descriptions.Item label="Service Name">
              {service.name}
            </Descriptions.Item>
            <Descriptions.Item label="Price">
              {formatCurrency(service.price)}
            </Descriptions.Item>
            <Descriptions.Item label="Duration">
              {service.duration} mins
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
              {service.gender || "All"}
            </Descriptions.Item>
            {service.description && (
              <Descriptions.Item label="Description" span={2}>
                {service.description}
              </Descriptions.Item>
            )}
          </Descriptions>
        ))}
      </Card>

      {/* SCHEDULE & PAYMENT */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Schedule">
            {order.schedule_time ? (
              Object.entries(order.schedule_time).map(([slot, date]: any) => (
                <Descriptions
                  key={slot}
                  bordered
                  column={1}
                  size="small"
                  className="mb-3"
                >
                  <Descriptions.Item label={slot}>
                    {new Date(date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Descriptions.Item>
                </Descriptions>
              ))
            ) : (
              <span>No schedule available</span>
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Payment Summary">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Subtotal">
                {formatCurrency(order.subtotal)}
              </Descriptions.Item>
              <Descriptions.Item label="Platform Fee">
                {formatCurrency(order.platform_fee)}
              </Descriptions.Item>
              <Descriptions.Item label="GST">
                {formatCurrency(order.gst_amount)}
              </Descriptions.Item>
              <Descriptions.Item label="Convenience Fee">
                {formatCurrency(order.convenience_fee)}
              </Descriptions.Item>
              <Descriptions.Item label="Discount">
                {formatCurrency(order.discount_amount)}
              </Descriptions.Item>
              <Descriptions.Item label="Cashback">
                {formatCurrency(order.cashback_amount)}
              </Descriptions.Item>
              <Descriptions.Item label="Final Amount">
                <strong>{formatCurrency(order.final_amount)}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Payment ID">
                {order.payment_id || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Promo Code">
                {order.promo_code || "None"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailsModal;
