import React from "react";

export default function ProductRow({ product, onInputChange }) {
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
      <div className="product-prices">$10</div>
    </div>
  );
}
