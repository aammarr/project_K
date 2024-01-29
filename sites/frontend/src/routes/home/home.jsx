// src/pages/Home.js
import React, { useEffect, useState } from "react";
import ResponsiveCard from "../../components/cards/card";
import CategoriesList from "../../components/categoriesList/categoriesList";
import "./home.scss";
import axiosInstance from "../../axios/axiosConfig";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { makeStyles } from "@mui/material/styles";

const Home = () => {
  const [templates, setTemplates] = useState([]);
  const [limit, setLimit] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false); // State for modal visibility

  const navigate = useNavigate(); // Initialize useNavigate
  const user = useSelector((state) => state.user.user);

  const handleCardClick = (templateId) => {
    // Navigate to template-details route and pass the templateId as a parameter
    console.log("clicked");
    navigate("/template-details", { state: { templateId } });
  };
  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(
        "category?limit=1000&page=1&search"
      );
      setCategories([
        { category_id: "", category_name: "All" },
        ...response?.data?.data,
      ]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    console.log(categoryId);
    setCurrentPage(1);
    setCategoryId(categoryId); // Pass the category ID to fetchTemplates
  };

  function convertDateFormat(inputDate) {
    const date = new Date(inputDate);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  }

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    if (currentPage === 1) fetchTemplates();
  };

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setCurrentPage(1);
      if (currentPage === 1) fetchTemplates();
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `template?category_id=${categoryId}&page=${currentPage}&limit=${limit}&search=${
          searchText ? searchText : ""
        }`
      );
      setTemplates(response?.data?.data);
      setTotalPages(response?.data?.pagination?.totalPages);
      setTotalItems(response?.data?.pagination?.totalResults);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Error fetching templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [currentPage, limit, categoryId]);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left Container (1/4th size) */}
        <div className="col-lg-2 mt-5 pt-1">
          <CategoriesList
            categories={categories}
            onCategoryClick={handleCategoryClick}
          />
        </div>

        {/* Right Container (3/4th size) */}
        <div className="col-lg-10">
          <div className="row mb-3">
            {/* Search Box with Heading */}
            <div className="col-lg-6 offset-lg-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search templates..."
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                />
                <span className="input-group-text" onClick={handleSearch}>
                  <i className="material-icons">search</i>
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center mt-5">
              <CircularProgress /> {/* Material-UI CircularProgress */}
            </div>
          ) : (
            <>
              {" "}
              <div className="row">
                {/* Cards */}

                {templates && templates?.length !== 0 ? (
                  templates.map((template) => (
                    <ResponsiveCard
                      imgSrc={template?.template_thumbnail}
                      title={template?.template_name}
                      description={template?.template_description}
                      category={template?.category_name}
                      uploadTime={convertDateFormat(template?.created_at)}
                      onClick={() => handleCardClick(template.template_id)}
                    />
                  ))
                ) : (
                  <div
                    style={{
                      fontSize: "20px",
                      textAlign: "center",
                      marginTop: "20px",
                    }}
                  >
                    {" "}
                    No Templates Found
                  </div>
                )}

                {/* Add more ResponsiveCard components here with 10px spacing */}
              </div>
              {templates?.length !== 0 && (
                <div>
                  <Pagination
                    count={totalPages}
                    color="primary"
                    onChange={handlePageChange}
                    page={currentPage}
                    size="large"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
