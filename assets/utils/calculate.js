//相乘
export function mul(num1, num2) {
  var m = 0,
    r1,
    r2;
  var s1 = num1.toString();
  var s2 = num2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {}
  try {
    m += s2.split('.')[1].length;
  } catch (e) {}
  r1 = Number(num1.toString().replace('.', ''));
  r2 = Number(num2.toString().replace('.', ''));
  let res = (r1 * r2) / Math.pow(10, m);
  try {
    if ((res + '').split('.')[1].length >= 4) {
      res = parseFloat(res).toFixed(4);
      res = parseFloat(res);
    }
  } catch (e) {}
  return res;
}

//求和
export function add(num1, num2) {
  var r1, r2, m;
  try {
    r1 = num1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = num2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  let res = Math.round(num1 * m + num2 * m) / m;
  try {
    if ((res + '').split('.')[1].length >= 4) {
      res = parseFloat(res).toFixed(4);
      res = parseFloat(res);
    }
  } catch (e) {}
  return res;
}

//相减
export function sub(num1, num2) {
  var r1, r2, m, n;
  try {
    r1 = num1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = num2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  n = r1 >= r2 ? r1 : r2;
  let res = (Math.round(num1 * m - num2 * m) / m).toFixed(n);
  try {
    if ((res + '').split('.')[1].length >= 4) {
      res = parseFloat(res).toFixed(4);
      res = parseFloat(res);
    }
  } catch (e) {}

  return res;
}

//相除
export function accDiv(num1, num2) {
  var t1, t2, r1, r2;
  try {
    t1 = num1.toString().split('.')[1].length;
  } catch (e) {
    t1 = 0;
  }
  try {
    t2 = num2.toString().split('.')[1].length;
  } catch (e) {
    t2 = 0;
  }
  r1 = Number(num1.toString().replace('.', ''));
  r2 = Number(num2.toString().replace('.', ''));
  let res = (r1 / r2) * Math.pow(10, t2 - t1);
  try {
    if ((res + '').split('.')[1].length >= 4) {
      res = parseFloat(res).toFixed(4);
      res = parseFloat(res);
    }
  } catch (e) {}

  return res;
}

// 精确有效数字
export const toPrecision = (num, wei = 2) => {
  let n = Number(num).toPrecision(wei);
  return Number(n);
};
