import Cart from "./";
import products from "../../constants/products";
import coupons from "../../constants/coupons";

import { INITIAL_STATE } from "../../store/reducers/cart";

const emptyCart = Cart(INITIAL_STATE);

describe("test shipping price", () => {
  it("should return a shipping price of 30", () => {
    const updatedCart = emptyCart.updateCart({
      product: products[0],
      newQuantity: 3
    });
    expect(updatedCart.values.shippingPrice).toBe(30);
  });

  it("should return a free shipping price", () => {
    const updatedCart = emptyCart.updateCart({
      product: products[0],
      newQuantity: 41
    });
    expect(updatedCart.values.shippingPrice).toBe(0);
  });

  it("should return a shipping price based on how many 5kg above 10kg", () => {
    const updatedCartWithFiveMutipleKg = emptyCart.updateCart({
      product: products[0],
      newQuantity: 20
    });
    expect(updatedCartWithFiveMutipleKg.values.shippingPrice).toBe(44);

    const updatedCartWithoutFiveMutipleKg = emptyCart.updateCart({
      product: products[1],
      newQuantity: 17
    });
    expect(updatedCartWithoutFiveMutipleKg.values.shippingPrice).toBe(37);
  });
});

describe("test adding coupon", () => {
  const stateWithItems = emptyCart.updateCart({
    product: products[0],
    newQuantity: 20
  });

  const [percentual, fixed, freeShipping] = coupons;

  it("should return correct values after adding percentual discount", () => {
    const cart = Cart(stateWithItems);
    const {
      values: { total, subtotal, shippingPrice }
    } = cart.applyCoupon(percentual);
    const { rule } = percentual;

    expect(total).toBe(
      subtotal - calcSubtotalPercentage(rule, subtotal) + shippingPrice
    );

    function calcSubtotalPercentage(rule, subtotal) {
      return (rule / 100) * subtotal;
    }
  });

  it("should return correct values after adding fixed discount", () => {
    const cart = Cart(stateWithItems);
    const {
      values: { total, subtotal, shippingPrice }
    } = cart.applyCoupon(fixed);

    expect(total).toBe(subtotal - fixed.rule + shippingPrice);
  });

  it("should return no free shipping after adding coupon", () => {
    const cart = Cart(stateWithItems);
    const {
      values: { shippingPrice }
    } = cart.applyCoupon(freeShipping);
    expect(shippingPrice).toBeGreaterThan(0);
  });

  it("should return no free shipping after adding coupon", () => {
    const stateWithMuchMoreItems = emptyCart.updateCart({
      product: products[0],
      newQuantity: 350
    });

    const cart = Cart(stateWithMuchMoreItems);
    const {
      values: { shippingPrice, total, subtotal }
    } = cart.applyCoupon(freeShipping);

    expect(shippingPrice).toBe(0);
    expect(total).toBe(subtotal);
  });

  it("should unapply coupon when input null", () => {
    const cart = Cart(stateWithItems);
    const stateWithCoupon = cart.applyCoupon(percentual);
    const cartWithCoupon = Cart(stateWithCoupon);
    const stateWithoutCoupon = cartWithCoupon.applyCoupon(null);

    expect(stateWithoutCoupon.values.total).toBe(stateWithItems.values.total);
  });

  it("should unapply coupon when triggers removeCoupon", () => {
    const cart = Cart(stateWithItems);
    const stateWithCoupon = cart.applyCoupon(percentual);
    const cartWithCoupon = Cart(stateWithCoupon);
    const stateWithoutCoupon = cartWithCoupon.removeCoupon();

    expect(stateWithoutCoupon.values.total).toBe(stateWithItems.values.total);
  });

});
