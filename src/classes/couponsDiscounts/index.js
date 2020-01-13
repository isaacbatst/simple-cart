export default {
  percentual: ({ values: { subtotal }, rule: discount }) => {
    return {
      value: subtotal * (discount / 100),
      target: "total"
    };
  },
  fixed: ({ rule: discount }) => {
    return {
      value: discount,
      target: "total"
    };
  },
  freeShipping: ({ values, rule: minimalSubtotal }) => {
    const target = "shippingPrice";

    if (values.subtotal >= minimalSubtotal) {
      return {
        value: values.shippingPrice,
        target
      };
    }

    return {
      value: 0,
      target
    };
  }
};
