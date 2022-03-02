export interface IRange {
    min?:any;
    max?:any;
    isEmpty():boolean;
    expand(val:any):Range;
}

export class Range implements IRange {
    min:any;
    max:any;

    isEmpty():boolean{
      return 'undefined'===typeof(this.max) || 'undefined'===typeof(this.min);
    }

    expand(val:any):Range{
      if(this.isEmpty()){
        this.min=val;
        this.max=val;
      }
      if(val>this.max) this.max=val;
      if(val<this.min) this.min=val;
      return this;
    }
    
    toString():string {
      return `[${this.min}..${this.max}]`
    }
  }
