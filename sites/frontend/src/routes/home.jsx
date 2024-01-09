// src/pages/Home.js
import React from "react";
import ResponsiveCard from "../components/cards/card";
import CategoriesList from "../components/categoriesList/categoriesList";
import "./home.scss";

const Home = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left Container (1/4th size) */}
        <div className="col-lg-2">
          <CategoriesList />
        </div>

        {/* Right Container (3/4th size) */}
        <div className="col-lg-10">
          <div className="row mb-3">
            {/* Search Box with Heading */}
            <div className="col-lg-6 offset-lg-3">
              <h2 className="mb-3 text-center">Search Templates</h2>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search cards..."
                />
                <span className="input-group-text">
                  <i className="material-icons">search</i>
                </span>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Cards */}
            <ResponsiveCard
              imgSrc="https://media.slidesgo.com/storage/29702562/responsive-images/0-abstract-masters-thesis-infographics___media_library_original_1600_900.jpg"
              title="Hello"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere ab aspernatur tempora in eum inventore maiores officiis sit. Ad, laudantium!"
              category="category 1"
              uploadTime="01-01-2024"
            />
            <ResponsiveCard
              imgSrc="https://media.slidesgo.com/storage/29702562/responsive-images/0-abstract-masters-thesis-infographics___media_library_original_1600_900.jpg"
              title="Hello"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere ab aspernatur tempora in eum inventore maiores officiis sit. Ad, laudantium!"
              category="category 1"
              uploadTime="01-01-2024"
            />
            <ResponsiveCard
              imgSrc="https://media.slidesgo.com/storage/29702562/responsive-images/0-abstract-masters-thesis-infographics___media_library_original_1600_900.jpg"
              title="Hello"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere ab aspernatur tempora in eum inventore maiores officiis sit. Ad, laudantium!"
              category="category 1"
              uploadTime="01-01-2024"
            />
            <ResponsiveCard
              imgSrc="https://media.slidesgo.com/storage/29702562/responsive-images/0-abstract-masters-thesis-infographics___media_library_original_1600_900.jpg"
              title="Hello"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere ab aspernatur tempora in eum inventore maiores officiis sit. Ad, laudantium!"
              category="category 1"
              uploadTime="01-01-2024"
            />
            <ResponsiveCard
              imgSrc="https://media.slidesgo.com/storage/29702562/responsive-images/0-abstract-masters-thesis-infographics___media_library_original_1600_900.jpg"
              title="Hello"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere ab aspernatur tempora in eum inventore maiores officiis sit. Ad, laudantium!"
              category="category 1"
              uploadTime="01-01-2024"
            />
            <ResponsiveCard
              imgSrc="https://media.slidesgo.com/storage/29702562/responsive-images/0-abstract-masters-thesis-infographics___media_library_original_1600_900.jpg"
              title="Hello"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere ab aspernatur tempora in eum inventore maiores officiis sit. Ad, laudantium!"
              category="category 1"
              uploadTime="01-01-2024"
            />
            <ResponsiveCard
              imgSrc="https://media.slidesgo.com/storage/29702562/responsive-images/0-abstract-masters-thesis-infographics___media_library_original_1600_900.jpg"
              title="Hello"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere ab aspernatur tempora in eum inventore maiores officiis sit. Ad, laudantium!"
              category="category 1"
              uploadTime="01-01-2024"
            />
            <ResponsiveCard
              imgSrc="https://media.slidesgo.com/storage/29702562/responsive-images/0-abstract-masters-thesis-infographics___media_library_original_1600_900.jpg"
              title="Hello"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere ab aspernatur tempora in eum inventore maiores officiis sit. Ad, laudantium!"
              category="category 1"
              uploadTime="01-01-2024"
            />
            {/* Add more ResponsiveCard components here with 10px spacing */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
