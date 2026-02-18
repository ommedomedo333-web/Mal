
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import './MiniCart.css';

interface MiniCartProps {
  onClose: () => void;
}

const MiniCart: React.FC<MiniCartProps> = ({ onClose }) => {
  const { cart, addToCart, removeFromCart, t, cartTotal, placeOrder, user, paymentMethod, setPaymentMethod, walletBalance } = useAppContext();
  const navigate = useNavigate();
  const deliveryAddress = user?.user_metadata;

  const handleCheckout = async () => {
    const success = await placeOrder();
    if (success) {
      onClose();
      navigate('/orders');
    }
  };

  return (
    <div className="mini-cart">
      <h3>{t.shoppingCart}</h3>
      {cart.length === 0 ? (
        <p>{t.cartIsEmpty}</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name.en} />
                <div className="item-details">
                  <p>{item.name.ar}</p>
                  <p>{item.price} EGP</p>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => addToCart(item)}>+</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => removeFromCart(item.id)}>-</button>
                </div>
              </div>
            ))}
          </div>

          {deliveryAddress && deliveryAddress.address_line1 && (
            <div className="delivery-address">
              <h4>{t.deliveryAddress}</h4>
              <p>{deliveryAddress.address_line1}</p>
            </div>
          )}

          <div className="payment-options">
            <h4>طريقة الدفع</h4>
            <div className="options">
              <button
                className={`option ${paymentMethod === 'wallet' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('wallet')}
              >
                المحفظة ({walletBalance.toFixed(2)} EGP)
              </button>
              <button
                className={`option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                الدفع عند الاستلام
              </button>
            </div>
          </div>

          <div className="cart-total">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <p>{t.total}: {cartTotal} EGP</p>
              <p style={{ color: '#F59E0B', fontWeight: 700, fontSize: '14px' }}>
                🪙 {cart.reduce((s, i) => s + Math.round(i.price * 10) * i.quantity, 0)} pts
              </p>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>{t.checkout}</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MiniCart;
