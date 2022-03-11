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
  const spaceNodesY = 50; // вертикальное расстояние в относительных пикселях между узлами одного X-уровня
  const scaleX = 200;
  const scaleFlow = 20; // относительных пикселов на единицу потока
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

  const ascend = (a: any, b: any) => (a > b) ? 1 : (a < b) ? -1 : 0;
  // console.log([3, 1, 2, 4, 0].sort(ascend));

  //*
  graph.nodes.forEach(node => {
    // сортировка входящих потоков сначало самые дальние (меньшие по LevelX) и самые толстые
    node.in = node.in.sort((a, b) => {
      const x = (x: any) => graph.asLink(x).from.levelX;
      const w = (x: any) => graph.asLink(x).flow;
      return - ascend(w(a), w(b)) || ascend(x(a), x(b));
      // return ascend(x(a), x(b)) || - ascend(w(a), w(b));
    });
    // сортировка исходящих потоков сначало самые дальние (большие по LevelX) и самые толстые
    node.out = node.out.sort((a, b) => {
      const x = (x: any) => graph.asLink(x).to.levelX;
      const w = (x: any) => graph.asLink(x).flow;
      return - ascend(w(a), w(b)) || - ascend(x(a), x(b));
      // return - ascend(x(a), x(b)) || - ascend(w(a), w(b));
    });
  });
  //*/



  var currLevelY: Array<number> = []; // текущий уровень узлов по Y

  for (var currLevelX = rangeX.min as number; currLevelX <= rangeX.max; currLevelX++) {
    graph.nodes.forEach(node => {
      if (node.levelX === currLevelX) {
        rangeY.add(currLevelY[currLevelX]);

        if(!(currLevelX === rangeX.max)){
          var prevNodeLevelY:number = undefined;
          node.in.forEach((link, index) => {
            var inLink = graph.asLink(link);
            if(!prevNodeLevelY || inLink.fromLevelY < prevNodeLevelY) prevNodeLevelY = inLink.fromLevelY;
          });
        }
        currLevelY[currLevelX] = currLevelY[currLevelX] || prevNodeLevelY + spaceNodesY || 0;
        node.levelY = currLevelY[currLevelX];

        var inLevelY = node.levelY;
        node.in.forEach((link, index) => {
          var inLink = graph.asLink(link);
          inLink.toLevelY = inLevelY;
          inLevelY += inLink.flow * scaleFlow;
        });

        // node.out.forEach(link => nexts.push(graph.asNode(link.to)));
        var outLevelY = node.levelY;
        node.out.forEach((link, index) => {
          var outLink = graph.asLink(link);
          outLink.fromLevelY = outLevelY;
          outLevelY += outLink.flow * scaleFlow;
        });


        currLevelY[currLevelX] += node.flow * scaleFlow + spaceNodesY;
      }
    });
    // console.log(`===+ currLevelX:${currLevelX} ${nh}`);
  }

  // graph.nodes.forEach(n => console.log(`-${n.key} X=${n.levelX} Y=${n.levelY}`));


  // console.log((graph.nodes));
  // console.log((graph.links));
  // console.log((graph.flows));
  console.log((`rangeX=${rangeX} rangeY=${rangeY}`));
  console.log((`currLevelY=${currLevelY} `));

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

