import { InData } from "./in_data";
import * as d3 from "d3";

export function crop_string(s :string, maxLen :number = 0) :string {
  if(s.length > maxLen && maxLen !== 0)
    return s.substring(0,maxLen) + '...'
  else
    return s;
}

export function draw(elementSelector :string, in_data :InData){
  var svg = d3.select(elementSelector),
  margin = {top: 10, right: 0, bottom: 90, left: 90},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  var y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  ;

  in_data.labels = in_data.labels.map( s => crop_string(s,10));
  x.domain(in_data.labels);
  var maxValue = d3.max(in_data.values/*, d=>d*/); 
  y.domain([0, maxValue ]);

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
     .selectAll("text")
     .attr("transform", "translate(-20,0)rotate(-45)")
    //  .style("alignment-baseline", "after-edge")
    .style("alignment-baseline", "central")
    // .style("alignment-baseline", "middle")
    // .style("alignment-baseline", "before-edge")
    .style("text-anchor", "end")
    .style("font-size", '16px')
    .style("fill", "black")
  ;

  g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(5))
    .selectAll("text")
    .attr("transform", "translate(-0,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", '16px')
    .style("fill", "black")
  ;

  g.selectAll(".bar")
    .data(in_data.labels)
    .enter().append("rect")
    .attr("x", d => x(d))
    .data(in_data.values)
    .attr("y", d => y(d))
    .attr("class", v => v < in_data.overValue ? "bar" : "barover")
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d); })
  ;

}
