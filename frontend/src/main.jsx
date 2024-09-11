import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Payments from './pages/Payments';
import Payment from './pages/Payment';
import Rating from './pages/Rating';
import Friends from './pages/Friends';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="payments" element={<Payments />} />
          <Route path="payments/:paymentType" element={<Payment />} />
          <Route path="rating" element={<Rating />} />
          <Route path="rules" element={<></>} />
          <Route path="friends" element={<Friends />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);