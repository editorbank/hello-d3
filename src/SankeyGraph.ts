import { Node, Link, Graph, NodeKey } from "./Graph";

export interface SankeyNode extends Node {
  xLevel: number;
}

export interface SankeyLink extends Link {
  flows: number[];
}


export class SankeyGraph extends Graph<SankeyNode, SankeyLink> {
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