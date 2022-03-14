import { Range } from './Range';
import {
  SankeyGraph,
  SankeyNode,
  SankeyLink,
  newSankeyGraph,
  setLevelX,
} from './SankeyGraph';

import "./in_data";
import * as d3 from "d3";
import * as se from "./SVGE";

import { SamplePolymaticaWidget } from "./in_data";

export function draw(
  root: HTMLElement,
  wiget: SamplePolymaticaWidget,
) {

  // параметры отображения
  const scaleY = 29.9
  ; // относительных пикселов на единицу потока
  const scaleX = 203;

  const nodeWidth = (30); // ширина узла относительных пикселов 
  const spaceNodesY = (30); // вертикальное расстояние в относительных пикселях между узлами одного X-уровня

  // создание графа и заполнение его внешними данными
  const graph = newSankeyGraph(wiget);

  // сортировка всех связей по уменьшению величины потока (чтоб  сначала рисовались тостые потоки, затем тонкие)
  graph.links.sort((a, b) => {
    const w = (x: any) => graph.asLink(x).flow;
    return - ascend(w(a), w(b));
  })

  // расстановка всех узлов виртуальных координат по оси X и величины потока.
  setLevelX(graph);

  // создание массива узлов и сортировка его по увеличению Уровня X далее по уменьшению величины потока
  const nodes: SankeyNode[] = [];
  graph.nodes.forEach(node => nodes.push(node));
  nodes.sort((a, b) => {
    const x = (x: any) => graph.asNode(x).levelX;
    const w = (x: any) => graph.asNode(x).flow;
    return ascend(x(a), x(b)) || - ascend(w(a), w(b));
  });

  // массив массивов узлов по уровню X
  var nodesByLevelX = Array<Array<SankeyNode>>();
  nodes.forEach(node => {
    if (nodesByLevelX[node.levelX]) nodesByLevelX[node.levelX].push(node); else nodesByLevelX[node.levelX] = [node];
  });

  console.log(nodesByLevelX);

  function ascend(a: any, b: any): -1 | 0 | 1 { return (a > b) ? 1 : (a < b) ? -1 : 0; }
  // console.log([3, 1, 2, 4, 0].sort(ascend));


  var currLevelY: Array<number> = []; // текущий уровень узлов по оси Y свой для каждого X

  { // Установка levelY только для начальных узлов
    let currLevelX = 0;
    nodesByLevelX[currLevelX].forEach(node => {

      currLevelY[currLevelX] = currLevelY[currLevelX] || 0;
      node.levelY = currLevelY[currLevelX];
      currLevelY[currLevelX] += node.flow * scaleY + spaceNodesY;

      var outLevelY = node.levelY;
      node.out.sort((a, b) => {
        const y = (x: any) => graph.asLink(x).from.levelY;
        const w = (x: any) => graph.asLink(x).flow;
        return ascend(y(a), y(b)) || -ascend(w(a), w(b));
      }).forEach((link) => {
        var outLink = graph.asLink(link);
        outLink.fromLevelY = outLevelY;
        outLevelY += outLink.flow * scaleY;
      });

    });
  }


  // только для средних узлов
  if (nodesByLevelX.length > 2) for (var currLevelX = 1; currLevelX < nodesByLevelX.length; currLevelX++) {
    nodesByLevelX[currLevelX].forEach(node => {

      let prevNodeLevelY: number;
      node.in.forEach((link) => {
        var inLink = graph.asLink(link);
        if (!prevNodeLevelY || inLink.fromLevelY < prevNodeLevelY) prevNodeLevelY = inLink.fromLevelY;
      });

      currLevelY[currLevelX] = currLevelY[currLevelX] || prevNodeLevelY /*+ spaceNodesY*/ || 0;
      node.levelY = currLevelY[currLevelX];
      currLevelY[currLevelX] += node.flow * scaleY + spaceNodesY;

      let inLevelY = node.levelY;
      node.in.sort((a, b) => {
        const y = (x: any) => graph.asLink(x).from.levelY;
        const w = (x: any) => graph.asLink(x).flow;
        return ascend(y(a), y(b)) || - ascend(w(a), w(b));
      }).forEach((link) => {
        var inLink = graph.asLink(link);
        inLink.toLevelY = inLevelY;
        inLevelY += inLink.flow * scaleY;
      });

    });
  }
//*
  if (nodesByLevelX.length >= 1) { // Установка levelY только для конечных узлов
    let currLevelX = nodesByLevelX.length - 1;
    currLevelY[currLevelX] = 0;
    nodesByLevelX[currLevelX].forEach(node => {

      // currLevelY[currLevelX] = currLevelY[currLevelX] || 0;
      node.levelY = currLevelY[currLevelX];
      currLevelY[currLevelX] += node.flow * scaleY + spaceNodesY;

      var inLevelY = node.levelY;
      node.in.sort((a, b) => {
        const y = (x: any) => graph.asLink(x).from.levelY;
        const w = (x: any) => graph.asLink(x).flow;
        return ascend(y(a), y(b)) || -ascend(w(a), w(b));
      }).forEach((link) => {
        var inLink = graph.asLink(link);
        inLink.toLevelY = inLevelY;
        inLevelY += inLink.flow * scaleY;
      });


    });
  }
//*/
//*

  for (var currLevelX = 0; currLevelX < nodesByLevelX.length; currLevelX++) {
    nodesByLevelX[currLevelX].forEach(node => {

      let outLevelY = node.levelY;
      node.out.sort((a, b) => {
        const y = (x: any) => graph.asLink(x).to.levelY;
        const x = (x: any) => graph.asLink(x).to.levelX;
        const w = (x: any) => graph.asLink(x).flow;
        return ascend(y(a), y(b)) || ascend(x(a), x(b)) || -ascend(w(a), w(b));
      }).forEach((link) => {
        var outLink = graph.asLink(link);
        outLink.fromLevelY = outLevelY;
        outLevelY += outLink.flow * scaleY;
      });

      let inLevelY = node.levelY;
      node.in.sort((a, b) => {
        const y = (x: any) => graph.asLink(x).from.levelY;
        const x = (x: any) => graph.asLink(x).from.levelX;
        const w = (x: any) => graph.asLink(x).flow;
        return ascend(y(a), y(b)) || -ascend(x(a), x(b)) || -ascend(w(a), w(b));
      }).forEach((link) => {
        var inLink = graph.asLink(link);
        inLink.toLevelY = inLevelY;
        inLevelY += inLink.flow * scaleY;
      });

    });
  }
//*/

  // graph.nodes.forEach(n => console.log(`-${n.key} X=${n.levelX} Y=${n.levelY}`));


  // console.log((graph.nodes));
  // console.log((graph.links));
  // console.log((graph.flows));
  console.log((`currLevelY=${currLevelY} `));

  // console.log(root.clientWidth);

  //------ Отрисовка диаграммы ------

  var svg = se._svg({ height: root.clientHeight, width: root.clientWidth })
  root.appendChild(svg);

  graph.links.forEach(link => {
    svg.appendChild(se._link(
      nodeWidth + link.from.levelX * scaleX,
      link.fromLevelY,
      link.to.levelX * scaleX,
      link.toLevelY,
      link.flow * scaleY,
      `${link.key}`,
    ));
  });
  graph.nodes.forEach(node => {
    svg.appendChild(se._node(
      node.levelX * scaleX,
      node.levelY,
      nodeWidth,
      node.flow * scaleY,
      `${node.key}`
    ));
  });





}

