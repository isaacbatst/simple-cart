export function updateCart(payload){
  return {
    type: 'UPDATE_CART',
    payload
  }
}

export function applyCoupon(payload){
  return {
    type: 'APPLY_COUPON',
    payload
  }
}

export function removeCoupon(){
  return {
    type: 'REMOVE_COUPON',
  }
}