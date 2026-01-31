import React, { useState } from 'react';
import './Dashboard.css';

const foodItems = [
  {
    id: 1,
    name: "Classic Burger",
    category: "Burgers",
    price: 12.99,
    description: "Juicy beef patty with lettuce, tomato, onion, and our special sauce",
    image: "🍔",
    rating: 4.5,
    prepTime: "15-20 min"
  },
  {
    id: 2,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 14.99,
    description: "Fresh mozzarella, tomato sauce, and basil on crispy crust",
    image: "🍕",
    rating: 4.8,
    prepTime: "20-25 min"
  },
  {
    id: 3,
    name: "Caesar Salad",
    category: "Salads",
    price: 8.99,
    description: "Romaine lettuce, parmesan, croutons, and caesar dressing",
    image: "🥗",
    rating: 4.2,
    prepTime: "5-10 min"
  },
  {
    id: 4,
    name: "Grilled Chicken Sandwich",
    category: "Sandwiches",
    price: 10.99,
    description: "Grilled chicken breast with avocado, bacon, and aioli",
    image: "🥪",
    rating: 4.6,
    prepTime: "12-15 min"
  },
  {
    id: 5,
    name: "Spaghetti Carbonara",
    category: "Pasta",
    price: 13.99,
    description: "Creamy pasta with bacon, eggs, and parmesan cheese",
    image: "🍝",
    rating: 4.7,
    prepTime: "18-22 min"
  },
  {
    id: 6,
    name: "Fish Tacos",
    category: "Mexican",
    price: 11.99,
    description: "Crispy fish with cabbage slaw, lime, and chipotle mayo",
    image: "🌮",
    rating: 4.4,
    prepTime: "15-18 min"
  },
  {
    id: 7,
    name: "Sushi Roll Combo",
    category: "Japanese",
    price: 16.99,
    description: "Assorted sushi rolls with salmon, tuna, and vegetables",
    image: "🍱",
    rating: 4.9,
    prepTime: "25-30 min"
  },
  {
    id: 8,
    name: "BBQ Ribs",
    category: "BBQ",
    price: 18.99,
    description: "Tender ribs with BBQ sauce, coleslaw, and fries",
    image: "🍖",
    rating: 4.6,
    prepTime: "25-30 min"
  },
  {
    id: 9,
    name: "Vegetable Stir Fry",
    category: "Asian",
    price: 9.99,
    description: "Mixed vegetables with tofu in soy-ginger sauce",
    image: "🥘",
    rating: 4.3,
    prepTime: "10-15 min"
  }
];

const categories = ["All", "Burgers", "Pizza", "Salads", "Sandwiches", "Pasta", "Mexican", "Japanese", "BBQ", "Asian"];

function FoodMenu({ onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = foodItems.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star">⭐</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star">⭐</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="star empty">☆</span>);
    }
    
    return stars;
  };

  return (
    <div className="food-menu">
      <div className="menu-header">
        <h2>Our Menu</h2>
        <div className="menu-controls">
          <input
            type="text"
            placeholder="Search food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category}
            className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="food-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="food-card">
            <div className="food-image">
              <span className="food-emoji">{item.image}</span>
            </div>
            <div className="food-info">
              <h3 className="food-name">{item.name}</h3>
              <p className="food-category">{item.category}</p>
              <p className="food-description">{item.description}</p>
              <div className="food-meta">
                <div className="rating">
                  {renderStars(item.rating)}
                  <span className="rating-text">({item.rating})</span>
                </div>
                <span className="prep-time">⏱️ {item.prepTime}</span>
              </div>
              <div className="food-footer">
                <span className="food-price">${item.price.toFixed(2)}</span>
                <button
                  className="add-to-cart-button"
                  onClick={() => onAddToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="no-results">
          <p>No food items found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

export default FoodMenu;
