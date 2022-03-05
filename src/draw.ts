import { Range } from './Range';
import {
  SankeyGraph,
  SankeyNode,
  SankeyLink,
} from './SankeyGraph';
import {
  Node,
  NodeKey,
} from './Graph';

import "./in_data";
import * as d3 from "d3";

import { SamplePolymaticaWidget } from "./in_data";

function getDataColumNameByBlock(wiget: SamplePolymaticaWidget, blockName: string, blockCol = 0): string {
  if (!blockCol && blockCol !== 0) blockCol = 0
  return wiget.dataSettings.columnsByBlock[blockName][blockCol].path;
}
function getDataValue(wiget: SamplePolymaticaWidget, rowIndex: number, blockName: string, blockCol = 0): any {
  return wiget.data[rowIndex][getDataColumNameByBlock(wiget, blockName, blockCol)]
}


export function draw(
  root: HTMLElement,
  wiget: SamplePolymaticaWidget,
) {
  d3.select(root)
    .text('A diagram should be displayed here.')
    .append('pre')
    .text(wiget.data.reduce((p, c, i, a) => {
      return p +=
        getDataValue(wiget, i, 'FROM')
        + ','
        + getDataValue(wiget, i, 'TO')
        + ','
        + getDataValue(wiget, i, 'FLOW')
        + '\n'
    }, ''))
    ;


  const fromFieldName = getDataColumNameByBlock(wiget, 'FROM')
  const toFieldName = getDataColumNameByBlock(wiget, 'TO')
  const flowFieldName = getDataColumNameByBlock(wiget, 'FLOW')

  
  const graph = new SankeyGraph();
  wiget.data.forEach((row) => {
    const fromKey = Node.key(row[fromFieldName]);
    const toKey = Node.key(row[toFieldName]);
    const flow = row[flowFieldName] || 1;
    console.log(row + " " + fromKey + "---" + flow + "--->" + toKey);
    graph.addLink(fromKey, toKey, flow)

  });



  var currLevelX = 0; // текущий уровень узлов по X
  var currLevelY = 0; // текущий уровень узлов по Y
  const starts = new Array<SankeyNode>(); // Стартовые узлы
  const ends = new Array<SankeyNode>(); // конечные узлы
  var nexts = new Array<SankeyNode>(); // узлы для дальнейшей обработки
  // Первый проход по всем узлам
  graph.nodes.forEach(node => {

    // отбор начальных узлов
    if (node.in.length === 0) {
      starts.push(node);
      node.levelX = currLevelX;
      node.levelY = currLevelY++;
      node.out.forEach(link => nexts.push(graph.asNode(link.to)));
    }

    // Отбор конечных узлов
    if (node.out.length === 0) {
      ends.push(node);
    }

  });

  const rangeY = new Range().add(0);
  while (nexts.length) {
    const current = nexts; // узлы для текущей обработки
    nexts = new Array<SankeyNode>(); // узлы для дальнейшей обработки
    currLevelX++;
    currLevelY=0;
    current.forEach(node => {
      rangeY.add(currLevelY);
      node.levelX = currLevelX;
      node.levelY = currLevelY++;
      node.out.forEach(link => nexts.push(graph.asNode(link.to)));
    })
  };
  const rangeX = new Range().add(0).add(currLevelX);

  //console.log(`maxLevel=${maxLevel}`);
  // У становка для всех конечных узлов максимального уровня
  ends.forEach(node => {
    node.levelX = currLevelX
  })

  graph.nodes.forEach(n => console.log(`-${n.key} X=${n.levelX} Y=${n.levelY}`));

  console.log((graph.nodes));
  // console.log((graph.links));
  // console.log((graph.flows));
  console.log((`rangeX=${rangeX} rangeY=${rangeY}`));




}

