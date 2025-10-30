import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SharerDashboard from './pages/Sharer/SharerDashboard';
import ReceiverDashboard from './pages/Receiver/ReceiverDashboard';

export default function AppRoutes(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sharer' element={<SharerDashboard />} />
        <Route path='/receiver' element={<ReceiverDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
