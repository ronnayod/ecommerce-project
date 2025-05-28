import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container mt-5 text-center">
      <h2>ยินดีต้อนรับสู่ Ecommerce App</h2>
      <Link to="/products">
        <button className="btn btn-primary mt-3">ไปยัง Product Manager</button>
      </Link>
    </div>
  );
}