// src/components/ResponsiveCard.js
import React from "react";
import { Link } from "react-router-dom";
import "./card.scss";

const ResponsiveCard = ({
  imgSrc,
  title,
  description,
  category,
  uploadTime,
}) => {
  return (
    <Link to="/details" className="card-link mb-4" style={{ width: "350px" }}>
      <div className="card">
        <img
          src={imgSrc || "images/no-image.jpg"}
          className="card-img-top"
          alt="Card Image"
        />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center">
          {/* Badge as a chip for category */}
          <span className="badge bg-secondary">{category}</span>

          <div>
            <small className="text-muted">{uploadTime}</small>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ResponsiveCard;
