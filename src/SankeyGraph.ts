import { Node, Link, Graph, NodeKey, LinkKey } from "./Graph";
import { SamplePolymaticaWidget } from "./in_data";
import { Widget } from "./polymatica/widget";

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

export function newSankeyGraph(wiget: SamplePolymaticaWidget): SankeyGraph {

  //------ заполнение графа внешними данными ------

  function getDataColumNameByBlock(wiget: SamplePolymaticaWidget, blockName: string, blockCol = 0): string {
    if (!blockCol && blockCol !== 0) blockCol = 0
    return wiget.dataSettings.columnsByBlock[blockName][blockCol].path;
  }
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
  return graph;
}

export function setLevelX(graph: SankeyGraph): void {
  //------ обработка узлов, расстановка уровней (виртуальных координат) ------
  var currLevelX = 0; // текущий уровень узлов по X

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
}
