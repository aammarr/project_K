// src/components/CategoriesList.js
import React from "react";

const CategoriesList = (categories) => {
  console.log(categories);
  return (
    <div className="categories-list">
      <h4>Categories</h4>
      {/* Add your category list here */}
      <ul>
        {categories?.categories.map((category) => (
          <li>{category?.category_name}</li>
        ))}{" "}
        {/* Add more categories as needed */}
      </ul>
    </div>
  );
};

export default CategoriesList;
