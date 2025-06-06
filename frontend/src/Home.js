import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container mt-5 text-center">
      <h2>ยินดีต้อนรับสู่ Ecommerce App</h2>
      <Link to="/products">
        <button className="btn btn-primary mt-3">ไปยัง Product Manager</button>
      </Link>
      <br />
      <Link to="/user">
        <button className="btn btn-primary mt-3">ไปยัง User</button>
      </Link>
      <br />
      <Link to="/game">
        <button className="btn btn-primary mt-3">ไปยัง game</button>
      </Link>
    </div>
  );
}