import { Range } from './Range';
import {
  SankeyGraph,
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

  const rangeX = new Range();
  const graph = new SankeyGraph();
  wiget.data.forEach((row) => {
    const fromKey = Node.key(row[fromFieldName]);
    const toKey = Node.key(row[toFieldName]);
    const flow = row[flowFieldName] || 1;
    console.log(row + " " + fromKey + "---" + flow + "--->" + toKey);
    graph.addLink(fromKey, toKey, flow)

  });


  // Первый проход по всем узлам

  const levelNodes = new Map<NodeKey, number>();
  var currentLevel = 0; // текущий уровень узлов
  var isChanged = false; // флаг. Были изменения, нужен ещё один проход
  var minLinks: number = undefined; // Минимальное количество входящих связей в узлы 
  var starts = new Map<NodeKey, Node>(); // Стартовые узлы
  var ends = new Map<NodeKey, Node>(); // конечные узлы
  graph.nodes.forEach((node) => {

    // отбор начальных узлов
    if (node.in.length === 0) {
      starts.set(node.key, node);
      if (!levelNodes.has(node.key)) {
        levelNodes.set(node.key, currentLevel);
        isChanged = true;
      }
    }

    // Отбор конечных узлов
    if (node.out.length === 0) {
      ends.set(node.key, node);
    }

    if ('undefined' == typeof (minLinks) || minLinks > node.in.length) minLinks = node.in.length;

  });
  console.log(`minLinks=${minLinks} isChanged=${isChanged}`);


  /* Поиск узлов с минимальным количеством входящих связей
  graph.nodes.forEach((node) => {
    if (node.in.length === minLinks) {
      if (!levelNodes.has(node.key)) {
        levelNodes.set(node.key, currentLevel);
        isChanged = true;
      }
    }
  });
  //*/
  var maxLevel = currentLevel;
  while (isChanged && currentLevel < 10000) { // TODO убрать ограничение зацикливания 
    isChanged = false;
    graph.nodes.forEach(node => {
      if (levelNodes.has(node.key) && levelNodes.get(node.key) === currentLevel) {
        node.out.forEach((link) => {
          maxLevel = currentLevel + 1;
          levelNodes.set(link.to.key, maxLevel);
          isChanged = true;
        })
      }
    })
    currentLevel++;
  };

  console.log(`maxLevel=${maxLevel}`);
  // У становка для всех конечных узлов максимального уровня
  ends.forEach(node => {
    levelNodes.set(node.key, maxLevel);
  })

  // console.log((graph.nodes));
  // console.log((graph.links));
  // console.log((graph.flows));
  console.log((levelNodes));
  console.log(('' + rangeX));




}

