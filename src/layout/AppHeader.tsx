import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import {
  ArrowBigDownDashIcon,
  ArrowDown,
  ArrowDownAZ,
  PaintRoller,
  UserCircle,
  Warehouse,
} from "lucide-react";
import { Tooltip, Dropdown, Menu, Modal, Form, Input, message } from "antd";
import type { MenuProps } from "antd";
import { useChange_Admin_PasswordMutation } from "../redux/api/authApi";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { DownOutlined } from "@ant-design/icons";

const { Item: FormItem } = Form;
const { Password } = Input;

const AppHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] =
    useState(false);
  const [changePasswordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const [change_Admin_Password] = useChange_Admin_PasswordMutation();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  // Profile dropdown menu items
  const profileMenuItems: MenuProps["items"] = [
    {
      key: "change-password",
      label: "Change Password",
      onClick: () => setChangePasswordModalOpen(true),
    },
    {
      key: "logout",
      label: "Logout",
      danger: true,
      onClick: () => {
        logout();
        navigate("/login");
      },
    },
  ];

  // Change password form submission
  const handleChangePassword = async (values: any) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("current_password", values.currentPassword);
      formData.append("new_password", values.newPassword);
      formData.append("new_password_confirmation", values.confirmPassword);

      await change_Admin_Password(formData).unwrap();
      toast.success("Password changed successfully");

      // Reset form and close modal
      changePasswordForm.resetFields();
      setChangePasswordModalOpen(false);
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 flex w-full bg-white border-gray-200 z-50 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
        <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
          <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
            <button
              className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
              onClick={handleToggle}
              aria-label="Toggle Sidebar"
            >
              {isMobileOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 16 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>

            <Link to="/" className="lg:hidden">
              <div className="flex items-center gap-2 text-primary font-bold text-xl">
                <img
                  className="dark:hidden"
                  src="/logo.png"
                  alt="Logo"
                  width={30}
                  height={30}
                />
                <div>
                  <span className="tracking-wide text-[#090A14] ">QUICK</span>
                  <span className="tracking-wide  text-[#EE4E34] ">MY</span>
                  <span className="tracking-wide   text-[#EE4E34] ">SLOT</span>
                </div>
              </div>
            </Link>

            <div className="flex justify-end w-full">
              <Dropdown
                overlay={<Menu items={profileMenuItems} />}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Tooltip title="Profile">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800 transition-all dark:text-white">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide dark:text-gray-400">
                        ADMIN
                      </span>
                      <span className="text-sm font-medium truncate max-w-32 dark:text-white">
                        {user?.email || "user@example.com"}
                      </span>
                    </div>

                    <DownOutlined className="text-gray-400 text-sm ml-1" />
                  </div>
                </Tooltip>
              </Dropdown>
            </div>
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={isChangePasswordModalOpen}
        onCancel={() => {
          setChangePasswordModalOpen(false);
          changePasswordForm.resetFields();
        }}
        footer={null}
        centered
        destroyOnClose
      >
        <Form
          form={changePasswordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          autoComplete="off"
        >
          <FormItem
            name="currentPassword"
            label="Current Password"
            rules={[
              { required: true, message: "Please enter current password" },
            ]}
          >
            <Password visibilityToggle />
          </FormItem>

          <FormItem
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter new password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Password visibilityToggle />
          </FormItem>

          <FormItem
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Password visibilityToggle />
          </FormItem>

          <FormItem className="mb-0">
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  setChangePasswordModalOpen(false);
                  changePasswordForm.resetFields();
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default AppHeader;
