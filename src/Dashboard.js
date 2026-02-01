import React, { useState } from 'react';
import FoodMenu from './FoodMenu';
import './Dashboard.css';

function Dashboard({ onLogout, currentUser }) {
  const [activeTab, setActiveTab] = useState('menu');
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (item) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    if (quantity === 0) {
      handleRemoveFromCart(itemId);
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>FoodOrder Dashboard</h1>
            {currentUser && (
              <div className="user-welcome">
                <span className="welcome-text">Welcome, </span>
                <span className="user-name">{currentUser.name}</span>
              </div>
            )}
          </div>
          <div className="header-actions">
            <button className="cart-button" onClick={() => setActiveTab('cart')}>
              🛒 Cart ({getTotalItems()})
            </button>
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-button ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          Menu
        </button>
        <button
          className={`nav-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'menu' && (
          <FoodMenu onAddToCart={handleAddToCart} />
        )}
        
        {activeTab === 'cart' && (
          <div className="cart-section">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>${item.price.toFixed(2)}</p>
                      </div>
                      <div className="item-controls">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="quantity-button"
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="quantity-button"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="remove-button"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <h3>Total: ${getTotalPrice().toFixed(2)}</h3>
                  <button className="checkout-button">Proceed to Checkout</button>
                </div>
              </>
            )}
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Your Orders</h2>
            <p>No orders yet. Start ordering from the menu!</p>
          </div>
        )}
        
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Your Profile</h2>
            <div className="profile-info">
              <p><strong>Name:</strong> {currentUser?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {currentUser?.email || 'N/A'}</p>
              <p><strong>Phone:</strong> +1 234 567 8900</p>
              <p><strong>Address:</strong> 123 Main St, City, State 12345</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
