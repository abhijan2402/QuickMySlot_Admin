import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Table, Spin, Card, Tooltip, Button, Tag } from "antd";
import {
  useBidApprovedMutation,
  useGetbidEntryListQuery,
} from "../../redux/api/bidApi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { formatDate } from "../../utils/utils";
import { toast } from "react-toastify";
import { CheckCircle, Award } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";

const BidDetails = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const { categoryId, type } = useParams();

  // Fetch bid entries for this category
  const { data, isLoading, refetch } = useGetbidEntryListQuery(categoryId);
  const [approveBid] = useBidApprovedMutation();

  const bidders = data?.data || [];

  // ✅ Find the bidder with the highest amount
  const highestAmount = useMemo(() => {
    if (bidders.length === 0) return null;
    return Math.max(...bidders.map((b) => parseFloat(b.amount || 0)));
  }, [bidders]);

  const handleApprove = async (id) => {
    try {
      await approveBid(id).unwrap();
      toast.success("Bid awarded successfully");
      refetch();
    } catch {
      toast.error("Awarding failed");
    }
  };

  const columns = [
    { title: "Bid ID", dataIndex: "bid_id", key: "bid_id" },
    {
      title: "User Name",
      key: "name",
      render: (_, record) => record.user?.name || "N/A",
    },
    {
      title: "Business Name",
      key: "business_name",
      render: (_, record) => record.user?.business_name || "N/A",
    },
    {
      title: "Location",
      key: "location_area_served",
      render: (_, record) => record.user?.location_area_served || "N/A",
    },
    {
      title: "Email",
      key: "email",
      render: (_, record) => record.user?.email || "N/A",
    },
    {
      title: "Phone",
      key: "phone_number",
      render: (_, record) => record.user?.phone_number || "N/A",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text, record) => {
        const isTopBidder = parseFloat(record.amount) === highestAmount;
        return (
          <span className={isTopBidder ? "font-semibold text-[#185B5C]" : ""}>
            ₹{text}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        switch (status) {
          case 0:
            return <Tag color="orange">Pending</Tag>;
          case 1:
            return <Tag color="green">Awarded</Tag>;
          case 2:
            return <Tag color="green">Approved</Tag>;
          case 3:
            return <Tag color="green">Approved</Tag>;
          case 4:
            return <Tag color="green">Approved</Tag>;
          case 5:
            return <Tag color="green">Approved</Tag>;
          case 6:
            return <Tag color="red">Rejected</Tag>;
          default:
            return <Tag>Unknown</Tag>;
        }
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => formatDate(text),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        if (record.status === 1) {
          return (
            <Tooltip title="This bid has been awarded">
              <Button
                size="small"
                icon={<Award size={16} />}
                disabled
                className="!bg-gray-300 !text-gray-700 flex items-center justify-center !rounded-md shadow-sm"
              >
                Awarded
              </Button>
            </Tooltip>
          );
        }
        return (
          <Tooltip title="Award Bid to this User">
            <Button
              size="small"
              className="!bg-green-600 hover:!bg-green-700 !text-white flex items-center justify-center !rounded-md shadow-sm"
              icon={<Award size={16} />}
              onClick={() => handleApprove(record.id || record._id)}
            >
              Award
            </Button>
          </Tooltip>
        );
      },
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
      <PageBreadcrumb pageTitle={`Bidders for Category #${type}`} />

      <Card className="shadow-md mt-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={bidders}
            rowKey={(record) => record.id}
            scroll={{ x: "max-content" }}
            pagination={{
              pageSizeOptions: ["5", "10", "20"],
              showSizeChanger: true,
              defaultPageSize: 5,
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default BidDetails;
