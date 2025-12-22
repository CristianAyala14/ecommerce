import React from 'react'
import "./OrderCard.css"
import { TbTrash } from "react-icons/tb";
import { NavLink } from "react-router-dom";


export default function OrderCard({id, img, title, regularPrice, quantity, removeItem, onUpdateQuantity }) {
  
  
  return (
    <div className='card-container'> 
      <div className='card-img-title'>
        <NavLink
          to={`/products/${id}`}
          className="card-link"
        >
          <img src={img} alt="Product Image." className='card-image' width={100}/>
        </NavLink>
        <p className='card-title'>{title}</p>
      </div>
      <div className="card-quantity">
        <button
          disabled={quantity <= 1}
          onClick={() => onUpdateQuantity(id, quantity - 1)}
        >
          -
        </button>

        <span>{quantity}</span>

        <button onClick={() => onUpdateQuantity(id, quantity + 1)}>
          +
        </button>
      </div>

      <div className='card-total-amount'>
        <p>${regularPrice * quantity}</p>
      </div>
      <div className='card-remove-button' >
        <button onClick={() => removeItem(id)}><TbTrash size={"0.6em"} color='red'/></button>
      </div>
    </div>
  )
}


