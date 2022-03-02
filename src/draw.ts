import { Range } from './Range';
import { 
  Node,
  Graph,
} from './Graph';

import "./in_data";
import * as d3 from "d3";

import { SamplePolymaticaWidget } from "./in_data";

function getDataColumNameByBlock(wiget: SamplePolymaticaWidget, blockName: string, blockCol = 0):string{
  if(!blockCol&&blockCol!==0) blockCol=0
  return wiget.dataSettings.columnsByBlock[blockName][blockCol].path;
}
function getDataValue(wiget: SamplePolymaticaWidget, rowIndex: number, blockName: string, blockCol = 0):any{
  return wiget.data[rowIndex][getDataColumNameByBlock(wiget, blockName, blockCol)]
}


export function draw(
  root: HTMLElement, 
  wiget : SamplePolymaticaWidget, 
) {
  d3.select(root)
    .text('A diagram should be displayed here.')
    .append('pre')
      .text(wiget.data.reduce((p,c,i,a)=>{
        return p+=
        getDataValue(wiget,i, 'FROM')
          +','
          +getDataValue(wiget,i, 'TO')
          +','
          +getDataValue(wiget,i, 'FLOW')
          +'\n'
      },''))
  ;


  var fromFieldName = getDataColumNameByBlock(wiget, 'FROM')
  var toFieldName = getDataColumNameByBlock(wiget, 'TO')
  var flowFieldName = getDataColumNameByBlock(wiget, 'FLOW')

  var rangeX=new Range();
  var graph = new Graph();
  for(var row in wiget.data){
    var fromKey = Node.mkIndex(wiget.data[row][fromFieldName]);
    var toKey = Node.mkIndex(wiget.data[row][toFieldName]);
    var flow = wiget.data[row][flowFieldName] || 1;
    console.log(row+" "+fromKey+"---"+flow+"--->"+toKey);
    graph.addLink(fromKey,toKey,{width: flow})

  }
  console.log((graph.nodes));
  console.log((graph.links));
  console.log((''+rangeX));
  
  


}



