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
import * as se from "./SVGE";

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

  //------ заполнение графа внешними данными ------

  const fromFieldName = getDataColumNameByBlock(wiget, 'FROM')
  const toFieldName = getDataColumNameByBlock(wiget, 'TO')
  const flowFieldName = getDataColumNameByBlock(wiget, 'FLOW')
  const graph = new SankeyGraph();
  wiget.data.forEach((row) => {
    const fromKey = Node.key(row[fromFieldName]);
    const toKey = Node.key(row[toFieldName]);
    const flow = row[flowFieldName] || 1;
    // console.log(row + " " + fromKey + "---" + flow + "--->" + toKey);
    graph.addLink(fromKey, toKey, flow)

  });

  //------ обработка узлов, расстановка уровней (виртуальных координат) ------
  var currBegin = 0;
  var currLevelX = 0; // текущий уровень узлов по X
  const starts = new Array<SankeyNode>(); // Стартовые узлы
  const ends = new Array<SankeyNode>(); // конечные узлы
  var nexts = new Array<SankeyNode>(); // узлы для дальнейшей обработки
  const rangeY = new Range().add(0);

  // параметры отображения
  const spaceNodesY = 20; // вертикальное расстояние в относительных пикселях между узлами одного X-уровня
  const scaleX = 200;
  const scaleY = 10;
  const scaleFlow = 10; // относительных пикселов на единицу потока
  var nodeWidth = 20; // ширина узла относительных пикселов 


  function getNodeFlow(node: SankeyNode): number {
    // Максимальная сумма величин входящих или исходящих потоков
    var oFlow = node.out.reduce((prev, link) => (prev += graph.asLink(link).flow), 0);
    var iFlow = node.in.reduce((prev, link) => (prev += graph.asLink(link).flow), 0);
    return Math.max(oFlow, iFlow);
  }

  // Первый проход по всем узлам расстановка уровня по оси X
  graph.nodes.forEach(node => {
    node.flow = getNodeFlow(node); // вычисление высоты узлов

    // отбор начальных узлов в отдельную колекцию
    if (node.in.length === 0) {
      starts.push(node);
      node.levelX = currLevelX;
      node.out.forEach(link => nexts.push(graph.asNode(link.to)));
    }

    // Отбор конечных узлов
    if (node.out.length === 0) {
      ends.push(node);
    }

  });

  while (nexts.length) {
    const current = nexts; // узлы для обработки в этом цикле
    nexts = new Array<SankeyNode>(); // узлы для обработки в следущем цикле
    currLevelX++;
    // currLevelY[currLevelX] = 0;
    current.forEach(node => {
      node.levelX = currLevelX;
      node.out.forEach(link => nexts.push(graph.asNode(link.to)));

      //EveryNodeByLevelX(node,currLevelX);
    })
  };
  const rangeX = new Range().add(0).add(currLevelX);

  // У становка для всех конечных узлов максимального X-уровня
  ends.forEach(node => { node.levelX = currLevelX })

  var currLevelY: Array<number> = []; // текущий уровень узлов по Y

  for (var currLevelX = rangeX.min as number; currLevelX <= rangeX.max; currLevelX++) {
    currLevelY[currLevelX] = 0;
    // currLevelY[currLevelX] = currLevelX === rangeX.min || currLevelX === rangeX.max ? 0 : currLevelY[currLevelX-1];
    currLevelY[currLevelX] = currLevelX === rangeX.min || currLevelX === rangeX.max ? 0 : currLevelY[currLevelX-1]/2;
    // currLevelY[currLevelX] = currLevelX === rangeX.min || currLevelX === rangeX.max ? 0 : nh;
    var nh = 0;
    graph.nodes.forEach(node => {
      if (node.levelX === currLevelX) {
        // EveryNodeByLevelX(node,currLevelX)
        // console.log(`--- currLevelX=${currLevelX} currLevelY[currLevelX]=${currLevelY[currLevelX]}`);
        rangeY.add(currLevelY[currLevelX]);
        // node.levelX = currLevelX;
        node.levelY = currLevelY[currLevelX] || graph.asLink(node.in).toLevelY || 0;

        // node.out.forEach(link => nexts.push(graph.asNode(link.to)));
        var outLevelY = node.levelY;
        node.out.forEach((link, index) => {
          var outLink = graph.asLink(link);
          outLink.fromLevelY = outLevelY;
          outLevelY += outLink.flow * scaleFlow;
        });

        var inLevelY = node.levelY;
        node.in.forEach((link, index) => {
          var inLink = graph.asLink(link);
          inLink.toLevelY = inLevelY;
          inLevelY += inLink.flow * scaleFlow;
        });

        currLevelY[currLevelX] += node.flow * scaleY + spaceNodesY;

        // console.log(`--- currLevelX:${currLevelX} ${node.key} ${node.flow}`);
        nh += (nh ? spaceNodesY : 0) + node.flow * scaleFlow;
      }
    });
    // console.log(`===+ currLevelX:${currLevelX} ${nh}`);
  }

  // graph.nodes.forEach(n => console.log(`-${n.key} X=${n.levelX} Y=${n.levelY}`));


  // console.log((graph.nodes));
  // console.log((graph.links));
  // console.log((graph.flows));
  // console.log((`rangeX=${rangeX} rangeY=${rangeY}`));
  // console.log((`currLevelY=${currLevelY} `));

  // console.log(root.clientWidth);

  //------ Отрисовка диаграммы ------

  var svg = se._svg({ height: root.clientHeight, width: root.clientWidth })
  root.appendChild(svg);

  graph.links.forEach(link => {
    svg.appendChild(se._flow(
      nodeWidth + link.from.levelX * scaleX,
      link.fromLevelY,
      link.to.levelX * scaleX,
      link.toLevelY,
      link.flow * scaleFlow,
      `link-${link.key}`,
    ));
  });
  graph.nodes.forEach(node => {
    svg.appendChild(se._rect({
      x: node.levelX * scaleX,
      y: node.levelY,
      width: nodeWidth,
      height: node.flow * scaleFlow,
    }));
  });





}

