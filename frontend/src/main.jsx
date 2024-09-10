import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Payments from './pages/Payments';
import Payment from './pages/Payment';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="profile" element={<Profile />} />
          <Route path="payments" element={<Payments />} />
          <Route path="payments/:paymentType" element={<Payment />} />
          <Route path="rating" element={<></>} />
          <Route path="rules" element={<></>} />
          <Route path="friends" element={<></>} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);