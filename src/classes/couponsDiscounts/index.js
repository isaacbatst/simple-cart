export default {
  percentual: ({ values: { subtotal }, discount }) => {
    return {
      value: subtotal * (discount / 100),
      target: "total"
    };
  },
  fixed: ({ discount }) => {
    return {
      value: discount,
      target: "total"
    };
  },
  freeShipping: ({ values, minimalSubtotal }) => {
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
