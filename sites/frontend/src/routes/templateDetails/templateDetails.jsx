import { useEffect } from "react";
import "./templateDetails.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../../axios/axiosConfig";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "react-slick";
import ImageGallery from "react-image-gallery";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Rating from "@mui/material/Rating";
import { TextField } from "@mui/material";

const TemplateDetails = () => {
  const location = useLocation();
  const id = location.state?.templateId;
  const navigate = useNavigate();

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading
  const [showLoginModal, setShowLoginModal] = useState(false); // State for modal visibility
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false); // State for modal visibility
  const [imagesArray, setImagesArray] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [ratingValue, setRatingValue] = useState(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWritingReview, setIsWritingReview] = useState(false);
  function formatDate(dateString) {
    const date = new Date(dateString);

    // Extracting date components
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const year = date.getFullYear();

    // Extracting time components
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Combining date and time components in the desired format
    const formattedDate = `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }
  const handleReviewClick = async () => {
    try {
      if (!title || !review || !ratingValue) {
        toast.error("Please fill all the fields!");
        return;
      }

      const body = { title: title, review: review, rating: ratingValue };
      const response = await axiosInstance.post(`template/review/${id}`, body);
      if (response) {
        toast.success("Review posted successfully!");
        fetchData();
        fetchReviews();
        setIsWritingReview(false);
      }
    } catch (error) {
      console.error("Error writing review", error);
      toast.error("Error posting review.");
    }
  };

  const handleWriteReviewClick = () => {
    if (user) setIsWritingReview(!isWritingReview);
    else setShowLoginModal(true);
  };

  const goToPreviousSlide = () => {
    const newIndex =
      (currentImageIndex - 1 + imagesArray.length) % imagesArray.length;
    setCurrentImageIndex(newIndex);
  };

  const goToNextSlide = () => {
    const newIndex = (currentImageIndex + 1) % imagesArray.length;
    setCurrentImageIndex(newIndex);
  };
  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    // Update the imagesArray when pageData changes
    const updateImagesArray = () => {
      if (pageData?.template_multiple_thumbnails?.length !== 0) {
        const newImagesArray = [
          {
            original: pageData.template_thumbnail || "images/no-image.jpg",
            thumbnail: pageData.template_thumbnail || "images/no-image.jpg",
          },
          ...pageData.template_multiple_thumbnails.map((el) => ({
            original: el.picture_url || "images/no-image.jpg",
            thumbnail: el.picture_url || "images/no-image.jpg",
          })),
        ];

        setImagesArray(newImagesArray);
      } else {
        const newImagesArray = [
          {
            original: pageData.template_thumbnail || "images/no-image.jpg",
            thumbnail: pageData.template_thumbnail || "images/no-image.jpg",
          },
        ];

        setImagesArray(newImagesArray);
      }
    };

    // Call the function when the component mounts and whenever pageData changes
    if (pageData) updateImagesArray();
  }, [pageData]);
  const user = useSelector((state) => state.user.user);

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

  const fetchReviews = async () => {
    try {
      // Fetch template data using the provided template ID
      const response = await axiosInstance.get(`template/review/${id}`);
      const reviewsData = response?.data?.data;

      // Set the form fields with the retrieved data
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching reviews data:", error);
      toast.error("Error fetching Reviews data");
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };
  const userReviewExists = reviews.some(
    (review) => review.user_id === user?.user_id
  );
  useEffect(() => {
    if (!id) {
      window.location = "../";
    } else {
      fetchData();
      fetchReviews();
    }
  }, [id]);

  function convertDateFormat(inputDate) {
    const date = new Date(inputDate);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  }
  const handleDownloadTemplate = async (key) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (user?.subscribed !== "1") {
      setShowSubscriptionModal(true);
      return;
    }
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
          <div className="container-lg p-5">
            <div className="row">
              {/* Left Container (3/4 size) */}
              <div className="col-md-8">
                {/* {imagesArray?.length !== 0 ? (
                  <ImageGallery items={imagesArray} />
                ) : (
                  <img
                    src={pageData.template_thumbnail || "images/no-image.jpg"} // Replace with the actual image source
                    alt="Template Image"
                    className="img-fluid rounded"
                    style={{ height: "500px", width: "100%" }}
                  />
                )} */}
                <div className="container">
                  {/* Full-width images with number text */}
                  {imagesArray?.length !== 0 && (
                    <div className="slideshow-gallery">
                      <div className="slideshow-image">
                        <img
                          src={imagesArray[currentImageIndex].thumbnail}
                          alt={`Slide ${currentImageIndex + 1}`}
                        />
                      </div>
                      <div className="navigation-buttons">
                        <button className="prev" onClick={goToPreviousSlide}>
                          <ArrowBackIcon />
                        </button>
                        <button className="next" onClick={goToNextSlide}>
                          <ArrowForwardIcon />
                        </button>
                      </div>
                    </div>
                  )}
                  {imagesArray && (
                    <div className="thumbnails">
                      {imagesArray.map((image, index) => (
                        <img
                          key={index}
                          src={image.thumbnail}
                          alt={`Thumbnail ${index + 1}`}
                          className={
                            index === currentImageIndex ? "active" : ""
                          }
                          onClick={() => goToSlide(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {/* <img
                  src={pageData.template_thumbnail || "images/no-image.jpg"} // Replace with the actual image source
                  alt="Template Image"
                  className="img-fluid rounded"
                  style={{ height: "500px", width: "100%" }}
                /> */}
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
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    {/* Display Total Views */}
                    <div>
                      <strong>Total Views:</strong>{" "}
                      {pageData?.template_view_count}
                    </div>
                    {/* Display Total Downloads */}
                    <div>
                      <strong>Total Downloads:</strong>{" "}
                      {pageData?.template_download_count}
                    </div>
                  </div>
                  <hr style={{ margin: "15px 0" }} />

                  <p>{pageData.template_description}</p>
                  <hr style={{ margin: "15px 0" }} />
                  <div>
                    <strong>Please note:</strong>
                    <p>
                      Downloads on mobile devices are not allowed. Because our
                      files are large and need to be unzipped make sure to use a
                      laptop or desktop computer. <br />
                      Instant Download: Your files will be available to download
                      once payment is confirmed.
                    </p>
                  </div>
                  <hr style={{ margin: "15px 0" }} />
                  <Box
                    border={1}
                    borderColor="primary.main"
                    p={2}
                    position="relative"
                  >
                    <Typography variant="h5" gutterBottom>
                      Customer Reviews
                    </Typography>
                    {reviews.length === 0 ? (
                      <Typography variant="body1">No reviews</Typography>
                    ) : (
                      <Typography variant="body1">
                        {reviews.length} Reviews
                      </Typography>
                    )}
                    {isWritingReview && (
                      <Box
                        border={1}
                        borderColor="grey.400"
                        p={2}
                        mb={2}
                        mt={1}
                      >
                        <div className="mb-3">
                          <Rating
                            name="rating"
                            defaultValue={0}
                            onChange={(event, newValue) => {
                              setRatingValue(newValue);
                            }}
                          />
                          <TextField
                            label="Title"
                            fullWidth
                            margin="normal"
                            onChange={(e) => setTitle(e.target.value)}
                          />

                          <TextField
                            label="Review"
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                            onChange={(e) => setReview(e.target.value)}
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleReviewClick}
                          >
                            Submit
                          </Button>
                        </div>
                      </Box>
                    )}
                    {reviews.map((review) => (
                      <Box
                        border={1}
                        borderColor="grey.400"
                        p={2}
                        mb={2}
                        mt={1}
                        key={review?.id}
                      >
                        <div style={{ display: "flex" }}>
                          <Rating
                            readOnly
                            value={review?.rating}
                            style={{ marginRight: "10px" }}
                          />{" "}
                          {`${
                            review?.user_id === user?.user_id
                              ? "You    "
                              : `${review?.first_name} ${review?.last_name}    `
                          }`}
                        </div>
                        <Typography variant="h6" gutterBottom>
                          {review?.title}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          {" "}
                          {formatDate(review?.created_at)}
                        </Typography>
                        <Typography variant="body1">
                          {review?.review}
                        </Typography>
                      </Box>
                    ))}

                    {user && (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleWriteReviewClick}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          display: userReviewExists ? "none" : "block",
                        }}
                      >
                        {isWritingReview ? "Cancel" : "Write a Review"}
                      </Button>
                    )}
                  </Box>
                </div>
              </div>

              {/* Right Container (1/4 size) */}
              <div className="col-md-4">
                <div style={{ display: "flex" }}>
                  <Rating
                    name="read-only"
                    value={pageData?.rating}
                    readOnly
                    style={{ marginBottom: "40px", marginRight: "10px" }}
                    precision={0.5}
                  />{" "}
                  {pageData?.review_count ? (
                    <span> ({pageData?.review_count} Reviews)</span>
                  ) : (
                    <span>No Reviews</span>
                  )}
                </div>
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
                  <button
                    className="btn btn-primary p-2 mt-4"
                    onClick={() =>
                      handleDownloadTemplate(pageData?.template_key)
                    }
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>

            {/* Template Details */}

            {/* Download or Buy Subscription */}
          </div>
        )
      )}
      <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            borderRadius: 8, // Rounded corners
            border: "2px solid #ccc", // Border
            boxShadow: 24,
            p: 2,
            textAlign: "center",
          }}
        >
          <IconButton
            aria-label="close"
            sx={{ position: "absolute", right: 0, top: 0 }}
            onClick={() => setShowLoginModal(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h6"
            gutterBottom
            style={{ padding: "20px 10px" }} // Adjusted padding
          >
            Please login or sign up first!
          </Typography>
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>

          <Button variant="contained" onClick={() => navigate("/sign-up")}>
            Sign up
          </Button>
        </Box>
      </Modal>
      <Modal
        open={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            borderRadius: 8, // Rounded corners
            border: "2px solid #ccc", // Border
            boxShadow: 24,
            p: 2,
            textAlign: "center",
          }}
        >
          <IconButton
            aria-label="close"
            sx={{ position: "absolute", right: 0, top: 0 }}
            onClick={() => setShowSubscriptionModal(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h6"
            gutterBottom
            style={{ padding: "20px 10px" }} // Adjusted padding
          >
            Please purchase a subscription to download this template!
          </Typography>
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            onClick={() => navigate("/premium-plans")}
          >
            Premium Plans
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default TemplateDetails;
