import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCart,
  applyCoupon,
  removeCoupon
} from "../../store/actions/cart";
import ProductRow from "../ProductRow";
import products from "../../constants/products";
import coupons from "../../constants/coupons";
import "./styles.css";

export default function Cart() {
  const dispatch = useDispatch();
  const values = useSelector(state => state.values);
  const weight = useSelector(state => state.weight);
  const appliedCoupon = useSelector(state => state.appliedCoupon);

  const handleInputChange = ({ event, product }) => {
    dispatch(updateCart({ product, newQuantity: event.target.value }));
  };

  const handleCouponClick = coupon => {
    dispatch(applyCoupon({ coupon }));
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
  };

  return (
    <div className="container">
      <div className="cart-row">
        <div className="cart-title">Fruits</div>
        <div className="cart-title">KG</div>
        <div className="cart-title">Price</div>
      </div>
      <div>
        {products.map(product => (
          <ProductRow
            key={product.id}
            product={product}
            onInputChange={handleInputChange}
          />
        ))}
      </div>
      <h3>Values</h3>
      <div id="values-div">
        <span>Total weight: {weight} kg</span>
        <span>Subtotal: ${values.subtotal}</span>
        <span>Shipping price: ${values.shippingPrice}</span>
        <span>Total: ${values.total}</span>
      </div>
      <h3>Coupons</h3>
      <div id="coupons-div">
        {coupons.map(coupon => (
          <button
            key={coupon.id}
            onClick={
              appliedCoupon && coupon.id === appliedCoupon.id
                ? () => handleRemoveCoupon()
                : () => handleCouponClick(coupon)
            }
            className={`coupon-button 
            ${
              appliedCoupon && coupon.id === appliedCoupon.id
                ? "applied-coupon"
                : ""
            }`}
          >
            {coupon.name}
          </button>
        ))}
      </div>
      {appliedCoupon && (
        <div>
          <p>{appliedCoupon.description}</p>
          <button id="remove-coupon-button" onClick={handleRemoveCoupon}>
            Remove coupon
          </button>
        </div>
      )}
    </div>
  );
}
