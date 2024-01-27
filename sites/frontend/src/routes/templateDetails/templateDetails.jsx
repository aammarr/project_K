import { useEffect } from "react";
import "./templateDetails.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../../axios/axiosConfig";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress

const TemplateDetails = () => {
  const location = useLocation();
  const id = location.state?.templateId;

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading

  const user = useSelector((state) => state.user.user);
  console.log(user);

  const fetchData = async () => {
    try {
      // Fetch template data using the provided template ID
      const response = await axiosInstance.get(`template/${id}`);
      const templateData = response?.data?.data;

      // Set the form fields with the retrieved data
      setPageData(templateData);
    } catch (error) {
      console.error("Error fetching template data:", error);
      toast.error("Error fetching template data");
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    if (!id || !user) {
      window.location = "../";
    } else fetchData();
  }, [id, user]);

  const handleDownload = () => {
    // Handle download logic here
    console.log("Download clicked");
  };

  const handleSubscribe = () => {
    // Handle subscription logic here
    console.log("Subscribe clicked");
  };

  function convertDateFormat(inputDate) {
    const date = new Date(inputDate);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  }
  const handleDownloadTemplate = async (key) => {
    const responseOne = await axiosInstance.get(
      `template/getSignedUrlDownload?type=get&name=${key}`
    );
    window.open(responseOne?.data?.data, "_blank");
  };
  return (
    <>
      {loading ? (
        // Loader while data is being fetched
        <div className="text-center mt-4">
          <CircularProgress />
        </div>
      ) : (
        pageData && (
          <div className="container mt-4">
            <div className="row">
              {/* Left Container (3/4 size) */}
              <div className="col-md-8">
                <img
                  src={pageData.template_thumbnail} // Replace with the actual image source
                  alt="Template Image"
                  className="img-fluid rounded"
                />
                <div className="row mt-4">
                  <h1 className="fw-bold">{pageData.template_name}</h1>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-secondary">
                      {pageData.category_name}
                    </span>
                    <p className="text-muted">
                      Created on
                      {" " + convertDateFormat(pageData?.created_at)}
                    </p>
                  </div>
                  <h3 className="mt-4">Template Description</h3>
                  <p>{pageData.template_description}</p>
                </div>
              </div>

              {/* Right Container (1/4 size) */}
              <div className="col-md-4">
                {/* Ad Placeholder */}
                <div
                  className="ad-placeholder"
                  style={{
                    backgroundColor: "#E8CCF8",
                  }}
                >
                  <div style={{ width: "400px", height: "400px" }}>
                    Ad Placeholder
                  </div>
                </div>
                <div className="row mt-4">
                  {user && user?.subscribed !== "0" ? (
                    <button
                      className="btn btn-primary p-2"
                      onClick={() =>
                        handleDownloadTemplate(pageData?.template_key)
                      }
                    >
                      Download
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-success p-2"
                        onClick={handleSubscribe}
                      >
                        Buy Subscription
                      </button>
                      <p className="mt-2">
                        Please buy the subscription to download this template.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Template Details */}

            {/* Download or Buy Subscription */}
          </div>
        )
      )}
    </>
  );
};

export default TemplateDetails;
