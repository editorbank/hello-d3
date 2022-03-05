export type NodeKey = string | number;
export type LinkKey = string | number;

// export interface INode {
//   in: Link[];
//   out: Link[];
//   isEmpty(): boolean;
//   key: NodeKey;
// }

// export interface ILink {
//   from: INode;
//   to: INode;
//   key: LinkKey;
// }

export class Node /*implements INode*/ {
  in = new Array<Link<Node>>();
  out = new Array<Link<Node>>();
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

export class Link<extNode extends Node> {
  from: extNode;
  to: extNode;
  key: LinkKey;

  constructor(from: extNode, to: extNode) {
    this.from = from;
    this.to = to;
    this.key = Link.key(this.from.key, this.to.key)

  }

  static key(fromKey: NodeKey, toKey: NodeKey): LinkKey {
    return `${Node.key(fromKey)}->${Node.key(toKey)}`
  }
}

export class Graph<extNode extends Node, extLink extends Link<extNode>> {
  _nodes = new Map<NodeKey, extNode>();
  _links = new Map<LinkKey, extLink>();
  
  get nodes():Map<NodeKey, extNode>{return this._nodes};
  get links():Map<LinkKey, extLink>{return this._links};

  asNode(node:any):extNode{return node}
  asLink(node:any):extLink{return node}

  newNode(nodeKey: NodeKey): extNode {
    return new Node(nodeKey) as any;
  }

  newLink(fromNode: extNode, toNode: extNode): extLink {
    return new Link<Node>(fromNode, toNode) as any
  }

  addNode(nodeKey: NodeKey): extNode {
    var retNode: extNode;
    if (!this._nodes.has(nodeKey)) {
      retNode = this.newNode(nodeKey);
      this._nodes.set(nodeKey, retNode);
    } else {
      retNode = this._nodes.get(nodeKey);
    }
    return retNode;
  }

  addLink(fromKey: NodeKey, toKey: NodeKey): extLink {
    var retLink: extLink;
    const fromNode = this.addNode(fromKey);
    const toNode = this.addNode(toKey);

    const linkKey = Link.key(fromKey, toKey);
    if (!this._links.has(linkKey)) {
      retLink = this.newLink(fromNode, toNode) as extLink;
      this._links.set(linkKey, retLink);
      fromNode.out.push(retLink);
      toNode.in.push(retLink);
    } else {
      retLink = this._links.get(linkKey)
    }
    return retLink;
  }
}
