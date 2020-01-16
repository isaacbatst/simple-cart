import Cart from "./";
import products from '../../constants/products'
import { INITIAL_STATE } from "../../store/reducers/cart";

describe("test shipping price dynamic", () => {
  const cart = Cart(INITIAL_STATE);

  it("should return a shipping price of 30", () => {
    const stateWithItems = cart.updateItemsAndWeight({ product: products[0], newQuantity: 3 });
    const cartWithUpdatedValues = Cart(stateWithItems).updateValues();

    expect(cartWithUpdatedValues.values.shippingPrice).toBe(30);
  });

  it("should return a free shipping price", () => {
    const stateWithItems = cart.updateItemsAndWeight({ product: products[0], newQuantity: 41 });
    const cartWithUpdatedValues = Cart(stateWithItems).updateValues();
    console.log(cartWithUpdatedValues.values)

    expect(cartWithUpdatedValues.values.shippingPrice).toBe(0);
  })
});
