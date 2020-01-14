import Cart from "../../classes/cart";

const INITIAL_STATE = {
  items: {},
  appliedCoupon: null,
  values: {
    total: 0,
    subtotal: 0,
    shippingPrice: 0
  }
};

export default function reducer(state = INITIAL_STATE, action) {
  const cart = Cart(state);
  console.log(state.items)
  switch (action.type) {
    case "UPDATE_ITEMS":
      return cart.updateItems(action.payload);
    case "UPDATE_VALUES":
      return cart.updateValues(action.payload);
    default:
      return INITIAL_STATE;
  }
}
