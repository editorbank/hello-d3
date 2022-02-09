import { InData } from "./in_data";
import * as d3 from "d3";

export function truncate_str(s :string, maxLen :number = 0) :string {
  if(s.length > maxLen && maxLen !== 0){
    var end = '…';
    return s.substring(0,maxLen - end.length) + end;
  } else {
    return s;
  }
}

export function draw(elementSelector :string, in_data :InData){
  var svg = d3.select(elementSelector),
  margin = {top: 10, right: 0, bottom: 90, left: 90},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;

  in_data.labels = in_data.labels.map( s => truncate_str(s,10));
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  x.domain(in_data.labels);

  var maxY = d3.max(in_data.values/*, d=>d*/); 
  var y = d3.scaleLinear()
    .rangeRound([height, 0])
    .domain([0, maxY ])
  ;
  
  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  ;

  if (in_data.overValue || in_data.overValue === 0)
    svg.append("path")
      .attr("d","M0,0l"+width+",0")
      .attr('stroke','red')
      .attr('stroke-width','.5')
      .attr('stroke-dasharray','10,5')
      .attr('transform', `translate(${margin.left},${margin.top+y(in_data.overValue)})`)
  ;

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("alignment-baseline", "baseline")
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
