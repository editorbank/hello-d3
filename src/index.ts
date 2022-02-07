import { draw } from "./draw";
import in_data from "./in_data";


if(window) window.onload = () => {
  draw('#myChart', in_data);
}
