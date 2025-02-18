import couponsDiscounts from "../couponsDiscounts";
import update from "immutability-helper";

export default state => {
  const updateCart = ({ product, newQuantity }) => {
    const stateWithUpdatedItems = updateItems({ product, newQuantity });
    const stateWithUpdatedItemsAndWeight = updateWeight(stateWithUpdatedItems);
    return updateValues(stateWithUpdatedItemsAndWeight);
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

  const updateValues = state => {
    const newSubtotal = calcSubtotal(state.items);
    const newShippingPrice = calcShippingPrice(
      stateWithNewSubtotal(newSubtotal)
    );
    const newState = update(state, {
      values: {
        subtotal: { $set: newSubtotal },
        shippingPrice: { $set: newShippingPrice },
        total: { $set: newShippingPrice + newSubtotal }
      }
    });

    if (!state.appliedCoupon) {
      return newState;
    }

    const { appliedCoupon } = state;

    const couponDiscount = calcCouponDiscount({
      coupon: appliedCoupon,
      state: newState
    });

    return setValuesWithDiscount({ state: newState, couponDiscount });

    function stateWithNewSubtotal(newSubtotal) {
      return update(state, {
        values: { subtotal: { $set: newSubtotal } }
      });
    }
  };

  const calcSubtotal = items => {
    return Object.values(items).reduce((accumulated, item) => {
      return accumulated + item.product.pricePerKg * item.quantity;
    }, 0);
  };

  const calcShippingPrice = ({ values, weight }) => {
    if (values.subtotal === 0) {
      return 0;
    }

    if (weight <= 10) {
      return 30;
    }

    if (values.subtotal > 400) {
      return 0;
    }

    return 30 + Math.floor((weight - 10) / 5) * 7;
  };

  const calcCouponDiscount = ({ coupon, state }) => {
    return couponsDiscounts[coupon.type]({
      values: state.values,
      rule: coupon.rule
    });
  };

  const applyCoupon = coupon => {
    const stateWithoutCoupon = removeCoupon();

    if (!coupon) {
      return stateWithoutCoupon;
    }

    const couponDiscount = calcCouponDiscount({coupon, state: stateWithoutCoupon});
    const newState = update(stateWithoutCoupon, {
      appliedCoupon: { $set: coupon }
    });

    return setValuesWithDiscount({ coupon, couponDiscount, state: newState });
  };

  const setValuesWithDiscount = ({ couponDiscount, state }) => {
    const targetResult =
      state.values[couponDiscount.target] - couponDiscount.value;
    return update(state, {
      values: {
        [couponDiscount.target]: {
          $set: targetResult < 0 ? 0 : targetResult
        }
      }
    });
  };

  const removeCoupon = () => {
    const stateWithoutCoupon = update(state, {
      appliedCoupon: { $set: null }
    });
    return updateValues(stateWithoutCoupon);
  };

  return {
    updateCart,
    applyCoupon,
    removeCoupon
  };
};
