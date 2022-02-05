import { InData } from "./in_data";

console.log("Hello from main_module.ts!");

export function crop_string(s :string, maxLen :number = 0) :string {
  if(s.length > maxLen && maxLen !== 0)
    return s.substring(0,maxLen) + '...'
  else
    return s;
}
export function canvas_draw(canvas :HTMLCanvasElement, in_data :InData){
  if(!canvas) return;
}

console.log("Done main_module.ts.");
