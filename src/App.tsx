import { Route, Routes, BrowserRouter } from "react-router-dom";

import Slideshow from "components/Slideshow/Slideshow";
import { Slide } from "components/Slideshow/Slideshow.types";

import "./App.scss";

function App() {
  const slides: Slide[] = [
    {
      slug: "one",
      background: "/assets/images/1-background.jpg",
      thumbnail: "/assets/images/1-thumbnail.jpg",
      desc: "",
      alt: "Slide 1",
      content: (
        <div>
          <button>Rico is back!</button>
          <h2 className="">RICOBOT</h2>
          Charge into a brand-new supersized adventure with RICO across 50
          exciting and diverse worlds, available now on PS5!
          <button className="cta">Learn More</button>
        </div>
      ),
    },
    {
      slug: "two",
      background: "/assets/images/2-background.jpg",
      thumbnail: "/assets/images/2-thumbnail.jpg",
      desc: "",
      alt: "Slide 2",
      content: <div>Slide 2 Content</div>,
    },
    {
      slug: "three",
      background: "/assets/images/3-background.jpg",
      thumbnail: "/assets/images/3-thumbnail.jpg",
      desc: "",
      alt: "Slide 3",
      content: <div>Slide 3 Content</div>,
    },
    {
      slug: "four",
      background: "/assets/images/4-background.jpg",
      thumbnail: "/assets/images/4-thumbnail.jpg",
      desc: "",
      alt: "Slide 4",
      content: <div>Slide 4 Content</div>,
    },
    {
      slug: "five",
      background: "/assets/images/5-background.jpg",
      thumbnail: "/assets/images/5-thumbnail.jpg",
      desc: "",
      alt: "Slide 5",
      content: <div>Slide 5 Content</div>,
    },
    {
      slug: "six",
      background: "/assets/images/6-background.jpg",
      thumbnail: "/assets/images/6-thumbnail.jpg",
      desc: "",
      alt: "Slide 6",
      content: <div>Slide 6 Content</div>,
    },
  ];

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="rico-slideshow/:slug"
          element={
            <Slideshow
              slides={slides}
              basePath="/rico-slideshow"
              initialAutoSlide={false}
            />
          }
        />
        <Route
          path="second-slideshow/:slug"
          element={<Slideshow slides={slides} basePath="/second-slideshow" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
