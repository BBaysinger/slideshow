import { BrowserRouter, Routes, Route } from "react-router-dom";

import Slideshow from "components/Slideshow/Slideshow";
import { Slide } from "components/Slideshow/Slideshow.types";
import "./App.css";

function App() {
  const slides: Slide[] = [
    {
      slug: "one",
      background: "1-background.jpg",
      thumbnail: "1-thumbnail.jpg",
      foreground: "1-foreground.jpg",
      desc: "",
      alt: "Slide 1",
      content: (
        <div>
          <button>Rico is back!</button>
          <div className="">RICOBOT</div>
          Charge into a brand-new supersized adventure with RICO across 50
          exciting and diverse worlds, available now on PS5!
          <button className="CTA">Learn More</button>
        </div>
      ),
    },
    {
      slug: "two",
      background: "2-background.jpg",
      thumbnail: "2-thumbnail.jpg",
      desc: "",
      alt: "Slide 2",
      content: <div></div>,
    },
    {
      slug: "three",
      background: "3-background.jpg",
      thumbnail: "3-thumbnail.jpg",
      desc: "",
      alt: "Slide 3",
      content: <div></div>,
    },
    {
      slug: "four",
      background: "4-background.jpg",
      thumbnail: "4-thumbnail.jpg",
      desc: "",
      alt: "Slide 4",
      content: <div></div>,
    },
    {
      slug: "five",
      background: "5-background.jpg",
      thumbnail: "5-thumbnail.jpg",
      desc: "",
      alt: "Slide 5",
      content: <div></div>,
    },
    {
      slug: "six",
      background: "6-background.jpg",
      thumbnail: "6-thumbnail.jpg",
      desc: "",
      alt: "Slide 6",
      content: <div></div>,
    },
  ];

  const heading = <h1>More from Rico the Dog</h1>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <a href="/ricoSlideshow" className="ricolink">
              To the Rico slideshow...
            </a>
          }
        />
        <Route
          path="/ricoSlideshow/:slug"
          element={
            <Slideshow
              heading={heading}
              slides={slides}
              interval={6000}
              prev={""}
              next={""}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
