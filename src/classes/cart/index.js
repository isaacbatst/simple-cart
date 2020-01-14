import couponsDiscounts from "../couponsDiscounts";
import update from "immutability-helper";

export default state => {
  const updateItems = ({ product, newQuantity }) => {
    if (state.items[product.id] && newQuantity > 0) {
      return setQuantity({ product, newQuantity });
    }

    if (!state.items[product.id]) {
      return addNewItem({product, newQuantity});
    }

    return removeItem(product);
  };

  const setQuantity = ({ product, newQuantity }) => {
    return update(state, {
      items: {
        [product.id]: {
          $merge: {
            quantity: newQuantity
          }
        }
      }
    });
  };

  function addNewItem({product, newQuantity}) {
    return update(state, {
      items: {
        [product.id]: {
          $set: {
            product,
            quantity: newQuantity
          }
        }
      }
    });
  }

  function removeItem(product) {
    return update(state, {
      items: {
        $unset: [product.id]
      }
    });
  }

  const updateValues = () => {
    const newSubtotal = calcSubtotal();
    const newState = update(state, {
      values: {
        subtotal: { $set: newSubtotal },
        total: { $set: state.values.shippingPrice + newSubtotal }
      }
    });

    if (!state.appliedCoupon) {
      return newState;
    }

    const couponDiscount = calcCouponDiscount(state.appliedCoupon);

    return setValuesWithDiscount({ state: newState, couponDiscount });
  };

  const calcCouponDiscount = coupon => {
    return couponsDiscounts[coupon.type]({
      values: state.values,
      rule: coupon.rule
    });
  };

  const calcSubtotal = () => {
    return Object.values(state.items).reduce((accumulated, item) => {
      return accumulated + item.product.pricePerKg * item.quantity;
    }, 0);
  };

  const applyCoupon = coupon => {
    const couponDiscount = calcCouponDiscount(coupon);
    const newState = update(state, {
      appliedCoupon: { $set: coupon }
    });

    return setValuesWithDiscount({ coupon, couponDiscount, state: newState });
  };

  const setValuesWithDiscount = ({ couponDiscount, state }) => {
    return update(state, {
      values: {
        [couponDiscount.target]: {
          $set: state.values[couponDiscount.target] - couponDiscount.value
        }
      }
    });
  };

  return {
    updateItems,
    applyCoupon,
    updateValues
  };
};
