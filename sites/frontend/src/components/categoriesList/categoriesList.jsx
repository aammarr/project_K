// CategoriesList component
import React, { useState } from "react";
import "./categoriesList.scss"; // Import your stylesheet

const CategoriesList = ({ categories, onCategoryClick }) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    onCategoryClick(categoryId);
  };

  return (
    <div className="categories-list">
      <h3>Categories</h3>
      <ul>
        {categories.map((category) => (
          <li
            key={category.category_id}
            onClick={() => handleCategoryClick(category.category_id)}
            className={
              selectedCategory === category.category_id ? "selected" : ""
            }
          >
            {category.category_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesList;
