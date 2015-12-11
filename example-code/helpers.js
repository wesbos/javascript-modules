const taxRate = 0.13;

export const couponCodes = ['BLACKFRIDAY', 'FREESHIP', 'HOHOHO'];

export function formatPrice(price) {
  return '$' + price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

export function addTax(price) {
  return price * (1 + taxRate);
}

export function discountPrice(price, percentage) {
  return price * (1 - percentage);
}

export function statement(){
  console.log("what");
};
