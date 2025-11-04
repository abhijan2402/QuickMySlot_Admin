import React, { useState, useEffect, useRef } from "react";
import { Spin, Tabs } from "antd";
import JoditEditor from "jodit-react";
import { useEditCmsMutation, useGetCmsQuery } from "../../redux/api/cmsApi";
import { toast } from "react-toastify";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const { TabPane } = Tabs;

const CMSPrivacyEditor = ({ userType }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [selectedPolicyTab, setSelectedPolicyTab] = useState("privacy-policy");

  // Fetch CMS data dynamically
  const { data, isLoading, refetch, isFetching } = useGetCmsQuery(
    { type: userType, slug: selectedPolicyTab },
    { refetchOnMountOrArgChange: true }
  );

  const [editCms, { isLoading: isSaving }] = useEditCmsMutation();

  // ✅ Update editor when API data changes
  useEffect(() => {
    if (data?.data?.body) {
      setContent(data.data.body);
    } else {
      setContent(""); // reset when no data
    }
  }, [data, selectedPolicyTab]);

  // ✅ Re-fetch when userType or tab changes
  useEffect(() => {
    refetch();
  }, [userType, selectedPolicyTab, refetch]);

  const handleSave = async () => {
    console.log(data);

    if (!data?.data?.id) {
      toast.error("No CMS record found to update.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", data.data.id);
      formData.append("body", content);

      await editCms(formData).unwrap();
      toast.success("CMS Updated Successfully");
      refetch(); // ✅ Refresh content after save
    } catch {
      toast.error("Failed to update CMS.");
    }
  };

  return (
    <>
      {/* Sub-tabs for CMS types */}
      <Tabs
        activeKey={selectedPolicyTab}
        onChange={setSelectedPolicyTab}
        size="large"
        className="mb-2"
      >
        <TabPane tab="Terms & Conditions" key="terms-condition" />
        <TabPane tab="Privacy" key="privacy-policy" />
        <TabPane tab="About" key="about-us" />
      </Tabs>

      <div className="border rounded shadow-md bg-white min-h-[300px]">
        {isLoading || isFetching ? (
          <div className="flex justify-center items-center h-[300px]">
            <Spin size="large" />
          </div>
        ) : (
          <JoditEditor
            key={selectedPolicyTab} // ✅ Force re-render when tab changes
            ref={editor}
            value={content}
            onBlur={(newContent) => setContent(newContent)}
            config={{
              readonly: false,
              minHeight: 300,
              toolbarAdaptive: false,
              buttons: [
                "bold",
                "italic",
                "underline",
                "|",
                "ul",
                "ol",
                "|",
                "link",
                "image",
                "|",
                "align",
                "undo",
                "redo",
                "hr",
                "eraser",
              ],
            }}
          />
        )}
      </div>

      <button
        onClick={handleSave}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-[#EE4E34] transition-colors text-sm"
        style={{ width: "14%" }}
        disabled={isSaving || isLoading}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </>
  );
};

const CMSPage = () => {
  const [selectedUserType, setSelectedUserType] = useState("customer");

  const handleUserTypeChange = (key) => {
    setSelectedUserType(key);
  };

  return (
    <div className="max-w-6xl mx-auto p-0">
      <PageBreadcrumb pageTitle="Cms Editor" />

      <Tabs
        activeKey={selectedUserType}
        onChange={handleUserTypeChange}
        size="large"
        className="mb-6"
      >
        <TabPane tab="Customer" key="customer" />
        <TabPane tab="Provider" key="provider" />
      </Tabs>

      <CMSPrivacyEditor userType={selectedUserType} />
    </div>
  );
};

export default CMSPage;
