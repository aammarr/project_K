// src/pages/Home.js
import React from "react";
import "./home.scss";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="container-fluid">
        <div className="d-flex justify-content-center">
          <div className="text-center">
            <h1 className="heading">
              Get Your Presentations DONE in Lightning Speed! 🚀
            </h1>
            <p className="heading-subtext">
              Create impactful pitch decks, business reports, and marketing
              visuals in minutes.
            </p>
            <button
              className="home-button"
              onClick={() => navigate("/collections")}
            >
              START NOW
            </button>
          </div>
        </div>
      </div>

      <div class="infiniteslide_wrap">
        <div class="h-scroll-bar">
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/Business_Model_Canvas_10_800x.png?v=1630291127"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/smile-rating-powerpoint-infographic-templates-07_800x.png?v=1630291097"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/Business_Model_Canvas_10_800x.png?v=1630291127"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/smile-rating-powerpoint-infographic-templates-07_800x.png?v=1630291097"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/Business_Model_Canvas_10_800x.png?v=1630291127"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/smile-rating-powerpoint-infographic-templates-07_800x.png?v=1630291097"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/Aviation_Infographic_02_800x.png?v=1630291187"
              sizes="100vw"
              alt=""
              class="slide-image"
            />{" "}
            <img
              src="https://infograpia.com/cdn/shop/files/Business_Model_Canvas_10_800x.png?v=1630291127"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/smile-rating-powerpoint-infographic-templates-07_800x.png?v=1630291097"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/Aviation_Infographic_02_800x.png?v=1630291187"
              sizes="100vw"
              alt=""
              class="slide-image"
            />{" "}
            <img
              src="https://infograpia.com/cdn/shop/files/Business_Model_Canvas_10_800x.png?v=1630291127"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/smile-rating-powerpoint-infographic-templates-07_800x.png?v=1630291097"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/Aviation_Infographic_02_800x.png?v=1630291187"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
        </div>
      </div>
      <div class="infiniteslide_wrap" style={{ marginBottom: "40px" }}>
        <div class="h-scroll-bar-right">
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/Business_Model_Canvas_10_800x.png?v=1630291127"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/smile-rating-powerpoint-infographic-templates-07_800x.png?v=1630291097"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/Business_Model_Canvas_10_800x.png?v=1630291127"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/smile-rating-powerpoint-infographic-templates-07_800x.png?v=1630291097"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/Business_Model_Canvas_10_800x.png?v=1630291127"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/smile-rating-powerpoint-infographic-templates-07_800x.png?v=1630291097"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/Aviation_Infographic_02_800x.png?v=1630291187"
              sizes="100vw"
              alt=""
              class="slide-image"
            />{" "}
            <img
              src="https://infograpia.com/cdn/shop/files/Business_Model_Canvas_10_800x.png?v=1630291127"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/smile-rating-powerpoint-infographic-templates-07_800x.png?v=1630291097"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/Aviation_Infographic_02_800x.png?v=1630291187"
              sizes="100vw"
              alt=""
              class="slide-image"
            />{" "}
            <img
              src="https://infograpia.com/cdn/shop/files/Business_Model_Canvas_10_800x.png?v=1630291127"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/smile-rating-powerpoint-infographic-templates-07_800x.png?v=1630291097"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
          <div class="slide-wrapper">
            <img
              src="https://infograpia.com/cdn/shop/files/Aviation_Infographic_02_800x.png?v=1630291187"
              sizes="100vw"
              alt=""
              class="slide-image"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
