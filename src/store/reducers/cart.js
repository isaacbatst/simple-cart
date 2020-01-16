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
  console.log(state)
  switch (action.type) {
    case "UPDATE_ITEMS":
      return cart.updateItemsAndWeight(action.payload);
    case "UPDATE_VALUES":
      return cart.updateValues(action.payload);
    default:
      return INITIAL_STATE;
  }
}
