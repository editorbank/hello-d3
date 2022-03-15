import {
  SankeyGraph,
  setLevelX,
  setLevelY,
  loadFromWiget,
  drawGraph,
} from './SankeyGraph';

import "./in_data";

import { SamplePolymaticaWidget } from "./in_data";

export function draw(
  root: HTMLElement,
  wiget: SamplePolymaticaWidget,
) {
  const spaceY = (1); // вертикальное расстояние между узлами одного X-уровня в минимальных толшинах потоков
  const nodeWidth = (10); // ширина узла относительных пикселов 

  // создание графа и заполнение его внешними данными
  const graph = new SankeyGraph();
  loadFromWiget(graph, wiget);
  setLevelX(graph);
  setLevelY(graph, spaceY * graph.rangeFlow.min);

  // отрисовка
  drawGraph(graph, root, nodeWidth);

}

