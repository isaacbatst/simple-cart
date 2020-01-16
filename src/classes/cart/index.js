import couponsDiscounts from "../couponsDiscounts";
import update from "immutability-helper";

export default state => {
  const updateItemsAndWeight = ({ product, newQuantity }) => {
    const stateWithUpdatedItems = updateItems({ product, newQuantity });
    return updateWeight(stateWithUpdatedItems);
  };

  const updateItems = ({ product, newQuantity }) => {
    if (newQuantity > 0) {
      return setNewQuantity({ product, newQuantity });
    }
    return removeItem(product);
  };

  const setNewQuantity = ({ product, newQuantity }) => {
    return update(state, {
      items: {
        [product.id]: {
          $set: {
            product,
            quantity: newQuantity,
            subtotal: newQuantity * product.pricePerKg
          }
        }
      }
    });
  };

  const removeItem = product => {
    return update(state, {
      items: {
        $unset: [product.id]
      }
    });
  };

  const updateWeight = state => {
    return update(state, {
      weight: {
        $set: Object.values(state.items).reduce(
          (accumulatedWeight, { quantity }) => {
            return accumulatedWeight + parseInt(quantity);
          },
          0
        )
      }
    });
  };

  const updateValues = () => {
    const newSubtotal = calcSubtotal();
    const newState = update(state, {
      values: {
        subtotal: { $set: newSubtotal },
        total: { $set: state.values.shippingPrice + newSubtotal },
        shippingPrice: { $set: calcShippingPrice(state) }
      }
    });

    if (!state.appliedCoupon) {
      return newState;
    }

    const couponDiscount = calcCouponDiscount(state.appliedCoupon);

    return setValuesWithDiscount({ state: newState, couponDiscount });
  };

  const calcSubtotal = () => {
    return Object.values(state.items).reduce((accumulated, item) => {
      return accumulated + item.product.pricePerKg * item.quantity;
    }, 0);
  };

  const calcShippingPrice = ({ values, weight }) => {
    if (weight <= 10) {
      return 30;
    }
  };

  const calcCouponDiscount = coupon => {
    return couponsDiscounts[coupon.type]({
      values: state.values,
      rule: coupon.rule
    });
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

  const removeCoupon = () => {};

  return {
    updateItemsAndWeight,
    updateValues,
    applyCoupon,
    removeCoupon
  };
};
