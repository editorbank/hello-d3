import { draw } from "./draw";
import wiget from "./in_data";


if (window) window.onload = () => {
  // var rootElement = document.body ;
  var rootElement = document.getElementById('myChart');
  draw(rootElement, wiget);
}
