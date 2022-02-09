export type HTMLColor = string | CanvasGradient | CanvasPattern; 

export interface InData {
  color: 'steelblue' | HTMLColor ;
  labels: string[];
  title?: string;
  values: number[];
  bottomValue?: number;
  overValue?: number | 'average' | 'max' | 'mode' | 'median';
  topValue?: number;
  overColor: 'brown' | HTMLColor;
  overLineColor: 'red' | HTMLColor;
  maxLabelLen?: 0 | number;
  verticalGridColor?: HTMLColor;
  fontName?: string;  
  fontSize?: number;
  fontColor?: HTMLColor;
}

var in_data :InData = {
  color: 'steelblue',
  labels: [ "США", "Индонезия (Очень длинное название)", "Китай", "Индия", "Бразилия", "Пакистан", "Нигерия", "Бангладеш", "Россия", "Япония"],
  title: 'Население',
  values: [326625791, 260580739, 1379302771, 1281935911, 207353391, 204924861, 190632261, 157826578, 142257519, 126451398],
  // topValue: 2_000_000_000,
  overValue: 400000000,
  // overValue: 'average',
  // overValue: 'median',
  //  bottomValue: 0,
  overColor: 'brown',
  overLineColor: 'red',
  maxLabelLen: 15,
  verticalGridColor: 'lightgray',
}

export default in_data;