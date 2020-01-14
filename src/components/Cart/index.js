import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateItems, updateValues } from "../../store/actions/cart";
import ProductRow from "../ProductRow";
import products from "../../constants/products";
import coupons from "../../constants/coupons";
import "./styles.css";

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(state => state.items);
  const values = useSelector(state => state.values);

  const handleInputChange = ({ event, product }) => {
    dispatch(updateItems({ product, newQuantity: event.target.value }));
  };

  useEffect(() => {
    dispatch(updateValues());
  }, [items]);

  return (
    <div className="container">
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
        <span>Subtotal: {values.subtotal}</span>
        <span>Shipping price: {values.shippingPrice}</span>
        <span>Total: {values.total}</span>
      </div>
    </div>
  );
}
