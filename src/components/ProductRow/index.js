import React from "react";
import { useSelector } from "react-redux";
import "./style.css";

export default function ProductRow({ product, onInputChange }) {
  const items = useSelector(state => state.items);
  return (
    <div className="product-row" key={product.id}>
      <span className="product-name">{product.name}</span>
      <input
        type="number"
        step="1"
        min={0}
        className="product-quantity"
        onChange={event => onInputChange({ event, product })}
      />
      <div className="product-prices">
        {" "}
        {items[product.id] ? `$${items[product.id].subtotal}` : "-"}
      </div>
    </div>
  );
}
