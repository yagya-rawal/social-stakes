import './App.css';
import Login from './Login/Login';
import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/User/Home';

function App() {
  return (
    
    <div className="App">
      
      <BrowserRouter>
      
      <Routes>
        
        <Route index element={<Home/>} />
        <Route path='/login' element={<Login />} />

      </Routes>
      
      </BrowserRouter >
    </div>
  );
}

export default App;
