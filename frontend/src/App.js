import './App.css';
import Login from './Login/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/User/Home';
import ChangePassword from './Login/ChangePassword';

function App() {

  const token = localStorage.getItem('token')
  
  return (

    <div className="App">

      <BrowserRouter>

        <Routes>

          <>
            <Route index element={<Home />} />

            <Route path='/login' element={<Login />} />
            <Route path='/change-password' element={<ChangePassword />} />
          </>

        </Routes>

      </BrowserRouter >
    </div>
  );
}

export default App;
