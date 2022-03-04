export type NodeId = string | number;
export type LinkId = string | number;

export interface INode {
  in: Link[];
  out: Link[];
  isEmpty(): boolean;
  key: NodeId;
}
// export interface IFlow {
//   width: number;
// }
export interface ILink {
  from: INode;
  to: INode;
  key: LinkId;
}

export class Node implements INode {
  in = new Array<Link>();
  out = new Array<Link>();
  key: NodeId;

  constructor(key: NodeId) {
    this.key = key;
  }
  isEmpty(): boolean {
    return this.in.length === 0 && this.out.length === 0
  }
  static key(key: string | number): NodeId {
    return `${key}`
  }

}

export class Link implements ILink {
  from: INode;
  to: INode;
  key: LinkId;

  constructor(from: INode, to: INode) {
    this.from = from;
    this.to = to;
    this.key = Link.key(this.from.key, this.to.key)

  }

  static key(fromKey: NodeId, toKey: NodeId): LinkId {
    return `${Node.key(fromKey)}->${Node.key(toKey)}`
  }
}

export class GraphBase {
  nodes = new Map<NodeId, Node>();
  links = new Map<LinkId, Link>();

  addNode(nodeKey: NodeId): Node {
    var ret_node;
    if (!this.nodes.has(nodeKey)) {
      ret_node = new Node(nodeKey);
      this.nodes.set(nodeKey, ret_node);
    } else {
      ret_node = this.nodes.get(nodeKey);
    }
    return ret_node;
  }

  addLink(fromKey: NodeId, toKey: NodeId): Link {
    var retLink;
    const fromNode = this.addNode(fromKey);
    const toNode = this.addNode(toKey);

    const linkKey = Link.key(fromKey, toKey);
    if (!this.links.has(linkKey)) {
      retLink = new Link(fromNode, toNode);
      this.links.set(linkKey, retLink);
      fromNode.out.push(retLink)
      toNode.in.push(retLink)
    } else {
      retLink = this.links.get(linkKey)
    }
    return retLink;
  }
}

export class GraphFlow<IFlow> extends GraphBase {
  flows = new Map<LinkId, IFlow[]>()
  override addLink(fromKey: NodeId, toKey: NodeId, flow?: IFlow): Link {
    const retLink = super.addLink(fromKey, toKey);
    const linkKey = retLink.key;
    if (this.flows.has(linkKey)) {
      this.flows.get(linkKey).push(flow);
    } else {
      this.flows.set(linkKey, [flow]);
    }
    return retLink;
  }
}