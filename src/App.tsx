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
      desc: "Description 1",
      alt: "Slide 1",
    },
    {
      slug: "two",
      background: "2-background.jpg",
      thumbnail: "2-thumbnail.jpg",
      desc: "Description 2",
      alt: "Slide 2",
    },
    {
      slug: "three",
      background: "3-background.jpg",
      thumbnail: "3-thumbnail.jpg",
      desc: "Description 3",
      alt: "Slide 3",
    },
    {
      slug: "four",
      background: "4-background.jpg",
      thumbnail: "4-thumbnail.jpg",
      desc: "Description 4",
      alt: "Slide 4",
    },
    {
      slug: "five",
      background: "5-background.jpg",
      thumbnail: "5-thumbnail.jpg",
      desc: "Description 5",
      alt: "Slide 5",
    },
    {
      slug: "six",
      background: "6-background.jpg",
      thumbnail: "6-thumbnail.jpg",
      desc: "Description 6",
      alt: "Slide 6",
    },
  ];

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
            <Slideshow slides={slides} interval={6000} prev={""} next={""} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
