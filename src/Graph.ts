export type NodeId = string | number;
export type LinkId = string | number;

export interface INode {
  id:NodeId;
  in: Link[];
  out: Link[];
  isEmpty(): boolean;
}
export interface IFlow {
  width: number;
}
export interface ILink {
  from: INode;
  to: INode;
  flow: IFlow;
}

export interface INodes {
  [index: NodeId]: INode;
}

export interface ILinks {
  [index: LinkId]: ILink[];
}

export class Node implements INode {
  id: NodeId;
  in: Link[] = [];
  out: Link[] = [];

  constructor(id:NodeId) {
    this.id=id;
  }
  isEmpty(): boolean {
    return this.in.length === 0 && this.out.length === 0
  }
  static mkIndex(key: string | number): NodeId {
    return `${key}`
  }

}

export class Link implements ILink {
  name?: string;
  from: INode;
  to: INode;
  flow: IFlow;

  constructor(from: INode, to: INode, flow: IFlow) {
    this.from = from;
    this.to = to;
    this.flow = flow;
  }

  static mkIndex(fromKey: NodeId, toKey: NodeId): LinkId {
    return `${Node.mkIndex(fromKey)}->${Node.mkIndex(toKey)}`
  }
}

export class Graph {
  nodes: INodes = {};
  links: ILinks = {};
  isExistNode(nodeKey: NodeId):boolean{
    return !!this.nodes[nodeKey]
  }
  getOrCreateNodeById(nodeId: NodeId):Node{
    if(!this.isExistNode(nodeId)) this.nodes[nodeId] = new Node(nodeId);
    return this.nodes[nodeId];
  }
  isExistLink(linkKey: LinkId):boolean{
    return !!this.links[linkKey]
  }

  addLink(fromKey: NodeId, toKey: NodeId, flow?:IFlow): void {
    var from_node = this.getOrCreateNodeById(fromKey);
    var to_node = this.getOrCreateNodeById(toKey);
    var linkKey = Link.mkIndex(fromKey, toKey);
    var new_link = new Link(from_node, to_node, flow);
    from_node.out.push(new_link)
    to_node.in.push(new_link)
    // Nodes add
    // this.nodes[fromKey] = from_node;
    // this.nodes[toKey] = to_node;
    // Link add
    if (!this.isExistLink(linkKey)) {
      this.links[linkKey]=[];
    }
    this.links[linkKey].push(new_link);
  }
}