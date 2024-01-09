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
    <Link
      to="/details"
      className="card-link card my-3"
      style={{ width: "400px" }}
    >
      <img src={imgSrc} className="card-img-top" alt="Card Image" />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
      </div>
      <div className="card-footer d-flex justify-content-between">
        <small className="text-muted">{category}</small>
        <small className="text-muted">{uploadTime}</small>
      </div>
    </Link>
  );
};

export default ResponsiveCard;
