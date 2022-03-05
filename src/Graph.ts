export type NodeKey = string | number;
export type LinkKey = string | number;

export interface INode {
  in: Link[];
  out: Link[];
  isEmpty(): boolean;
  key: NodeKey;
}

export interface ILink {
  from: INode;
  to: INode;
  key: LinkKey;
}

export class Node implements INode {
  in = new Array<Link>();
  out = new Array<Link>();
  key: NodeKey;

  constructor(key: NodeKey) {
    this.key = key;
  }
  isEmpty(): boolean {
    return this.in.length === 0 && this.out.length === 0
  }
  static key(key: string | number): NodeKey {
    return `${key}`
  }

}

export class Link implements ILink {
  from: INode;
  to: INode;
  key: LinkKey;

  constructor(from: INode, to: INode) {
    this.from = from;
    this.to = to;
    this.key = Link.key(this.from.key, this.to.key)

  }

  static key(fromKey: NodeKey, toKey: NodeKey): LinkKey {
    return `${Node.key(fromKey)}->${Node.key(toKey)}`
  }
}

export class Graph<extNode extends Node, extLink extends Link> {
  nodes = new Map<NodeKey, extNode>();
  links = new Map<LinkKey, extLink>();

  newNode(nodeKey: NodeKey): extNode {
    return new Node(nodeKey) as any;
  }

  addNode(nodeKey: NodeKey): extNode {
    var ret_node: extNode;
    if (!this.nodes.has(nodeKey)) {
      ret_node = this.newNode(nodeKey);
      this.nodes.set(nodeKey, ret_node);
    } else {
      ret_node = this.nodes.get(nodeKey);
    }
    return ret_node;
  }
  newLink(fromNode: extNode, toNode: extNode): extLink {
    return new Link(fromNode, toNode) as any
  }
  addLink(fromKey: NodeKey, toKey: NodeKey): extLink {
    var retLink: extLink;
    const fromNode = this.addNode(fromKey);
    const toNode = this.addNode(toKey);

    const linkKey = Link.key(fromKey, toKey);
    if (!this.links.has(linkKey)) {
      retLink = this.newLink(fromNode, toNode);
      this.links.set(linkKey, retLink);
      fromNode.out.push(retLink);
      toNode.in.push(retLink);
    } else {
      retLink = this.links.get(linkKey)
    }
    return retLink;
  }
}
