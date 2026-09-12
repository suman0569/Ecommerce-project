
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/home.css';
import { Navigate, useNavigate } from 'react-router-dom';
import shop from "../assets/shop.jpg"

const Home = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home">

      <section className="hero">
        <div>
          <h1>Find Your Perfect Online shop</h1>
          <p>
            Stylish, comfortable and affordable items for every journey.
          </p>
          <button onClick={() => navigate('/shop')}>Shop Now</button>
        </div>

        <div className="hero-logo">
          <img src={shop} alt="Bag" />
        </div>
      </section>

      <section className="products">
        <h2>Featured Products</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>

      <section className="offer">
        <h2>Special Offer !</h2>
        <p>Get up to 20% off on selected items!</p>
        <button onClick={() => navigate('/shop')}>Shop Now</button>
      </section>

    </div>
  );
};

export default Home;
