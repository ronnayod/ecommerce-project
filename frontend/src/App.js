import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ProductManager from './ProductManager';
import User from './User';
import 'bootstrap/dist/css/bootstrap.min.css';
import Game  from "./Game";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductManager />} />
          <Route path="/user" element={<User />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;