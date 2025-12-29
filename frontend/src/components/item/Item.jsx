import React from "react";
import "./Item.css";
import { Link } from "react-router-dom";

export default function Item({
  id,
  name,
  image,
  old_price,
  regularPrice,
  offer
}) {
  return (
    <div className="item-card">
      <div className="item-image-wrapper">
        <Link to={`/products/${id}`}>
          <img
            className="item-image"
            src={image}
            alt={name}
          />
        </Link>
      </div>

      <div className="item-info">
        <h4 className="item-title">{name}</h4>

        <div className="item-prices">
          <div className="item-new-price">
            ${regularPrice}
          </div>

          {offer && (
            <div className="item-old-price">
              ${old_price}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
