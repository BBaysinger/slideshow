import { BrowserRouter, Routes, Route } from "react-router-dom";
import Slideshow from "components/Slideshow/Slideshow";
import { Slide } from "components/Slideshow/Slideshow.types";
import "./App.css";

function App() {
  const slides: Slide[] = [
    {
      id: "one",
      filename: "slide1.jpg",
      thumbnail: "thumbnail1.jpg",
      foreground: "foreground1.jpg",
      desc: "Description 1",
      alt: "Slide 1",
    },
    {
      id: "two",
      filename: "slide2.jpg",
      thumbnail: "thumbnail2.jpg",
      desc: "Description 2",
      alt: "Slide 2",
    },
    {
      id: "three",
      filename: "slide3.jpg",
      thumbnail: "thumbnail3.jpg",
      desc: "Description 3",
      alt: "Slide 3",
    },
    {
      id: "four",
      filename: "slide4.jpg",
      thumbnail: "thumbnail4.jpg",
      desc: "Description 4",
      alt: "Slide 4",
    },
    {
      id: "five",
      filename: "slide5.jpg",
      thumbnail: "thumbnail5.jpg",
      desc: "Description 5",
      alt: "Slide 5",
    },
    {
      id: "six",
      filename: "slide6.jpg",
      thumbnail: "thumbnail6.jpg",
      desc: "Description 1",
      alt: "Slide 6",
    },
  ];

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<a href="/ricoSlideshow" className="ricolink">To the Rico slideshow...</a>}
        />
        <Route path="/ricoSlideshow" element={<Slideshow slides={slides} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
