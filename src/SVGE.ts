export function _SVGE(tag: string, params: any): any {
    var element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (var i in params) element.setAttributeNS(null, i, ''.concat(params[i]))
    return element;
}
export function _rect(p: object): SVGRectElement {
    return _SVGE('rect', p);
    // var rect = SVGE('rect',{x:x,y:y,width:w,height:h,fill:c}as SVGRectElement);
    // var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    // rect.setAttributeNS(null, 'x', x);
    // rect.setAttributeNS(null, 'y', y);
    // rect.setAttributeNS(null, 'width', w);
    // rect.setAttributeNS(null, 'height', h);
    // rect.setAttributeNS(null, 'fill', c);
    // return rect;
}
export function _svg(p: object): SVGElement {
    return _SVGE('svg', p);
}
export function _link(x1: number, y1: number, x2: number, y2: number, w: number, id: string): SVGPathElement {
    const FX = x1;
    const FY = y1;
    const tx = (x2 - x1);
    const ty = (y2 - y1);
    const mx = (tx) / 2;
    const ww = ty * w * .0015;

    var element = _SVGE('path', {
        d: `M ${FX},${FY}`
            + ` c ${mx + ww},${0}`
            + ` ${mx + ww},${ty}`
            + ` ${tx},${ty}`
            + ` v ${w}`
            + ` c ${-mx - ww},${0}`
            + ` ${-mx - ww},${-ty}`
            + ` ${-tx},${-ty}`
            + ` Z`,
        stroke: '',
        id: id,
    });
    // element.addEventListener('click', (e:PointerEvent)=>console.log(e));
    element.addEventListener('mouseover', (e: any) => title_on(titleType.link, e.path[0].id, e.offsetX, e.offsetY));
    element.addEventListener('mouseout', (e: any) => title_off(titleType.link, e.path[0].id));
    return element;
}

export function _node(x: number, y: number, width: number, height: number, id: string): SVGRectElement {
    var element = _rect({
        x: x,
        y: y,
        width: width,
        height: height,
        id: id,
    });
    // element.addEventListener('click', (e:PointerEvent)=>console.log(e));
    element.addEventListener('mouseover', (e: any) => title_on(titleType.node, e.path[0].id, e.offsetX, e.offsetY));
    element.addEventListener('mouseout', (e: any) => title_off(titleType.node, e.path[0].id));
    return element;
}
export enum titleType {
    node = 1,
    link = 2,
}
function title_on(t: titleType, id: string, x: number, y: number) {
    console.log(`title ON for ${titleType[t]} "${id}" at ${x}x${y}`)
}
function title_off(t: titleType, id: string) {
    console.log(`title OFF for ${titleType[t]} "${id}"`)
}