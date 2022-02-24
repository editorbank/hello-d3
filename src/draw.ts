import "./in_data";
import * as d3 from "d3";
import { Widget } from "./polymatica/widget";


export function draw(
  root: HTMLElement, 
  wiget : Widget, 
) {
  d3.select(root)
    .text('A diagram should be displayed here.')
    .append('p')
      .text(JSON.stringify(wiget))
  ;
}
