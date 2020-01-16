import Cart from "../../classes/cart";

export const INITIAL_STATE = {
  items: {},
  appliedCoupon: null,
  weight: 0,
  values: {
    total: 0,
    subtotal: 0,
    shippingPrice: 0
  }
};

export default function reducer(state = INITIAL_STATE, action) {
  const cart = Cart(state);
  switch (action.type) {
    case "UPDATE_CART":
      return cart.updateCart(action.payload);
    case "APPLY_COUPON":
      return cart.applyCoupon(action.payload.coupon);
    case "REMOVE_COUPON":
      return cart.removeCoupon();
    case "PURCHASE_CART":
      return INITIAL_STATE
    default:
      return INITIAL_STATE;
  }
}
