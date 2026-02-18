import React from 'react';
import './CartItem.css';

const CartItem = ({ item, onRemove, onQuantityChange }) => {
    return (
        <div className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
                <h4 className="cart-item-name">{item.name}</h4>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
                <div className="cart-item-quantity">
                    <button onClick={() => onQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onQuantityChange(item.id, item.quantity + 1)}>+</button>
                </div>
            </div>
            <button className="cart-item-remove" onClick={() => onRemove(item.id)}>Remove</button>
        </div>
    );
};

export default CartItem;