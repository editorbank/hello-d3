
export type InData = {
  color :string;
  Xs :string[];
  labelY ?:string;
  Ys :number[];
  maxY :number;
  maxColor :string;
  maxLabelLen ?:number|0;
}

var in_data :InData = {
  color: 'rgba(0, 255, 0, 0.6)',
  Xs: [ "США", "Индонезия (Очень длинное название)", "Китай", "Индия", "Бразилия", "Пакистан", "Нигерия", "Бангладеш", "Россия", "Япония"],
  labelY: 'Население',
  Ys: [326625791, 260580739, 1379302771, 1281935911, 207353391, 204924861, 190632261, 157826578, 142257519, 126451398],
  maxY: 400000000,
  maxColor: 'rgba(255, 0, 0, 0.6)',
  maxLabelLen: 15,
}

export default in_data;