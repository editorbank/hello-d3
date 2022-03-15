import { Node, Link, Graph, NodeKey } from "./Graph";
import { SamplePolymaticaWidget } from "./in_data";
import { Range } from "./Range";
import * as se from "./SVGE";


export class SankeyNode extends Node {
  levelX: number;
  levelY: number;
  flow: number;
}

export class SankeyLink extends Link<SankeyNode> {
  fromLevelY: number;
  toLevelY: number;
  flow: number;
}

export class SankeyGraph extends Graph<SankeyNode, SankeyLink> {
  rangeFlow = new Range();
  rangeX = new Range();
  rangeY = new Range();
  override newNode(nodeKey: NodeKey): SankeyNode {
    const node = super.newNode(nodeKey);
    return node;
  }
  override addLink(fromKey: NodeKey, toKey: NodeKey, flow?: number): SankeyLink {
    const retLink = super.addLink(fromKey, toKey);
    retLink.flow = flow;
    return retLink;
  }
}

//------ заполнение графа внешними данными из виджета ------
export function loadFromWiget(graph: SankeyGraph, wiget: SamplePolymaticaWidget): SankeyGraph {
  function getDataColumNameByBlock(wiget: SamplePolymaticaWidget, blockName: string, blockCol = 0): string {
    if (!blockCol && blockCol !== 0) blockCol = 0
    return wiget.dataSettings.columnsByBlock[blockName][blockCol].path;
  }
  const fromFieldName = getDataColumNameByBlock(wiget, 'FROM')
  const toFieldName = getDataColumNameByBlock(wiget, 'TO')
  const flowFieldName = getDataColumNameByBlock(wiget, 'FLOW')
  wiget.data.forEach((row) => {
    const fromKey = Node.key(row[fromFieldName]);
    const toKey = Node.key(row[toFieldName]);
    const flow = row[flowFieldName] || 1;
    // console.log(row + " " + fromKey + "---" + flow + "--->" + toKey);
    graph.addLink(fromKey, toKey, flow);
    graph.rangeFlow.add(flow);
  });
  return graph;
}

//------ обработка узлов, расстановка уровней (виртуальных координат) ------
export function setLevelX(graph: SankeyGraph): void {
  
  var currLevelX = 0; // текущий уровень узлов по X
  graph.rangeX.add(currLevelX);

  function getNodeFlow(node: SankeyNode): number {
    // Максимальная сумма величин входящих или исходящих потоков
    var oFlow = node.out.reduce((prev, link) => (prev += graph.asLink(link).flow), 0);
    var iFlow = node.in.reduce((prev, link) => (prev += graph.asLink(link).flow), 0);
    return Math.max(oFlow, iFlow);
  }

  // Первый проход по всем узлам
  var ends = new Array<SankeyNode>(); // конечные узлы
  var nexts = new Array<SankeyNode>(); // узлы для дальнейшей обработки
  graph.nodes.forEach(node => {
    node.flow = getNodeFlow(node); // вычисление высоты для всех узлов

    if (node.in.length === 0) {
      // Установка уровня по оси X для стартовых узлов
      node.levelX = currLevelX;
      // отбор следущих по уровню узлов в массив для последущей обработки
      node.out.forEach(link => nexts.push(graph.asNode(link.to)));
    }

    // Отбор конечных узлов
    if (node.out.length === 0) ends.push(node);

  });

  // цикл, пока есть узлы для последущей обработки
  while (nexts.length) {
    const current = nexts; // узлы для обработки в этом цикле
    nexts = new Array<SankeyNode>(); // узлы для обработки в следущем цикле
    currLevelX++;
    current.forEach(node => {
      node.levelX = currLevelX;
      node.out.forEach(link => nexts.push(graph.asNode(link.to)));
    })
  };

  // У становка для всех конечных узлов максимального X-уровня
  ends.forEach(node => { node.levelX = currLevelX });
  graph.rangeX.add(currLevelX);
}

export function setLevelY(graph: SankeyGraph, spaceNodesY:number): void {
  // сортировка всех связей по уменьшению величины потока (чтоб  сначала рисовались тостые потоки, затем тонкие)
  graph.links.sort((a, b) => {
    const w = (x: any) => graph.asLink(x).flow;
    return - ascend(w(a), w(b));
  })

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

  // console.log(nodesByLevelX);

  function ascend(a: any, b: any): -1 | 0 | 1 { return (a > b) ? 1 : (a < b) ? -1 : 0; }
  // console.log([3, 1, 2, 4, 0].sort(ascend));

  var currLevelY: Array<number> = []; // текущий уровень узлов по оси Y свой для каждого X

  { // Установка levelY только для начальных узлов
    let currLevelX = 0;
    nodesByLevelX[currLevelX].forEach(node => {

      currLevelY[currLevelX] = currLevelY[currLevelX] || 0;
      node.levelY = currLevelY[currLevelX];
      currLevelY[currLevelX] += node.flow + spaceNodesY;

      var outLevelY = node.levelY;
      node.out.sort((a, b) => {
        const y = (x: any) => graph.asLink(x).from.levelY;
        const w = (x: any) => graph.asLink(x).flow;
        return ascend(y(a), y(b)) || -ascend(w(a), w(b));
      }).forEach((link) => {
        var outLink = graph.asLink(link);
        outLink.fromLevelY = outLevelY;
        outLevelY += outLink.flow;
      });

      graph.rangeY.add(node.levelY+node.flow);
    });
  }


  // только для средних узлов
  if (nodesByLevelX.length > 2) for (var currLevelX = 1; currLevelX < nodesByLevelX.length-1; currLevelX++) {
    nodesByLevelX[currLevelX].forEach(node => {

      let prevNodeLevelY: number;
      node.in.forEach((link) => {
        var inLink = graph.asLink(link);
        if (!prevNodeLevelY || inLink.fromLevelY < prevNodeLevelY) prevNodeLevelY = inLink.fromLevelY;
      });

      currLevelY[currLevelX] = currLevelY[currLevelX] || prevNodeLevelY /*+ spaceNodesY*/ || 0;
      node.levelY = currLevelY[currLevelX];
      currLevelY[currLevelX] += node.flow + spaceNodesY;

      // let inLevelY = node.levelY;
      // node.in.sort((a, b) => {
      //   const y = (x: any) => graph.asLink(x).from.levelY;
      //   const w = (x: any) => graph.asLink(x).flow;
      //   return ascend(y(a), y(b)) || - ascend(w(a), w(b));
      // }).forEach((link) => {
      //   var inLink = graph.asLink(link);
      //   inLink.toLevelY = inLevelY;
      //   inLevelY += inLink.flow;
      // });

      graph.rangeY.add(node.levelY+node.flow);
    });
  }
  //*
  if (nodesByLevelX.length >= 1) { // Установка levelY только для конечных узлов
    let currLevelX = nodesByLevelX.length - 1;
    currLevelY[currLevelX] = 0;
    nodesByLevelX[currLevelX].forEach(node => {

      // currLevelY[currLevelX] = currLevelY[currLevelX] || 0;
      node.levelY = currLevelY[currLevelX];
      currLevelY[currLevelX] += node.flow + spaceNodesY;

      // var inLevelY = node.levelY;
      // node.in.sort((a, b) => {
      //   const y = (x: any) => graph.asLink(x).from.levelY;
      //   const w = (x: any) => graph.asLink(x).flow;
      //   return ascend(y(a), y(b)) || -ascend(w(a), w(b));
      // }).forEach((link) => {
      //   var inLink = graph.asLink(link);
      //   inLink.toLevelY = inLevelY;
      //   inLevelY += inLink.flow;
      // });

      graph.rangeY.add(node.levelY+node.flow);
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
        outLevelY += outLink.flow;
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
        inLevelY += inLink.flow;
      });
    });
  }
  //*/
}

//------ Отрисовка диаграммы ------
export function drawGraph(graph: SankeyGraph, root: HTMLElement, nodeWidth: number):void{

  const scaleY = (root.clientHeight)/graph.rangeY.max; // относительных пикселов на единицу потока
  const scaleX = (root.clientWidth - nodeWidth)/(graph.rangeX.max);

  var svg = se._svg({ height: root.clientHeight, width: root.clientWidth })
  root.appendChild(svg);

  graph.links.forEach(link => {
    svg.appendChild(se._link(
      nodeWidth + link.from.levelX * scaleX,
      link.fromLevelY * scaleY,
      link.to.levelX * scaleX,
      link.toLevelY * scaleY,
      link.flow * scaleY,
      `${link.key}`,
    ));
  });
  graph.nodes.forEach(node => {
    svg.appendChild(se._node(
      node.levelX * scaleX,
      node.levelY * scaleY,
      nodeWidth,
      node.flow * scaleY,
      `${node.key}`
    ));
  });

}
