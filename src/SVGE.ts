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
export function _flow(x1:number, y1:number, x2:number, y2:number, w:number, id:string): SVGPathElement {
    const FX = x1;
    const FY = y1;
    const tx = (x2 - x1);
    const ty = (y2 - y1);
    const mx = (tx) / 2;
    const ww = ty * w * .0015;

    var flow = _SVGE('path', {
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
    // flow.addEventListener('click', (e:PointerEvent)=>console.log(e));
    flow.addEventListener('mouseover', (e:any)=>console.log(`onmouseover ${e.path[0].id} on ${e.offsetX}x${e.offsetY}`));
    // flow.addEventListener('mouseout', (e:any)=>console.log(`onmouseout ${e.path[0].id} off`));
    return flow;
}

