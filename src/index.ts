console.log("Hello from index.ts!");

import { canvas_draw } from "./canvas_draw";
import in_data from "./in_data";

function paragraph_draw(id :string, text :string) {
  var element = document.getElementById(id) as HTMLParagraphElement;
  if(element) element.innerText = text;
  else console.log("paragraph_draw(\""+id+"\",\""+text+"\"): Not found element!");
}

if(window) window.onload = function () {
  console.log("on_load() start...");
  paragraph_draw('messageTop',"Start Charting...");

  console.log("on_load() Find canvas element and draw it...");
  var canvas1 = (document.getElementById('myChart') as HTMLCanvasElement);
  if(canvas1){
    console.log("on_load() canvas1:" + canvas1);
    canvas_draw(canvas1, in_data);
  }

  paragraph_draw('messageBottom',"Done Charting.");
  console.log("on_load() done.");
}


console.log("Done index.ts.");
