import Cart from "./";
import products from '../../constants/products'
import { INITIAL_STATE } from "../../store/reducers/cart";

describe("test shipping price dynamic", () => {
  const cart = Cart(INITIAL_STATE);

  it("should return a shipping price of 30", () => {
    const updatedCart = cart.updateCart({ product: products[0], newQuantity: 3 });
    expect(updatedCart.values.shippingPrice).toBe(30);
  });

  it("should return a free shipping price", () => {
    const updatedCart = cart.updateCart({ product: products[0], newQuantity: 41 });
    expect(updatedCart.values.shippingPrice).toBe(0);
  })

  it("should return a shipping price based on how many 5kg above 10kg", () => {
    const updatedCartWithFiveMutipleKg = cart.updateCart({ product: products[0], newQuantity: 20 });
    expect(updatedCartWithFiveMutipleKg.values.shippingPrice).toBe(44);

    const updatedCartWithoutFiveMutipleKg = cart.updateCart({product: products[1], newQuantity: 17})
    expect(updatedCartWithoutFiveMutipleKg.values.shippingPrice).toBe(37);
  })
});
