import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCart } from "../../store/actions/cart";
import ProductRow from "../ProductRow";
import products from "../../constants/products";
import coupons from "../../constants/coupons";
import "./styles.css";

export default function Cart() {
  const dispatch = useDispatch();
  const values = useSelector(state => state.values);
  const weight = useSelector(state => state.weight);

  const handleInputChange = ({ event, product }) => {
    dispatch(updateCart({ product, newQuantity: event.target.value }));
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
      <div id="values-div">
        <span>Total weight: {weight} kg</span>
        <span>Subtotal: ${values.subtotal}</span>
        <span>Shipping price: ${values.shippingPrice}</span>
        <span>Total: ${values.total}</span>
      </div>
    </div>
  );
}
