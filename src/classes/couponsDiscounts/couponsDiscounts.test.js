import couponsDiscounts from "../couponsDiscounts";

describe("test fixed and percentual coupons", () => {
  const values = {
    subtotal: 20,
    total: 22,
    shippingPrice: 2
  };
  const rule = 5;

  it("should create a percentual coupon with correct values", () => {
    const discountApplied = couponsDiscounts.percentual({ values, rule });

    expect(discountApplied.value).toBe(1);
    expect(discountApplied.target).toEqual("total");
  });

  it("should create a fixed coupon with correct values", () => {
    const discountApplied = couponsDiscounts.fixed({ rule });

    expect(discountApplied.value).toBe(5);
    expect(discountApplied.target).toEqual("total");
  });
});

describe("test free shipping coupons", () => {
  const values = {
    subtotal: 10,
    total: 12,
    shippingPrice: 2
  };

  it("should create a free shipping coupon with a minimal subtotal", () => {
    const discountApplied = couponsDiscounts.freeShipping({
      values,
      rule: 10
    });

    expect(discountApplied.value).toBe(values.shippingPrice);
    expect(discountApplied.target).toBe("shippingPrice");
  });

  it("should try, but apply 0 free shipping discount", () => {
    const discountApplied = couponsDiscounts.freeShipping({
      values,
      minimalSubtotal: 20
    });

    expect(discountApplied.value).toBe(0);
    expect(discountApplied.target).toBe("shippingPrice");
  });
});
