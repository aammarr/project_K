import ResponsiveCard from "../components/cards/card";

const Home = () => {
  console.log("home");
  return (
    <div>
      {" "}
      <ResponsiveCard
        imgSrc="https://media.slidesgo.com/storage/29702562/responsive-images/0-abstract-masters-thesis-infographics___media_library_original_1600_900.jpg"
        title="Hello"
        description=" Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere ab aspernatur tempora in eum inventore maiores officiis sit. Ad, laudantium!"
        category="category 1"
        uploadTime="01-01-2024"
      />{" "}
    </div>
  );
};

export default Home;
