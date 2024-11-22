import SlideShow from "components/SlideShow/SlideShow";
import { Slide } from "components/SlideShow/SlideShow.types";
import "./App.css";

function App() {
  const slides: Slide[] = [
    {
      id: "one",
      filename: "slide1.jpg",
    },
    {
      id: "two",
      filename: "slide2.jpg",
    },
    {
      id: "three",
      filename: "slide3.jpg",
    },
  ];
  return (
    <>
      <SlideShow slides={slides}></SlideShow>
    </>
  );
}

export default App;
