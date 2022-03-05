import { Node, Link, Graph, NodeKey, LinkKey } from "./Graph";

export class SankeyNode extends Node {
  levelX: number;
  levelY: number;
}

export class SankeyLink extends Link<SankeyNode> {
  flows: number[];
}


export class SankeyGraph extends Graph<SankeyNode, SankeyLink> {
  override newNode(nodeKey: NodeKey): SankeyNode {
    const node = super.newNode(nodeKey);
    return node;
  }
  override addLink(fromKey: NodeKey, toKey: NodeKey, flow?: number): SankeyLink {
    const retLink = super.addLink(fromKey, toKey);
    if (retLink.flows) {
      retLink.flows.push(flow);
    } else {
      retLink.flows = [flow];
    }
    return retLink;
  }
}